//! # Raffle System (Loteria)
//! 
//! Sistema de raffle/loteria que permite aos usuários participar de sorteios
//! para ganhar alocações de tokens em projetos especiais.

#![allow(clippy::arithmetic_side_effects)]
#![allow(clippy::cast_possible_truncation)]
#![allow(clippy::derivable_impls)]
#![allow(clippy::identity_op)]

use ink::storage::Mapping;
use ink::prelude::vec::Vec;
use ink::prelude::string::String;
use scale::{Decode, Encode};

/// Estados possíveis de um raffle
#[derive(Debug, Clone, Copy, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
pub enum RaffleStatus {
    /// Raffle está aberto para inscrições
    Open,
    /// Raffle foi finalizado, aguardando sorteio
    Closed,
    /// Sorteio foi realizado, aguardando claims
    Drawn,
    /// Raffle foi cancelado
    Cancelled,
}

impl Default for RaffleStatus {
    fn default() -> Self {
        Self::Open
    }
}

/// Informações de um participante no raffle
#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
pub struct RaffleParticipant {
    /// Quantidade de tickets comprados
    pub tickets: u32,
    /// Se o usuário foi sorteado
    pub is_winner: bool,
    /// Alocação ganha (se foi sorteado)
    pub allocation_won: u128,
    /// Se já fez claim da alocação
    pub has_claimed: bool,
    /// Timestamp da participação
    pub participation_time: u64,
}

impl Default for RaffleParticipant {
    fn default() -> Self {
        Self {
            tickets: 0,
            is_winner: false,
            allocation_won: 0,
            has_claimed: false,
            participation_time: 0,
        }
    }
}

/// Configuração de um Raffle
#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
pub struct RaffleConfig {
    /// ID do projeto
    pub project_id: String,
    /// Total de tokens disponíveis para o raffle
    pub total_allocation: u128,
    /// Preço por token (em cents USD)
    pub price_per_token_cents: u32,
    /// Preço por ticket (em LUNES - valor mínimo)
    pub ticket_price: u128,
    /// Máximo de tickets por usuário
    pub max_tickets_per_user: u32,
    /// Número de vencedores
    pub num_winners: u32,
    /// Timestamp de início das inscrições
    pub start_time: u64,
    /// Timestamp de fim das inscrições
    pub end_time: u64,
    /// Timestamp do sorteio
    pub draw_time: u64,
    /// Status atual do raffle
    pub status: RaffleStatus,
    /// Requisito mínimo de KYC para participar
    pub requires_kyc: bool,
}

impl Default for RaffleConfig {
    fn default() -> Self {
        Self {
            project_id: String::new(),
            total_allocation: 0,
            price_per_token_cents: 0,
            ticket_price: 1 * 10u128.pow(12), // 1 LUNES por padrão
            max_tickets_per_user: 10,
            num_winners: 100,
            start_time: 0,
            end_time: 0,
            draw_time: 0,
            status: RaffleStatus::Open,
            requires_kyc: true,
        }
    }
}

/// Resultado de um sorteio
#[derive(Debug, Clone, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
pub struct DrawResult {
    /// Hash usado como seed para o sorteio
    pub random_seed: u64,
    /// Lista de vencedores
    pub winners: Vec<ink::primitives::AccountId>,
    /// Alocação por vencedor
    pub allocation_per_winner: u128,
    /// Timestamp do sorteio
    pub draw_timestamp: u64,
}

impl Default for DrawResult {
    fn default() -> Self {
        Self {
            random_seed: 0,
            winners: Vec::new(),
            allocation_per_winner: 0,
            draw_timestamp: 0,
        }
    }
}

/// Eventos do sistema de Raffle
#[derive(Debug, PartialEq, Eq, Encode, Decode)]
#[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
pub enum RaffleEvent {
    /// Raffle configurado
    RaffleConfigured {
        project_id: String,
        total_allocation: u128,
        num_winners: u32,
        start_time: u64,
        end_time: u64,
    },
    /// Usuário comprou tickets
    TicketsPurchased {
        user: ink::primitives::AccountId,
        project_id: String,
        tickets: u32,
        total_cost: u128,
    },
    /// Sorteio realizado
    RaffleDrawn {
        project_id: String,
        num_winners: u32,
        allocation_per_winner: u128,
        random_seed: u64,
    },
    /// Vencedor fez claim da alocação
    AllocationClaimed {
        user: ink::primitives::AccountId,
        project_id: String,
        allocation: u128,
    },
    /// Raffle foi cancelado
    RaffleCancelled {
        project_id: String,
        refund_total: u128,
    },
}

/// Trait que define as funcionalidades do sistema de Raffle
pub trait RaffleTrait {
    /// Configurar um novo raffle
    fn configure_raffle(&mut self, config: RaffleConfig) -> Result<(), String>;
    
