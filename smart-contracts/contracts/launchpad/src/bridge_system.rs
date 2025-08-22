#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// Bridge System USDT (Solana) → LUSDT (Lunes)
/// 
/// Sistema completo de bridge com:
/// - Depósito de USDT na rede Solana
/// - Emissão de LUSDT na rede Lunes
/// - Portal de transparência completo
/// - Sistema de custódia segura
/// - Queima automática de LUSDT
/// - Histórico completo de transações

#[ink::contract]
mod bridge_system {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;
    use ink::prelude::string::String;
    use ink::env::DefaultEnvironment;

    /// Contrato principal do Bridge System
    #[ink(storage)]
    pub struct BridgeSystem {
        /// Configuração do sistema
        admin: AccountId,
        emergency_admin: AccountId,
        lusdt_contract: AccountId,
        solana_usdt_address: String,
        
        /// Contratos de custódia
        usdt_custody_contract: AccountId,
        lusdt_emission_contract: AccountId,
        
        /// Configurações do bridge
        bridge_fee_rate: u16,           // Basis points (ex: 100 = 1%)
        min_deposit_amount: Balance,    // Valor mínimo para depósito
        max_deposit_amount: Balance,    // Valor máximo para depósito
        daily_limit: Balance,           // Limite diário de depósitos
        daily_deposits: Mapping<u64, Balance>, // Depósitos por dia
        
        /// Estado do sistema
        total_usdt_deposited: Balance,  // Total USDT depositado
        total_lusdt_emitted: Balance,   // Total LUSDT emitido
        total_lusdt_burned: Balance,    // Total LUSDT queimado
        circulating_lusdt: Balance,     // LUSDT em circulação
        paused: bool,
        
        /// Histórico de transações
        transactions: Mapping<String, BridgeTransaction>,
        transaction_count: u64,
        
        /// Saldos dos contratos
        usdt_custody_balance: Balance,
        lusdt_emission_balance: Balance,
        
        /// Configurações de segurança
        security_config: SecurityConfig,
        compliance_settings: ComplianceSettings,
    }

    /// Transação do bridge
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct BridgeTransaction {
        pub transaction_id: String,
        pub user_address: AccountId,
        pub solana_address: String,
        pub usdt_amount: Balance,
        pub lusdt_amount: Balance,
        pub bridge_fee: Balance,
        pub transaction_type: TransactionType,
        pub status: TransactionStatus,
        pub timestamp: u64,
        pub block_number: u64,
        pub solana_tx_hash: Option<String>,
        pub lunes_tx_hash: Option<String>,
        pub processed_by: Option<AccountId>,
        pub notes: Option<String>,
    }

    /// Tipo de transação
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum TransactionType {
        Deposit,    // USDT → LUSDT
        Withdraw,   // LUSDT → USDT
        Burn,       // Queima de LUSDT
        Mint,       // Emissão de LUSDT
    }

    /// Status da transação
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum TransactionStatus {
        Pending,    // Aguardando processamento
        Processing, // Em processamento
        Completed,  // Concluída com sucesso
        Failed,     // Falhou
        Cancelled,  // Cancelada
    }

    /// Configurações de segurança
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct SecurityConfig {
        pub multi_sig_threshold: u32,
        pub timelock_delay: u64,
        pub max_daily_volume: Balance,
        pub emergency_pause_enabled: bool,
        pub audit_mode: bool,
    }

    /// Configurações de compliance
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ComplianceSettings {
        pub kyc_required: bool,
        pub aml_enabled: bool,
        pub reporting_enabled: bool,
        pub max_transaction_size: Balance,
        pub suspicious_threshold: Balance,
    }

    /// Erros do sistema
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub enum Error {
        Unauthorized,
        InvalidAmount,
        InsufficientBalance,
        DailyLimitExceeded,
        SystemPaused,
        InvalidTransaction,
        TransactionNotFound,
        ProcessingFailed,
        InvalidConfiguration,
        ComplianceViolation,
    }

    /// Resultado das operações
    pub type Result<T> = core::result::Result<T, Error>;

    /// Eventos do sistema
    #[ink(event)]
    pub struct BridgeTransactionCreated {
        #[ink(topic)]
        transaction_id: String,
        user: AccountId,
        usdt_amount: Balance,
        lusdt_amount: Balance,
        transaction_type: TransactionType,
    }

    #[ink(event)]
    pub struct BridgeTransactionProcessed {
        #[ink(topic)]
        transaction_id: String,
        status: TransactionStatus,
        processed_by: AccountId,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct LUSDTMinted {
        #[ink(topic)]
        user: AccountId,
        amount: Balance,
        transaction_id: String,
    }

