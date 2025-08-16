//! # Launchpool System (Staking)
//! 
//! Sistema de staking que permite aos usuários depositar LUNES para ganhar
//! poder de compra proporcional em fases de Launchpool.

#![allow(clippy::arithmetic_side_effects)]
#![allow(clippy::cast_possible_truncation)]
#![allow(clippy::derivable_impls)]

use ink::storage::Mapping;
use ink::prelude::vec::Vec;
use ink::prelude::string::String;
use scale::{Decode, Encode};

/// Informações de staking de um usuário
#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
pub struct StakeInfo {
    /// Quantidade de LUNES em staking
    pub amount: u128,
    /// Timestamp do último depósito
    pub last_stake_time: u64,
    /// Timestamp de quando pode fazer unstake (para implement lock periods futuramente)
    pub unlock_time: u64,
    /// Se o usuário está participando do launchpool atual
    pub is_participating: bool,
}

impl Default for StakeInfo {
    fn default() -> Self {
        Self {
            amount: 0,
            last_stake_time: 0,
            unlock_time: 0,
            is_participating: false,
        }
    }
}

/// Configuração de um Launchpool
#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
pub struct LaunchpoolConfig {
    /// ID do projeto
    pub project_id: String,
    /// Total de tokens disponíveis para venda via launchpool
    pub total_allocation: u128,
    /// Preço por token (em cents USD)
    pub price_per_token_cents: u32,
    /// Timestamp de início
    pub start_time: u64,
    /// Timestamp de fim
    pub end_time: u64,
    /// Mínimo de LUNES que deve estar em staking para participar
    pub min_stake_required: u128,
    /// Se está ativo
    pub is_active: bool,
}

impl Default for LaunchpoolConfig {
    fn default() -> Self {
        Self {
            project_id: String::new(),
            total_allocation: 0,
            price_per_token_cents: 0,
            start_time: 0,
            end_time: 0,
            min_stake_required: 0,
            is_active: false,
        }
    }
}

/// Alocação de um usuário em um launchpool
#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
pub struct UserAllocation {
    /// Quantidade máxima que o usuário pode comprar
    pub max_allocation: u128,
    /// Quantidade já comprada pelo usuário
    pub purchased_amount: u128,
    /// Poder de staking do usuário (porcentagem * 10000)
    pub staking_power: u32,
    /// Se já foi calculada a alocação
    pub is_calculated: bool,
}

impl Default for UserAllocation {
    fn default() -> Self {
        Self {
            max_allocation: 0,
            purchased_amount: 0,
            staking_power: 0,
            is_calculated: false,
        }
    }
}

/// Eventos do sistema de Launchpool
#[derive(Debug, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum LaunchpoolEvent {
    /// Usuário fez stake
    Staked {
        user: ink::primitives::AccountId,
        amount: u128,
        new_total: u128,
    },
    /// Usuário fez unstake
    Unstaked {
        user: ink::primitives::AccountId,
        amount: u128,
        remaining: u128,
    },
    /// Launchpool configurado
    LaunchpoolConfigured {
        project_id: String,
        total_allocation: u128,
        start_time: u64,
        end_time: u64,
    },
    /// Alocações calculadas
    AllocationsCalculated {
        project_id: String,
        total_stakers: u32,
        total_staked: u128,
    },
    /// Usuário comprou tokens via launchpool
    LaunchpoolPurchase {
        user: ink::primitives::AccountId,
        project_id: String,
        token_amount: u128,
        payment_amount: u128,
        currency: String,
    },
}

/// Trait que define as funcionalidades do sistema de Launchpool
pub trait LaunchpoolTrait {
    /// Fazer stake de LUNES
    fn stake(&mut self, amount: u128) -> Result<(), String>;
    
    /// Fazer unstake de LUNES
    fn unstake(&mut self, amount: u128) -> Result<(), String>;
    
    /// Configurar um novo launchpool
    fn configure_launchpool(&mut self, config: LaunchpoolConfig) -> Result<(), String>;
    
    /// Calcular alocações para todos os participantes
    fn calculate_allocations(&mut self, project_id: String) -> Result<(), String>;
    
    /// Comprar tokens via launchpool
    fn buy_from_launchpool(
        &mut self, 
        project_id: String, 
        token_amount: u128,
        currency: String
    ) -> Result<(), String>;
    
    /// Ver informações de stake do usuário
    fn get_stake_info(&self, user: ink::primitives::AccountId) -> StakeInfo;
    
    /// Ver alocação do usuário em um projeto
    fn get_user_allocation(
        &self, 
        user: ink::primitives::AccountId, 
        project_id: String
    ) -> UserAllocation;
    
    /// Ver configuração de um launchpool
    fn get_launchpool_config(&self, project_id: String) -> Option<LaunchpoolConfig>;
    
    /// Ver total em staking na plataforma
    fn get_total_staked(&self) -> u128;
    
    /// Ver lista de participantes ativos
    fn get_active_stakers(&self) -> Vec<ink::primitives::AccountId>;
}

/// Estrutura de storage para o sistema de Launchpool
#[derive(Debug, Default)]
pub struct LaunchpoolStorage {
    /// Informações de stake por usuário
    pub user_stakes: Mapping<ink::primitives::AccountId, StakeInfo>,
    /// Configurações de launchpool por projeto
    pub launchpool_configs: Mapping<String, LaunchpoolConfig>,
    /// Alocações de usuários por projeto
    pub user_allocations: Mapping<(ink::primitives::AccountId, String), UserAllocation>,
    /// Total de LUNES em staking
    pub total_staked: u128,
    /// Lista de usuários que fizeram stake
    pub stakers: Vec<ink::primitives::AccountId>,
    /// Projeto de launchpool ativo atual
    pub active_launchpool: Option<String>,
}