    /// Comprar tickets para participar do raffle
    fn buy_raffle_tickets(&mut self, project_id: String, tickets: u32) -> Result<(), String>;
    
    /// Realizar o sorteio (apenas admin)
    fn draw_raffle(&mut self, project_id: String) -> Result<(), String>;
    
    /// Fazer claim da alocação (apenas vencedores)
    fn claim_raffle_allocation(&mut self, project_id: String) -> Result<(), String>;
    
    /// Cancelar um raffle e processar reembolsos
    fn cancel_raffle(&mut self, project_id: String) -> Result<(), String>;
    
    /// Ver informações de participação do usuário
    fn get_raffle_participation(
        &self, 
        user: ink::primitives::AccountId, 
        project_id: String
    ) -> Option<RaffleParticipant>;
    
    /// Ver configuração de um raffle
    fn get_raffle_config(&self, project_id: String) -> Option<RaffleConfig>;
    
    /// Ver resultado do sorteio
    fn get_draw_result(&self, project_id: String) -> Option<DrawResult>;
    
    /// Ver total de tickets vendidos
    fn get_total_tickets_sold(&self, project_id: String) -> u32;
    
    /// Ver lista de participantes (limitado)
    fn get_raffle_participants(&self, project_id: String) -> Vec<ink::primitives::AccountId>;
}

/// Estrutura de storage para o sistema de Raffle
#[derive(Debug, Default)]
pub struct RaffleStorage {
    /// Configurações de raffle por projeto
    pub raffle_configs: Mapping<String, RaffleConfig>,
    /// Participações de usuários por projeto
    pub raffle_participants: Mapping<(ink::primitives::AccountId, String), RaffleParticipant>,
    /// Resultados de sorteios por projeto
    pub draw_results: Mapping<String, DrawResult>,
    /// Lista de participantes por projeto
    pub participants_by_project: Mapping<String, Vec<ink::primitives::AccountId>>,
    /// Total de tickets vendidos por projeto
    pub tickets_sold_by_project: Mapping<String, u32>,
    /// Total arrecadado por projeto (para reembolsos)
    pub total_collected_by_project: Mapping<String, u128>,
}

impl RaffleStorage {
    /// Criar novo storage
    pub fn new() -> Self {
        Self {
            raffle_configs: Mapping::default(),
            raffle_participants: Mapping::default(),
            draw_results: Mapping::default(),
            participants_by_project: Mapping::default(),
            tickets_sold_by_project: Mapping::default(),
            total_collected_by_project: Mapping::default(),
        }
    }
    
    /// Adicionar ou atualizar participação de um usuário
    pub fn update_user_participation(
        &mut self,
        user: ink::primitives::AccountId,
        project_id: &String,
        additional_tickets: u32,
        ticket_cost: u128,
        timestamp: u64,
    ) {
        let mut participant = self.raffle_participants
            .get(&(user, project_id.clone()))
            .unwrap_or_default();
        
        // Se é a primeira participação, adicionar à lista
        if participant.tickets == 0 {
            let mut participants = self.participants_by_project
                .get(project_id)
                .unwrap_or_default();
            participants.push(user);
            self.participants_by_project.insert(project_id, &participants);
        }
        
        // Atualizar participação do usuário
        participant.tickets += additional_tickets;
        participant.participation_time = timestamp;
        
        self.raffle_participants.insert(&(user, project_id.clone()), &participant);
        
        // Atualizar totais do projeto
        let total_tickets = self.tickets_sold_by_project.get(project_id).unwrap_or(0);
        self.tickets_sold_by_project.insert(project_id, &(total_tickets + additional_tickets));
        
        let total_collected = self.total_collected_by_project.get(project_id).unwrap_or(0);
        self.total_collected_by_project.insert(project_id, &(total_collected + ticket_cost));
    }
    
    /// Verificar se um usuário pode participar
    pub fn can_participate(
        &self,
        user: ink::primitives::AccountId,
        project_id: &String,
        additional_tickets: u32,
    ) -> bool {
        let config = match self.raffle_configs.get(project_id) {
            Some(config) => config,
            None => return false,
        };
        
        // Verificar se raffle está aberto
        if config.status != RaffleStatus::Open {
            return false;
        }
        
        let participant = self.raffle_participants
            .get(&(user, project_id.clone()))
            .unwrap_or_default();
        
        // Verificar limite de tickets
        participant.tickets + additional_tickets <= config.max_tickets_per_user
    }
    