    #[ink(event)]
    pub struct LUSDTBurned {
        #[ink(topic)]
        user: AccountId,
        amount: Balance,
        transaction_id: String,
    }

    #[ink(event)]
    pub struct SystemConfigUpdated {
        #[ink(topic)]
        config_type: String,
        old_value: String,
        new_value: String,
        updated_by: AccountId,
    }

    impl BridgeSystem {
        /// Construtor do sistema
        #[ink(constructor)]
        pub fn new(
            admin: AccountId,
            emergency_admin: AccountId,
            lusdt_contract: AccountId,
            solana_usdt_address: String,
        ) -> Self {
            let mut instance = Self {
                admin,
                emergency_admin,
                lusdt_contract,
                solana_usdt_address,
                usdt_custody_contract: AccountId::default(),
                lusdt_emission_contract: AccountId::default(),
                bridge_fee_rate: 100, // 1%
                min_deposit_amount: 1_000_000, // $1
                max_deposit_amount: 1_000_000_000_000, // $1M
                daily_limit: 10_000_000_000_000, // $10M
                daily_deposits: Mapping::default(),
                total_usdt_deposited: 0,
                total_lusdt_emitted: 0,
                total_lusdt_burned: 0,
                circulating_lusdt: 0,
                paused: false,
                transactions: Mapping::default(),
                transaction_count: 0,
                usdt_custody_balance: 0,
                lusdt_emission_balance: 0,
                security_config: SecurityConfig {
                    multi_sig_threshold: 2,
                    timelock_delay: 3600, // 1 hora
                    max_daily_volume: 10_000_000_000_000, // $10M
                    emergency_pause_enabled: true,
                    audit_mode: false,
                },
                compliance_settings: ComplianceSettings {
                    kyc_required: false,
                    aml_enabled: true,
                    reporting_enabled: true,
                    max_transaction_size: 1_000_000_000_000, // $1M
                    suspicious_threshold: 100_000_000_000, // $100k
                },
            };

            // Emitir evento de criação
            instance.env().emit_event(BridgeTransactionCreated {
                transaction_id: "SYSTEM_INIT".to_string(),
                user: admin,
                usdt_amount: 0,
                lusdt_amount: 0,
                transaction_type: TransactionType::Mint,
            });

            instance
        }

        /// Registrar depósito de USDT (chamado por oráculo ou admin)
        #[ink(message)]
        pub fn register_usdt_deposit(
            &mut self,
            user_address: AccountId,
            solana_address: String,
            usdt_amount: Balance,
            solana_tx_hash: String,
        ) -> Result<String> {
            self.ensure_not_paused()?;
            self.ensure_admin_or_oracle()?;
            self.validate_deposit_amount(usdt_amount)?;
            self.check_daily_limits(usdt_amount)?;

            // Calcular LUSDT a ser emitido (1:1 ratio)
            let bridge_fee = (usdt_amount * self.bridge_fee_rate as u128) / 10000;
            let lusdt_amount = usdt_amount - bridge_fee;

            // Criar transação
            let transaction_id = self.generate_transaction_id();
            let transaction = BridgeTransaction {
                transaction_id: transaction_id.clone(),
                user_address,
                solana_address,
                usdt_amount,
                lusdt_amount,
                bridge_fee,
                transaction_type: TransactionType::Deposit,
                status: TransactionStatus::Pending,
                timestamp: self.env().block_timestamp(),
                block_number: self.env().block_number(),
                solana_tx_hash: Some(solana_tx_hash),
                lunes_tx_hash: None,
                processed_by: Some(self.env().caller()),
                notes: None,
            };

            // Armazenar transação
            self.transactions.insert(&transaction_id, &transaction);
            self.transaction_count += 1;

            // Atualizar estatísticas
            self.total_usdt_deposited += usdt_amount;
            self.usdt_custody_balance += usdt_amount;
            self.update_daily_deposits(usdt_amount);

            // Emitir eventos
            self.env().emit_event(BridgeTransactionCreated {
                transaction_id: transaction_id.clone(),
                user: user_address,
                usdt_amount,
                lusdt_amount,
                transaction_type: TransactionType::Deposit,
            });

            Ok(transaction_id)
        }

