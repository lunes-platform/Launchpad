#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// Simplified Phases System for Launchpad Lunes
/// This version focuses on the core functionality with proper Ink! types

#[ink::contract]
mod phases_system {
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Phase types
    #[derive(Debug, Clone, Copy, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub enum PhaseType {
        Whitelist,
        PreSale, 
        PublicSale,
        Launchpool,
        Raffle,
    }

    /// Main contract storage
    #[ink(storage)]
    pub struct PhasesSystem {
        /// Contract admin
        admin: AccountId,
        /// Phase configurations: project_id -> phase_type -> config
        phase_configs: Mapping<(Hash, u8), PhaseConfig>,
        /// User investments: (user, project_id, phase_type) -> amount
        user_investments: Mapping<(AccountId, Hash, u8), Balance>,
        /// Whitelist: (project_id, user) -> is_whitelisted
        whitelist: Mapping<(Hash, AccountId), bool>,
        /// External contributions: tx_hash -> verified
        external_txs: Mapping<Hash, bool>,
        /// Oracle addresses
        oracles: Vec<AccountId>,
        /// Paused state
        paused: bool,
    }

    /// Phase configuration
    #[derive(Debug, Clone, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct PhaseConfig {
        pub start_time: Timestamp,
        pub end_time: Timestamp,
        pub total_allocation: Balance,
        pub sold_amount: Balance,
        pub min_investment: Balance,
        pub max_investment: Balance,
        pub token_price: Balance,
        pub discount_percentage: u8,
        pub vesting_months: u8,
        pub active: bool,
    }

    /// Events
    #[ink(event)]
    pub struct PhaseCreated {
        #[ink(topic)]
        project_id: Hash,
        phase_type: u8,
        allocation: Balance,
    }

    #[ink(event)]
    pub struct Investment {
        #[ink(topic)]
        user: AccountId,
        #[ink(topic)]
        project_id: Hash,
        amount: Balance,
        phase: u8,
    }

    #[ink(event)]
    pub struct ExternalContribution {
        #[ink(topic)]
        project_id: Hash,
        buyer: AccountId,
        amount: Balance,
        tx_hash: Hash,
    }

    /// Errors
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        NotAuthorized,
        Paused,
        PhaseNotActive,
        InvalidAmount,
        NotWhitelisted,
        AlreadyProcessed,
        InvalidDiscount,
    }

    impl PhasesSystem {
        /// Constructor
        #[ink(constructor)]
        pub fn new(admin: AccountId) -> Self {
            Self {
                admin,
                phase_configs: Mapping::default(),
                user_investments: Mapping::default(),
                whitelist: Mapping::default(),
                external_txs: Mapping::default(),
                oracles: Vec::new(),
                paused: false,
            }
        }

        /// Create a new phase
        #[ink(message)]
        pub fn create_phase(
            &mut self,
            project_id: Hash,
            phase_type: PhaseType,
            start_time: Timestamp,
            end_time: Timestamp,
            allocation: Balance,
            min_investment: Balance,
            max_investment: Balance,
            token_price: Balance,
            discount: u8,
            vesting_months: u8,
        ) -> Result<(), Error> {
            // Only admin can create phases
            if self.env().caller() != self.admin {
                return Err(Error::NotAuthorized);
            }

            // Validate discount based on phase
            match phase_type {
                PhaseType::Whitelist => {
                    if discount < 40 || discount > 60 {
                        return Err(Error::InvalidDiscount);
                    }
                },
                PhaseType::PreSale => {
                    if discount < 15 || discount > 25 {
                        return Err(Error::InvalidDiscount);
                    }
                },
                PhaseType::PublicSale => {
                    if discount != 0 {
                        return Err(Error::InvalidDiscount);
                    }
                },
                _ => {}
            }

            let config = PhaseConfig {
                start_time,
                end_time,
                total_allocation: allocation,
                sold_amount: 0,
                min_investment,
                max_investment,
                token_price,
                discount_percentage: discount,
                vesting_months,
                active: true,
            };

            // Store using phase type as u8
            self.phase_configs.insert((project_id, phase_type as u8), &config);

            self.env().emit_event(PhaseCreated {
                project_id,
                phase_type: phase_type as u8,
                allocation,
            });

            Ok(())
        }

        /// Participate in a phase
        #[ink(message, payable)]
        pub fn participate(
            &mut self,
            project_id: Hash,
            phase_type: PhaseType,
        ) -> Result<(), Error> {
            if self.paused {
                return Err(Error::Paused);
            }

            let caller = self.env().caller();
            let amount = self.env().transferred_value();
            let phase_u8 = phase_type as u8;

            // Get phase config
            let mut config = self.phase_configs
                .get((project_id, phase_u8))
                .ok_or(Error::PhaseNotActive)?;

            // Check time
            let now = self.env().block_timestamp();
            if now < config.start_time || now > config.end_time {
                return Err(Error::PhaseNotActive);
            }

            // Check amount
            if amount < config.min_investment || amount > config.max_investment {
                return Err(Error::InvalidAmount);
            }

            // Check whitelist for Whitelist phase
            if phase_type == PhaseType::Whitelist {
                let is_whitelisted = self.whitelist.get((project_id, caller)).unwrap_or(false);
                if !is_whitelisted {
                    return Err(Error::NotWhitelisted);
                }
            }

            // Update user investment
            let key = (caller, project_id, phase_u8);
            let current = self.user_investments.get(key).unwrap_or(0);
            self.user_investments.insert(key, &(current + amount));

            // Update sold amount
            config.sold_amount += amount;
            self.phase_configs.insert((project_id, phase_u8), &config);

            self.env().emit_event(Investment {
                user: caller,
                project_id,
                amount,
                phase: phase_u8,
            });

            Ok(())
        }

        /// Register external contribution
        #[ink(message)]
        pub fn register_external_contribution(
            &mut self,
            project_id: Hash,
            buyer: AccountId,
            amount: Balance,
            tx_hash: Hash,
        ) -> Result<(), Error> {
            // Check oracle authorization
            if !self.oracles.contains(&self.env().caller()) {
                return Err(Error::NotAuthorized);
            }

            // Check if already processed
            if self.external_txs.get(tx_hash).unwrap_or(false) {
                return Err(Error::AlreadyProcessed);
            }

            // Mark as processed
            self.external_txs.insert(tx_hash, &true);

            self.env().emit_event(ExternalContribution {
                project_id,
                buyer,
                amount,
                tx_hash,
            });

            Ok(())
        }

        /// Add user to whitelist
        #[ink(message)]
        pub fn add_to_whitelist(
            &mut self,
            project_id: Hash,
            users: Vec<AccountId>,
        ) -> Result<(), Error> {
            if self.env().caller() != self.admin {
                return Err(Error::NotAuthorized);
            }

            for user in users {
                self.whitelist.insert((project_id, user), &true);
            }

            Ok(())
        }

        /// Add oracle
        #[ink(message)]
        pub fn add_oracle(&mut self, oracle: AccountId) -> Result<(), Error> {
            if self.env().caller() != self.admin {
                return Err(Error::NotAuthorized);
            }

            if !self.oracles.contains(&oracle) {
                self.oracles.push(oracle);
            }

            Ok(())
        }

        /// Pause contract
        #[ink(message)]
        pub fn pause(&mut self) -> Result<(), Error> {
            if self.env().caller() != self.admin {
                return Err(Error::NotAuthorized);
            }
            self.paused = true;
            Ok(())
        }

        /// Query functions
        #[ink(message)]
        pub fn get_phase_config(&self, project_id: Hash, phase_type: PhaseType) -> Option<PhaseConfig> {
            self.phase_configs.get((project_id, phase_type as u8))
        }

        #[ink(message)]
        pub fn get_user_investment(&self, user: AccountId, project_id: Hash, phase_type: PhaseType) -> Balance {
            self.user_investments.get((user, project_id, phase_type as u8)).unwrap_or(0)
        }

        #[ink(message)]
        pub fn is_whitelisted(&self, project_id: Hash, user: AccountId) -> bool {
            self.whitelist.get((project_id, user)).unwrap_or(false)
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::env::test;

        #[ink::test]
        fn constructor_works() {
            let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
            let contract = PhasesSystem::new(accounts.alice);
            assert_eq!(contract.admin, accounts.alice);
            assert!(!contract.paused);
        }

        #[ink::test]
        fn create_phase_works() {
            let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = PhasesSystem::new(accounts.alice);
            
            let project_id = Hash::from([1u8; 32]);
            let result = contract.create_phase(
                project_id,
                PhaseType::Whitelist,
                100,
                200,
                1_000_000,
                100,
                1_000,
                10,
                50, // 50% discount
                12, // 12 months vesting
            );
            
            assert!(result.is_ok());
            
            let config = contract.get_phase_config(project_id, PhaseType::Whitelist);
            assert!(config.is_some());
            assert_eq!(config.unwrap().discount_percentage, 50);
        }

        #[ink::test]
        fn whitelist_required_for_whitelist_phase() {
            let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = PhasesSystem::new(accounts.alice);
            
            let project_id = Hash::from([1u8; 32]);
            
            // Create whitelist phase
            contract.create_phase(
                project_id,
                PhaseType::Whitelist,
                0,
                1000,
                1_000_000,
                100,
                1_000,
                10,
                50,
                12,
            ).unwrap();
            
            // Try to participate without being whitelisted
            test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            test::set_value_transferred::<ink::env::DefaultEnvironment>(500);
            
            let result = contract.participate(project_id, PhaseType::Whitelist);
            assert_eq!(result, Err(Error::NotWhitelisted));
            
            // Add to whitelist
            test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            contract.add_to_whitelist(project_id, vec![accounts.bob]).unwrap();
            
            // Now can participate
            test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            test::set_value_transferred::<ink::env::DefaultEnvironment>(500);
            
            let result = contract.participate(project_id, PhaseType::Whitelist);
            assert!(result.is_ok());
            
            // Check investment
            let investment = contract.get_user_investment(accounts.bob, project_id, PhaseType::Whitelist);
            assert_eq!(investment, 500);
        }

        #[ink::test]
        fn external_contribution_works() {
            let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
            let mut contract = PhasesSystem::new(accounts.alice);
            
            // Add oracle
            contract.add_oracle(accounts.charlie).unwrap();
            
            let project_id = Hash::from([1u8; 32]);
            let tx_hash = Hash::from([2u8; 32]);
            
            // Register external contribution as oracle
            test::set_caller::<ink::env::DefaultEnvironment>(accounts.charlie);
            let result = contract.register_external_contribution(
                project_id,
                accounts.bob,
                1_000,
                tx_hash,
            );
            
            assert!(result.is_ok());
            
            // Try duplicate - should fail
            let result = contract.register_external_contribution(
                project_id,
                accounts.bob,
                1_000,
                tx_hash,
            );
            
            assert_eq!(result, Err(Error::AlreadyProcessed));
        }
    }
}