    /// Gerar números aleatórios para o sorteio usando block hash
    pub fn generate_winners(
        &self,
        project_id: &String,
        num_winners: u32,
        random_seed: u64,
    ) -> Vec<ink::primitives::AccountId> {
        let participants = self.participants_by_project
            .get(project_id)
            .unwrap_or_default();
        
        if participants.is_empty() || num_winners == 0 {
            return Vec::new();
        }
        
        let mut winners = Vec::new();
        let mut seed = random_seed;
        
                    for _i in 0..num_winners {
            if winners.len() >= participants.len() {
                break; // Não há mais participantes únicos
            }
            
            // Gerar índice pseudo-aleatório
            seed = seed.wrapping_mul(1103515245).wrapping_add(12345);
            let index = (seed as usize) % participants.len();
            
            let selected = participants[index];
            
            // Verificar se já foi selecionado
            if !winners.contains(&selected) {
                winners.push(selected);
            } else {
                // Tentar próximo índice para evitar duplicatas
                for j in 1..participants.len() {
                    let next_index = (index + j) % participants.len();
                    let next_selected = participants[next_index];
                    if !winners.contains(&next_selected) {
                        winners.push(next_selected);
                        break;
                    }
                }
            }
        }
        
        winners
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
    fn raffle_storage_creation_works() {
        let storage = RaffleStorage::new();
        assert_eq!(storage.tickets_sold_by_project.get(&String::from("test")), None);
    }
    
    #[test]
    fn user_participation_update_works() {
        let mut storage = RaffleStorage::new();
        let user = account_from_u8(1);
        let project_id = String::from("PROJECT_1");
        
        // Configurar raffle
        let config = RaffleConfig {
            project_id: project_id.clone(),
            total_allocation: 1000 * 10u128.pow(12),
            ticket_price: 10 * 10u128.pow(12),
            max_tickets_per_user: 5,
            num_winners: 10,
            status: RaffleStatus::Open,
            ..Default::default()
        };
        storage.raffle_configs.insert(&project_id, &config);
        
        // Primeira participação
        storage.update_user_participation(user, &project_id, 3, 30 * 10u128.pow(12), 100);
        
        let participant = storage.raffle_participants.get(&(user, project_id.clone())).unwrap();
        assert_eq!(participant.tickets, 3);
        assert_eq!(participant.participation_time, 100);
        
        let total_tickets = storage.tickets_sold_by_project.get(&project_id).unwrap();
        assert_eq!(total_tickets, 3);
        
        let participants = storage.participants_by_project.get(&project_id).unwrap();
        assert_eq!(participants.len(), 1);
        assert!(participants.contains(&user));
    }
    
    #[test]
    fn participation_validation_works() {
        let mut storage = RaffleStorage::new();
        let user = account_from_u8(1);
        let project_id = String::from("PROJECT_1");
        
        // Configurar raffle
        let config = RaffleConfig {
            project_id: project_id.clone(),
            max_tickets_per_user: 5,
            status: RaffleStatus::Open,
            ..Default::default()
        };
        storage.raffle_configs.insert(&project_id, &config);
        
        // Primeira participação - deve funcionar
        assert!(storage.can_participate(user, &project_id, 3));
        
        // Adicionar participação
        storage.update_user_participation(user, &project_id, 3, 0, 100);
        
        // Segunda participação dentro do limite - deve funcionar
        assert!(storage.can_participate(user, &project_id, 2));
        
        // Participação que excede limite - deve falhar
        assert!(!storage.can_participate(user, &project_id, 3));
    }
    
    #[test]
    fn winner_generation_works() {
        let mut storage = RaffleStorage::new();
        let project_id = String::from("PROJECT_1");
        
        // Adicionar participantes
        let participants = vec![
            account_from_u8(1),
            account_from_u8(2),
            account_from_u8(3),
            account_from_u8(4),
            account_from_u8(5),
        ];
        
        storage.participants_by_project.insert(&project_id, &participants);
        
        // Gerar vencedores
        let winners = storage.generate_winners(&project_id, 3, 12345);
        
        assert_eq!(winners.len(), 3);
        // Verificar que todos os vencedores são únicos
        for (i, winner1) in winners.iter().enumerate() {
            for (j, winner2) in winners.iter().enumerate() {
                if i != j {
                    assert_ne!(winner1, winner2);
                }
            }
        }
        
        // Verificar que todos os vencedores estão na lista de participantes
        for winner in &winners {
            assert!(participants.contains(winner));
        }
    }
    
    #[test]
    fn raffle_status_transitions_work() {
        let mut config = RaffleConfig::default();
        
        assert_eq!(config.status, RaffleStatus::Open);
        
        config.status = RaffleStatus::Closed;
        assert_eq!(config.status, RaffleStatus::Closed);
        
        config.status = RaffleStatus::Drawn;
        assert_eq!(config.status, RaffleStatus::Drawn);
    }
}