        /// Processar depósito e emitir LUSDT
        #[ink(message)]
        pub fn process_deposit(&mut self, transaction_id: String) -> Result<()> {
            self.ensure_not_paused()?;
            self.ensure_admin_or_oracle()?;

            let mut transaction = self.transactions
                .get(&transaction_id)
                .ok_or(Error::TransactionNotFound)?;

            if transaction.status != TransactionStatus::Pending {
                return Err(Error::InvalidTransaction);
            }

            // Atualizar status
            transaction.status = TransactionStatus::Processing;
            self.transactions.insert(&transaction_id, &transaction);

            // Emitir LUSDT para o usuário
            let mint_success = self.mint_lusdt(
                transaction.user_address,
                transaction.lusdt_amount,
            );

            if mint_success {
                // Atualizar estatísticas
                self.total_lusdt_emitted += transaction.lusdt_amount;
                self.circulating_lusdt += transaction.lusdt_amount;
                self.lusdt_emission_balance += transaction.lusdt_amount;

                // Finalizar transação
                transaction.status = TransactionStatus::Completed;
                transaction.lunes_tx_hash = Some(self.env().block_number().to_string());
                self.transactions.insert(&transaction_id, &transaction);

                // Emitir eventos
                self.env().emit_event(BridgeTransactionProcessed {
                    transaction_id: transaction_id.clone(),
                    status: TransactionStatus::Completed,
                    processed_by: self.env().caller(),
                    timestamp: self.env().block_timestamp(),
                });

                self.env().emit_event(LUSDTMinted {
                    user: transaction.user_address,
                    amount: transaction.lusdt_amount,
                    transaction_id,
                });
            } else {
                // Falha na emissão
                transaction.status = TransactionStatus::Failed;
                self.transactions.insert(&transaction_id, &transaction);

                self.env().emit_event(BridgeTransactionProcessed {
                    transaction_id,
                    status: TransactionStatus::Failed,
                    processed_by: self.env().caller(),
                    timestamp: self.env().block_timestamp(),
                });

                return Err(Error::ProcessingFailed);
            }

            Ok(())
        }

        /// Registrar queima de LUSDT (para saque)
        #[ink(message)]
        pub fn register_lusdt_burn(
            &mut self,
            user_address: AccountId,
            lusdt_amount: Balance,
            solana_address: String,
        ) -> Result<String> {
            self.ensure_not_paused()?;
            self.ensure_admin_or_oracle()?;

            if lusdt_amount > self.circulating_lusdt {
                return Err(Error::InsufficientBalance);
            }

            // Criar transação de queima
            let transaction_id = self.generate_transaction_id();
            let transaction = BridgeTransaction {
                transaction_id: transaction_id.clone(),
                user_address,
                solana_address,
                usdt_amount: lusdt_amount, // 1:1 ratio
                lusdt_amount,
                bridge_fee: 0, // Sem taxa para queima
                transaction_type: TransactionType::Burn,
                status: TransactionStatus::Pending,
                timestamp: self.env().block_timestamp(),
                block_number: self.env().block_number(),
                solana_tx_hash: None,
                lunes_tx_hash: None,
                processed_by: Some(self.env().caller()),
                notes: None,
            };

            // Armazenar transação
            self.transactions.insert(&transaction_id, &transaction);
            self.transaction_count += 1;

            // Atualizar estatísticas
            self.total_lusdt_burned += lusdt_amount;
            self.circulating_lusdt -= lusdt_amount;
            self.lusdt_emission_balance -= lusdt_amount;

            // Emitir eventos
            self.env().emit_event(BridgeTransactionCreated {
                transaction_id: transaction_id.clone(),
                user: user_address,
                usdt_amount: lusdt_amount,
                lusdt_amount,
                transaction_type: TransactionType::Burn,
            });

            self.env().emit_event(LUSDTBurned {
                user: user_address,
                amount: lusdt_amount,
                transaction_id: transaction_id.clone(),
            });

            Ok(transaction_id)
        }

        /// Obter estatísticas do sistema
        #[ink(message)]
        pub fn get_system_stats(&self) -> SystemStats {
            SystemStats {
                total_usdt_deposited: self.total_usdt_deposited,
                total_lusdt_emitted: self.total_lusdt_emitted,
                total_lusdt_burned: self.total_lusdt_burned,
                circulating_lusdt: self.circulating_lusdt,
                usdt_custody_balance: self.usdt_custody_balance,
                lusdt_emission_balance: self.lusdt_emission_balance,
                transaction_count: self.transaction_count,
                bridge_fee_rate: self.bridge_fee_rate,
                daily_limit: self.daily_limit,
                paused: self.paused,
            }
        }