impl LaunchpoolStorage {
    /// Criar novo storage
    pub fn new() -> Self {
        Self {
            user_stakes: Mapping::default(),
            launchpool_configs: Mapping::default(),
            user_allocations: Mapping::default(),
            total_staked: 0,
            stakers: Vec::new(),
            active_launchpool: None,
        }
    }
    
    /// Adicionar ou atualizar stake de um usuário
    pub fn update_user_stake(
        &mut self, 
        user: ink::primitives::AccountId, 
        new_amount: u128,
        timestamp: u64
    ) {
        let mut stake_info = self.user_stakes.get(&user).unwrap_or_default();
        
        // Se é o primeiro stake, adicionar à lista de stakers
        if stake_info.amount == 0 && new_amount > 0 {
            if !self.stakers.contains(&user) {
                self.stakers.push(user);
            }
        }
        
        // Atualizar total staked
        self.total_staked = self.total_staked - stake_info.amount + new_amount;
        
        // Atualizar informações do usuário
        stake_info.amount = new_amount;
        stake_info.last_stake_time = timestamp;
        stake_info.unlock_time = timestamp; // Por enquanto sem lock period
        
        if new_amount == 0 {
            // Remover da lista se não tem mais stake
            if let Some(pos) = self.stakers.iter().position(|x| *x == user) {
                self.stakers.remove(pos);
            }
        }
        
        self.user_stakes.insert(&user, &stake_info);
    }
    
    /// Calcular poder de staking de um usuário (em basis points - 10000 = 100%)
    pub fn calculate_staking_power(&self, user: ink::primitives::AccountId) -> u32 {
        if self.total_staked == 0 {
            return 0;
        }
        
        let user_stake = self.user_stakes.get(&user).unwrap_or_default().amount;
        
        // Calcular porcentagem em basis points (10000 = 100%)
        ((user_stake * 10000) / self.total_staked) as u32
    }
    
    /// Verificar se um usuário pode participar de um launchpool
    pub fn can_participate(
        &self, 
        user: ink::primitives::AccountId, 
        project_id: &String
    ) -> bool {
        let config = match self.launchpool_configs.get(project_id) {
            Some(config) => config,
            None => return false,
        };
        
        let stake_info = self.user_stakes.get(&user).unwrap_or_default();
        
        config.is_active && stake_info.amount >= config.min_stake_required
    }
}

#[cfg(disabled_test)]
mod tests {
    use super::*;
    
    fn default_account() -> ink::primitives::AccountId {
        [0u8; 32].into()
    }
    
    fn account_from_u8(id: u8) -> ink::primitives::AccountId {
        let mut account = [0u8; 32];
        account[31] = id;
        account.into()
    }
    
    #[test]
    fn launchpool_storage_creation_works() {
        let storage = LaunchpoolStorage::new();
        assert_eq!(storage.total_staked, 0);
        assert_eq!(storage.stakers.len(), 0);
        assert!(storage.active_launchpool.is_none());
    }
    
    #[test]
    fn user_stake_update_works() {
        let mut storage = LaunchpoolStorage::new();
        let user = account_from_u8(1);
        
        // Primeiro stake
        storage.update_user_stake(user, 1000, 100);
        
        assert_eq!(storage.total_staked, 1000);
        assert_eq!(storage.stakers.len(), 1);
        assert!(storage.stakers.contains(&user));
        
        let stake_info = storage.user_stakes.get(&user).unwrap();
        assert_eq!(stake_info.amount, 1000);
        assert_eq!(stake_info.last_stake_time, 100);
    }
    
    #[test]
    fn staking_power_calculation_works() {
        let mut storage = LaunchpoolStorage::new();
        let user1 = account_from_u8(1);
        let user2 = account_from_u8(2);
        
        // User1 stakes 750, User2 stakes 250 (total 1000)
        storage.update_user_stake(user1, 750, 100);
        storage.update_user_stake(user2, 250, 100);
        
        assert_eq!(storage.calculate_staking_power(user1), 7500); // 75%
        assert_eq!(storage.calculate_staking_power(user2), 2500); // 25%
    }
    
    #[test]
    fn unstaking_works() {
        let mut storage = LaunchpoolStorage::new();
        let user = account_from_u8(1);
        
        // Stake and then unstake partially
        storage.update_user_stake(user, 1000, 100);
        storage.update_user_stake(user, 400, 200);
        
        assert_eq!(storage.total_staked, 400);
        assert_eq!(storage.stakers.len(), 1);
        
        // Complete unstake
        storage.update_user_stake(user, 0, 300);
        
        assert_eq!(storage.total_staked, 0);
        assert_eq!(storage.stakers.len(), 0);
    }
    
    #[test]
    fn launchpool_participation_check_works() {
        let mut storage = LaunchpoolStorage::new();
        let user = account_from_u8(1);
        let project_id = String::from("TEST_PROJECT");
        
        // Configure launchpool
        let config = LaunchpoolConfig {
            project_id: project_id.clone(),
            total_allocation: 1000000,
            price_per_token_cents: 100,
            start_time: 1000,
            end_time: 2000,
            min_stake_required: 500,
            is_active: true,
        };
        storage.launchpool_configs.insert(&project_id, &config);
        
        // User without enough stake cannot participate
        storage.update_user_stake(user, 400, 100);
        assert!(!storage.can_participate(user, &project_id));
        
        // User with enough stake can participate
        storage.update_user_stake(user, 600, 100);
        assert!(storage.can_participate(user, &project_id));
    }
}
