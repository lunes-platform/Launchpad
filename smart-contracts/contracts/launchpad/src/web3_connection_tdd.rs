#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// Web3 Connection System for Launchpad Lunes - TDD Implementation
/// 
/// Features:
/// - Pure Web3 wallet connection (SubWallet, Polkadot.js)
/// - No mandatory KYC (only for high values >$10k)
/// - 3-click purchase process
/// - Maximum privacy preservation

#[ink::contract]
mod web3_connection_tdd {
    use ink::storage::Mapping;
    use ink::prelude::string::String;
    use ink::env::DefaultEnvironment;

    /// Main Web3 connection contract
    #[ink(storage)]
    pub struct Web3ConnectionTDD {
        /// System configuration
        admin: AccountId,
        
        /// Connected wallets and sessions
        connected_wallets: Mapping<AccountId, WalletSession>,
        
        /// KYC system (optional)
        kyc_thresholds: KYCThresholds,
        
        /// Purchase tracking for KYC thresholds
        daily_volumes: Mapping<(AccountId, u64), Balance>,
        monthly_volumes: Mapping<(AccountId, u64), Balance>,
        
        /// System statistics
        total_connections: u32,
        total_purchases: u32,
        total_volume: Balance,
        
        /// System state
        paused: bool,
    }

    /// Wallet session information
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct WalletSession {
        pub wallet_address: AccountId,
        pub wallet_type: WalletType,
        pub connection_timestamp: u64,
        pub session_id: String,
        pub kyc_status: KYCStatus,
        pub purchase_limit: Balance,
    }

    /// KYC thresholds configuration
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct KYCThresholds {
        pub no_kyc_limit: Balance,           // $10,000 per project
        pub daily_no_kyc_limit: Balance,     // $25,000 per day
        pub monthly_no_kyc_limit: Balance,   // $50,000 per month
    }

    /// Enums for various states
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum WalletType {
        SubWallet,
        PolkadotJs,
        MetaMask,
        Other(String),
    }

    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum KYCStatus {
        NotRequired,
        Required,
        Approved,
    }

    /// Events
    #[ink(event)]
    pub struct WalletConnected {
        #[ink(topic)]
        wallet_address: AccountId,
        wallet_type: WalletType,
        session_id: String,
    }

    #[ink(event)]
    pub struct PurchaseAttempt {
        #[ink(topic)]
        user_address: AccountId,
        amount: Balance,
        kyc_required: bool,
        approved: bool,
    }

    #[ink(event)]
    pub struct KYCTriggered {
        #[ink(topic)]
        user_address: AccountId,
        amount: Balance,
    }

    /// Errors
    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Web3Error {
        Unauthorized,
        WalletNotConnected,
        UnsupportedWallet,
        KYCRequired,
        ExceedsLimit,
        SystemPaused,
    }

    pub type Result<T> = core::result::Result<T, Web3Error>;

    impl Web3ConnectionTDD {
        /// Constructor
        #[ink(constructor)]
        pub fn new(admin: AccountId) -> Self {
            let kyc_thresholds = KYCThresholds {
                no_kyc_limit: 10_000_000_000_000,      // $10,000
                daily_no_kyc_limit: 25_000_000_000_000,   // $25,000/day
                monthly_no_kyc_limit: 50_000_000_000_000, // $50,000/month
            };

            Self {
                admin,
                connected_wallets: Mapping::default(),
                kyc_thresholds,
                daily_volumes: Mapping::default(),
                monthly_volumes: Mapping::default(),
                total_connections: 0,
                total_purchases: 0,
                total_volume: 0,
                paused: false,
            }
        }

        /// Connect Web3 wallet (main entry point)
        #[ink(message)]
        pub fn connect_wallet(
            &mut self,
            wallet_type: WalletType,
            session_id: String,
        ) -> Result<WalletSession> {
            if self.paused {
                return Err(Web3Error::SystemPaused);
            }

            let caller = self.env().caller();
            let current_time = ink::env::block_timestamp::<DefaultEnvironment>();

            // Create wallet session
            let session = WalletSession {
                wallet_address: caller,
                wallet_type: wallet_type.clone(),
                connection_timestamp: current_time,
                session_id: session_id.clone(),
                kyc_status: KYCStatus::NotRequired,
                purchase_limit: self.kyc_thresholds.no_kyc_limit,
            };

            // Store session
            self.connected_wallets.insert(&caller, &session);
            self.total_connections += 1;

            // Emit event
            self.env().emit_event(WalletConnected {
                wallet_address: caller,
                wallet_type,
                session_id,
            });

            Ok(session)
        }

