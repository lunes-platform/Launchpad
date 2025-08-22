use ink::prelude::vec::Vec;
use ink::storage::Mapping;

#[ink::contract]
mod reward_system {
    #[ink(storage)]
    pub struct RewardSystem {
        top_investors: Vec<(AccountId, u128)>,
        top_engagers: Vec<(AccountId, u128)>,
        reward_pool: Balance,
        last_distribution: Timestamp,
        marketing_fund: AccountId,
    }

    impl RewardSystem {
        #[ink(constructor)]
        pub fn new(marketing_fund: AccountId) -> Self {
            Self {
                top_investors: Vec::new(),
                top_engagers: Vec::new(),
                reward_pool: 0,
                last_distribution: 0,
                marketing_fund,
            }
        }

        #[ink(message)]
        pub fn update_investor(&mut self, investor: AccountId, amount: u128) {
            // Lógica para atualizar ranking de investidores
            self.top_investors.push((investor, amount));
            self.top_investors.sort_by(|a, b| b.1.cmp(&a.1));
        }
        
        #[ink(message)]
        pub fn distribute_rewards(&mut self) -> Result<(), Error> {
            // Verificar se já distribuiu este trimestre
            // Transferir 50% do marketing_fund
            // Distribuir proporcionalmente
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use ink::env::test;

    #[ink::test]
    fn test_update_investor_ranking() {
        let accounts = test::default_accounts();
        let mut contract = RewardSystem::new(accounts.alice);
        
        contract.update_investor(accounts.bob, 1000);
        contract.update_investor(accounts.charlie, 1500);
        
        assert_eq!(contract.top_investors[0].1, 1500);
    }
}