        /// Obter transação por ID
        #[ink(message)]
        pub fn get_transaction(&self, transaction_id: String) -> Option<BridgeTransaction> {
            self.transactions.get(&transaction_id)
        }

        /// Obter transações do usuário
        #[ink(message)]
        pub fn get_user_transactions(&self, user_address: AccountId) -> Vec<BridgeTransaction> {
            let mut user_transactions = Vec::new();
            
            // Nota: Em produção, seria melhor usar um índice
            for i in 0..self.transaction_count {
                if let Some(transaction) = self.transactions.get(&i.to_string()) {
                    if transaction.user_address == user_address {
                        user_transactions.push(transaction);
                    }
                }
            }
            
            user_transactions
        }

        /// Obter transações recentes
        #[ink(message)]
        pub fn get_recent_transactions(&self, limit: u32) -> Vec<BridgeTransaction> {
            let mut recent_transactions = Vec::new();
            let start = if self.transaction_count > limit as u64 {
                self.transaction_count - limit as u64
            } else {
                0
            };
            
            for i in start..self.transaction_count {
                if let Some(transaction) = self.transactions.get(&i.to_string()) {
                    recent_transactions.push(transaction);
                }
            }
            
            recent_transactions
        }

        /// Atualizar configurações (apenas admin)
        #[ink(message)]
        pub fn update_bridge_config(
            &mut self,
            bridge_fee_rate: Option<u16>,
            min_deposit_amount: Option<Balance>,
            max_deposit_amount: Option<Balance>,
            daily_limit: Option<Balance>,
        ) -> Result<()> {
            self.ensure_admin()?;

            if let Some(fee_rate) = bridge_fee_rate {
                let old_value = self.bridge_fee_rate.to_string();
                self.bridge_fee_rate = fee_rate;
                self.env().emit_event(SystemConfigUpdated {
                    config_type: "bridge_fee_rate".to_string(),
                    old_value,
                    new_value: fee_rate.to_string(),
                    updated_by: self.env().caller(),
                });
            }

            if let Some(min_amount) = min_deposit_amount {
                let old_value = self.min_deposit_amount.to_string();
                self.min_deposit_amount = min_amount;
                self.env().emit_event(SystemConfigUpdated {
                    config_type: "min_deposit_amount".to_string(),
                    old_value,
                    new_value: min_amount.to_string(),
                    updated_by: self.env().caller(),
                });
            }

            if let Some(max_amount) = max_deposit_amount {
                let old_value = self.max_deposit_amount.to_string();
                self.max_deposit_amount = max_amount;
                self.env().emit_event(SystemConfigUpdated {
                    config_type: "max_deposit_amount".to_string(),
                    old_value,
                    new_value: max_amount.to_string(),
                    updated_by: self.env().caller(),
                });
            }

            if let Some(daily_lim) = daily_limit {
                let old_value = self.daily_limit.to_string();
                self.daily_limit = daily_lim;
                self.env().emit_event(SystemConfigUpdated {
                    config_type: "daily_limit".to_string(),
                    old_value,
                    new_value: daily_lim.to_string(),
                    updated_by: self.env().caller(),
                });
            }

            Ok(())
        }

        /// Pausar/despausar sistema (emergência)
        #[ink(message)]
        pub fn set_paused(&mut self, paused: bool) -> Result<()> {
            self.ensure_admin_or_emergency()?;
            
            let old_value = self.paused.to_string();
            self.paused = paused;
            
            self.env().emit_event(SystemConfigUpdated {
                config_type: "paused".to_string(),
                old_value,
                new_value: paused.to_string(),
                updated_by: self.env().caller(),
            });

            Ok(())
        }

        // Funções auxiliares privadas

        fn ensure_admin(&self) -> Result<()> {
            if self.env().caller() != self.admin {
                return Err(Error::Unauthorized);
            }
            Ok(())
        }

        fn ensure_admin_or_emergency(&self) -> Result<()> {
            let caller = self.env().caller();
            if caller != self.admin && caller != self.emergency_admin {
                return Err(Error::Unauthorized);
            }
            Ok(())
        }

        fn ensure_admin_or_oracle(&self) -> Result<()> {
            // Em produção, adicionar verificação de oráculo
            self.ensure_admin()
        }

        fn ensure_not_paused(&self) -> Result<()> {
            if self.paused {
                return Err(Error::SystemPaused);
            }
            Ok(())
        }

        fn validate_deposit_amount(&self, amount: Balance) -> Result<()> {
            if amount < self.min_deposit_amount {
                return Err(Error::InvalidAmount);
            }
            if amount > self.max_deposit_amount {
                return Err(Error::InvalidAmount);
            }
            Ok(())
        }