        /// Attempt purchase with automatic KYC checking
        #[ink(message)]
        pub fn attempt_purchase(
            &mut self,
            amount: Balance,
        ) -> Result<bool> {
            if self.paused {
                return Err(Web3Error::SystemPaused);
            }

            let caller = self.env().caller();

            // Check if wallet is connected
            let session = self.connected_wallets.get(&caller)
                .ok_or(Web3Error::WalletNotConnected)?;

            // Check KYC requirements
            let kyc_required = self.check_kyc_requirements(caller, amount)?;

            if kyc_required && session.kyc_status != KYCStatus::Approved {
                self.env().emit_event(KYCTriggered {
                    user_address: caller,
                    amount,
                });

                self.env().emit_event(PurchaseAttempt {
                    user_address: caller,
                    amount,
                    kyc_required: true,
                    approved: false,
                });

                return Err(Web3Error::KYCRequired);
            }

            // Update purchase tracking
            self.update_purchase_tracking(caller, amount);

            // Update statistics
            self.total_purchases += 1;
            self.total_volume += amount;

            // Emit event
            self.env().emit_event(PurchaseAttempt {
                user_address: caller,
                amount,
                kyc_required,
                approved: true,
            });

            Ok(true)
        }

        /// Get wallet session information
        #[ink(message)]
        pub fn get_wallet_session(&self, wallet_address: AccountId) -> Option<WalletSession> {
            self.connected_wallets.get(&wallet_address)
        }

        /// Get system statistics
        #[ink(message)]
        pub fn get_system_stats(&self) -> (u32, u32, Balance) {
            (self.total_connections, self.total_purchases, self.total_volume)
        }

        /// Admin: Pause system
        #[ink(message)]
        pub fn pause_system(&mut self) -> Result<()> {
            if self.env().caller() != self.admin {
                return Err(Web3Error::Unauthorized);
            }
            self.paused = true;
            Ok(())
        }

        /// Helper functions
        fn check_kyc_requirements(&self, user_address: AccountId, amount: Balance) -> Result<bool> {
            let current_time = ink::env::block_timestamp::<DefaultEnvironment>();
            let today = current_time / 86400;
            let this_month = current_time / 2592000;

            let daily_spent = self.daily_volumes.get((user_address, today)).unwrap_or(0);
            let monthly_spent = self.monthly_volumes.get((user_address, this_month)).unwrap_or(0);

            // Check per-project limit
            if amount > self.kyc_thresholds.no_kyc_limit {
                return Ok(true);
            }

            // Check daily limit
            if daily_spent + amount > self.kyc_thresholds.daily_no_kyc_limit {
                return Ok(true);
            }

            // Check monthly limit
            if monthly_spent + amount > self.kyc_thresholds.monthly_no_kyc_limit {
                return Ok(true);
            }

            Ok(false)
        }

        fn update_purchase_tracking(&mut self, user_address: AccountId, amount: Balance) {
            let current_time = ink::env::block_timestamp::<DefaultEnvironment>();
            let today = current_time / 86400;
            let this_month = current_time / 2592000;

            // Update daily volume
            let daily_volume = self.daily_volumes.get((user_address, today)).unwrap_or(0);
            self.daily_volumes.insert((user_address, today), &(daily_volume + amount));

            // Update monthly volume
            let monthly_volume = self.monthly_volumes.get((user_address, this_month)).unwrap_or(0);
            self.monthly_volumes.insert((user_address, this_month), &(monthly_volume + amount));
        }
    }

    /// TDD Tests - Comprehensive test coverage
    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::env::test;

        /// Test 1: Constructor should initialize correctly
        #[ink::test]
        fn test_constructor() {
            let admin = AccountId::from([0x01; 32]);
            let contract = Web3ConnectionTDD::new(admin);

            let stats = contract.get_system_stats();
            assert_eq!(stats.0, 0); // total_connections
            assert_eq!(stats.1, 0); // total_purchases
            assert_eq!(stats.2, 0); // total_volume

            println!("✅ Test 1: Constructor initializes correctly");
        }

        /// Test 2: Wallet connection should work
        #[ink::test]
        fn test_wallet_connection() {
            let admin = AccountId::from([0x01; 32]);
            let user = AccountId::from([0x02; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Set caller to user
            test::set_caller::<ink::env::DefaultEnvironment>(user);

            // Connect SubWallet
            let result = contract.connect_wallet(
                WalletType::SubWallet,
                "session_001".to_string(),
            );

            assert!(result.is_ok());
            let session = result.unwrap();

            assert_eq!(session.wallet_address, user);
            assert_eq!(session.wallet_type, WalletType::SubWallet);
            assert_eq!(session.session_id, "session_001");
            assert_eq!(session.kyc_status, KYCStatus::NotRequired);
            assert_eq!(session.purchase_limit, 10_000_000_000_000); // $10k

            // Check statistics updated
            let stats = contract.get_system_stats();
            assert_eq!(stats.0, 1); // total_connections increased

            println!("✅ Test 2: Wallet connection works correctly");
        }

        /// Test 3: Small purchase should work without KYC
        #[ink::test]
        fn test_small_purchase_no_kyc() {
            let admin = AccountId::from([0x01; 32]);
            let user = AccountId::from([0x02; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Set caller to user
            test::set_caller::<ink::env::DefaultEnvironment>(user);

            // Connect wallet first
            let _session = contract.connect_wallet(
                WalletType::SubWallet,
                "session_002".to_string(),
            ).unwrap();

            // Attempt small purchase ($5,000)
            let result = contract.attempt_purchase(5_000_000_000_000);

            assert!(result.is_ok());
            assert_eq!(result.unwrap(), true);

            // Check statistics updated
            let stats = contract.get_system_stats();
            assert_eq!(stats.1, 1); // total_purchases increased
            assert_eq!(stats.2, 5_000_000_000_000); // total_volume updated

            println!("✅ Test 3: Small purchase works without KYC");
        }

        /// Test 4: Large purchase should require KYC
        #[ink::test]
        fn test_large_purchase_requires_kyc() {
            let admin = AccountId::from([0x01; 32]);
            let user = AccountId::from([0x02; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Set caller to user
            test::set_caller::<ink::env::DefaultEnvironment>(user);

            // Connect wallet first
            let _session = contract.connect_wallet(
                WalletType::PolkadotJs,
                "session_003".to_string(),
            ).unwrap();

            // Attempt large purchase ($15,000)
            let result = contract.attempt_purchase(15_000_000_000_000);

            assert!(result.is_err());
            assert_eq!(result.unwrap_err(), Web3Error::KYCRequired);

            // Check statistics NOT updated (purchase failed)
            let stats = contract.get_system_stats();
            assert_eq!(stats.1, 0); // total_purchases should be 0
            assert_eq!(stats.2, 0); // total_volume should be 0

            println!("✅ Test 4: Large purchase correctly requires KYC");
        }

        /// Test 5: Purchase without wallet connection should fail
        #[ink::test]
        fn test_purchase_without_connection() {
            let admin = AccountId::from([0x01; 32]);
            let user = AccountId::from([0x02; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Set caller to user (but don't connect wallet)
            test::set_caller::<ink::env::DefaultEnvironment>(user);

            // Attempt purchase without connecting wallet
            let result = contract.attempt_purchase(1_000_000_000_000);

            assert!(result.is_err());
            assert_eq!(result.unwrap_err(), Web3Error::WalletNotConnected);

            println!("✅ Test 5: Purchase without connection correctly fails");
        }

        /// Test 6: Daily limit should trigger KYC
        #[ink::test]
        fn test_daily_limit_triggers_kyc() {
            let admin = AccountId::from([0x01; 32]);
            let user = AccountId::from([0x02; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Set caller to user
            test::set_caller::<ink::env::DefaultEnvironment>(user);

            // Connect wallet
            let _session = contract.connect_wallet(
                WalletType::SubWallet,
                "session_004".to_string(),
            ).unwrap();

            // First purchase: $8,000 (should work)
            let result1 = contract.attempt_purchase(8_000_000_000_000);
            assert!(result1.is_ok());

            // Second purchase: $20,000 (should trigger daily limit)
            let result2 = contract.attempt_purchase(20_000_000_000_000);
            assert!(result2.is_err());
            assert_eq!(result2.unwrap_err(), Web3Error::KYCRequired);

            println!("✅ Test 6: Daily limit correctly triggers KYC");
        }

        /// Test 7: Admin functions should work
        #[ink::test]
        fn test_admin_functions() {
            let admin = AccountId::from([0x01; 32]);
            let user = AccountId::from([0x02; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Test pause by admin
            test::set_caller::<ink::env::DefaultEnvironment>(admin);
            let pause_result = contract.pause_system();
            assert!(pause_result.is_ok());

            // Test that user cannot connect when paused
            test::set_caller::<ink::env::DefaultEnvironment>(user);
            let connect_result = contract.connect_wallet(
                WalletType::SubWallet,
                "session_005".to_string(),
            );
            assert!(connect_result.is_err());
            assert_eq!(connect_result.unwrap_err(), Web3Error::SystemPaused);

            // Test that non-admin cannot pause
            let pause_result2 = contract.pause_system();
            assert!(pause_result2.is_err());
            assert_eq!(pause_result2.unwrap_err(), Web3Error::Unauthorized);

            println!("✅ Test 7: Admin functions work correctly");
        }

        /// Test 8: Session retrieval should work
        #[ink::test]
        fn test_session_retrieval() {
            let admin = AccountId::from([0x01; 32]);
            let user = AccountId::from([0x02; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Initially no session
            let session_before = contract.get_wallet_session(user);
            assert!(session_before.is_none());

            // Connect wallet
            test::set_caller::<ink::env::DefaultEnvironment>(user);
            let _session = contract.connect_wallet(
                WalletType::MetaMask,
                "session_006".to_string(),
            ).unwrap();

            // Now session should exist
            let session_after = contract.get_wallet_session(user);
            assert!(session_after.is_some());

            let retrieved_session = session_after.unwrap();
            assert_eq!(retrieved_session.wallet_type, WalletType::MetaMask);
            assert_eq!(retrieved_session.session_id, "session_006");

            println!("✅ Test 8: Session retrieval works correctly");
        }

        /// Test 9: Multiple wallet types should work
        #[ink::test]
        fn test_multiple_wallet_types() {
            let admin = AccountId::from([0x01; 32]);
            let user1 = AccountId::from([0x02; 32]);
            let user2 = AccountId::from([0x03; 32]);
            let user3 = AccountId::from([0x04; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Connect SubWallet
            test::set_caller::<ink::env::DefaultEnvironment>(user1);
            let session1 = contract.connect_wallet(
                WalletType::SubWallet,
                "session_subwallet".to_string(),
            ).unwrap();
            assert_eq!(session1.wallet_type, WalletType::SubWallet);

            // Connect Polkadot.js
            test::set_caller::<ink::env::DefaultEnvironment>(user2);
            let session2 = contract.connect_wallet(
                WalletType::PolkadotJs,
                "session_polkadotjs".to_string(),
            ).unwrap();
            assert_eq!(session2.wallet_type, WalletType::PolkadotJs);

            // Connect MetaMask
            test::set_caller::<ink::env::DefaultEnvironment>(user3);
            let session3 = contract.connect_wallet(
                WalletType::MetaMask,
                "session_metamask".to_string(),
            ).unwrap();
            assert_eq!(session3.wallet_type, WalletType::MetaMask);

            // Check total connections
            let stats = contract.get_system_stats();
            assert_eq!(stats.0, 3); // 3 connections

            println!("✅ Test 9: Multiple wallet types work correctly");
        }

        /// Test 10: Edge case - exactly at limit
        #[ink::test]
        fn test_edge_case_at_limit() {
            let admin = AccountId::from([0x01; 32]);
            let user = AccountId::from([0x02; 32]);

            let mut contract = Web3ConnectionTDD::new(admin);

            // Set caller to user
            test::set_caller::<ink::env::DefaultEnvironment>(user);

            // Connect wallet
            let _session = contract.connect_wallet(
                WalletType::SubWallet,
                "session_edge".to_string(),
            ).unwrap();

            // Purchase exactly at limit ($10,000)
            let result = contract.attempt_purchase(10_000_000_000_000);
            assert!(result.is_ok()); // Should work (at limit, not over)

            // Purchase $1 more ($10,000.000001)
            let result2 = contract.attempt_purchase(1_000_000);
            assert!(result2.is_err()); // Should fail (over daily limit now)
            assert_eq!(result2.unwrap_err(), Web3Error::KYCRequired);

            println!("✅ Test 10: Edge case at limit works correctly");
        }
    }
}