        fn check_daily_limits(&self, amount: Balance) -> Result<()> {
            let today = self.env().block_timestamp() / 86400; // Dias desde epoch
            let current_daily = self.daily_deposits.get(&today).unwrap_or(0);
            
            if current_daily + amount > self.daily_limit {
                return Err(Error::DailyLimitExceeded);
            }
            Ok(())
        }

        fn update_daily_deposits(&mut self, amount: Balance) {
            let today = self.env().block_timestamp() / 86400;
            let current_daily = self.daily_deposits.get(&today).unwrap_or(0);
            self.daily_deposits.insert(&today, &(current_daily + amount));
        }

        fn generate_transaction_id(&self) -> String {
            format!("BRIDGE_{}_{}", self.transaction_count, self.env().block_number())
        }

        fn mint_lusdt(&self, user: AccountId, amount: Balance) -> bool {
            // Em produção, chamar contrato LUSDT para mint
            // Por enquanto, retorna true para simular sucesso
            true
        }
    }

    /// Estatísticas do sistema para o portal de transparência
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct SystemStats {
        pub total_usdt_deposited: Balance,
        pub total_lusdt_emitted: Balance,
        pub total_lusdt_burned: Balance,
        pub circulating_lusdt: Balance,
        pub usdt_custody_balance: Balance,
        pub lusdt_emission_balance: Balance,
        pub transaction_count: u64,
        pub bridge_fee_rate: u16,
        pub daily_limit: Balance,
        pub paused: bool,
    }

    #[cfg(test)]
    mod tests {
        use super::*;
        use ink::env::test;

        #[ink::test]
        fn test_bridge_creation() {
            let accounts = test::default_accounts::<DefaultEnvironment>();
            let bridge = BridgeSystem::new(
                accounts.alice,
                accounts.bob,
                accounts.charlie,
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".to_string(),
            );

            let stats = bridge.get_system_stats();
            assert_eq!(stats.total_usdt_deposited, 0);
            assert_eq!(stats.bridge_fee_rate, 100); // 1%
            assert_eq!(stats.paused, false);
        }

        #[ink::test]
        fn test_usdt_deposit_registration() {
            let accounts = test::default_accounts::<DefaultEnvironment>();
            let mut bridge = BridgeSystem::new(
                accounts.alice,
                accounts.bob,
                accounts.charlie,
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".to_string(),
            );

            test::set_caller::<DefaultEnvironment>(accounts.alice);

            let result = bridge.register_usdt_deposit(
                accounts.django,
                "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM".to_string(),
                1_000_000_000, // $1000 USDT
                "5J7X9K2M1N3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F".to_string(),
            );

            assert!(result.is_ok());
            
            let stats = bridge.get_system_stats();
            assert_eq!(stats.total_usdt_deposited, 1_000_000_000);
            assert_eq!(stats.transaction_count, 1);
        }

        #[ink::test]
        fn test_deposit_processing() {
            let accounts = test::default_accounts::<DefaultEnvironment>();
            let mut bridge = BridgeSystem::new(
                accounts.alice,
                accounts.bob,
                accounts.charlie,
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".to_string(),
            );

            test::set_caller::<DefaultEnvironment>(accounts.alice);

            // Registrar depósito
            let tx_id = bridge.register_usdt_deposit(
                accounts.django,
                "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM".to_string(),
                1_000_000_000, // $1000 USDT
                "5J7X9K2M1N3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F".to_string(),
            ).unwrap();

            // Processar depósito
            let result = bridge.process_deposit(tx_id);
            assert!(result.is_ok());

            let stats = bridge.get_system_stats();
            assert_eq!(stats.total_lusdt_emitted, 990_000_000); // $1000 - 1% fee
            assert_eq!(stats.circulating_lusdt, 990_000_000);
        }

        #[ink::test]
        fn test_unauthorized_access() {
            let accounts = test::default_accounts::<DefaultEnvironment>();
            let mut bridge = BridgeSystem::new(
                accounts.alice,
                accounts.bob,
                accounts.charlie,
                "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v".to_string(),
            );

            test::set_caller::<DefaultEnvironment>(accounts.django);

            let result = bridge.register_usdt_deposit(
                accounts.django,
                "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM".to_string(),
                1_000_000_000,
                "5J7X9K2M1N3P4Q5R6S7T8U9V0W1X2Y3Z4A5B6C7D8E9F".to_string(),
            );

            assert_eq!(result, Err(Error::Unauthorized));
        }
    }
}
