#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// Multi-Chain Sales and Revenue Distribution System for Launchpad Lunes
/// 
/// Features:
/// - Multi-chain payment processing (Lunes, Solana, TON)
/// - Automatic revenue distribution with configurable fees
/// - Affiliate system with anti-fraud protection
/// - Cross-chain bridge integration
/// - Real-time currency conversion
/// - Integration with Smart Fund Treasury and Token Custody

#[ink::contract]
mod sales_revenue_system {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;
    use ink::prelude::string::String;
    use ink::env::DefaultEnvironment;

    /// Main sales and revenue distribution contract
    #[ink(storage)]
    pub struct SalesRevenueSystem {
        /// System configuration
        admin: AccountId,
        treasury_address: Option<AccountId>,
        custody_address: Option<AccountId>,
        
        /// Multi-chain configuration
        supported_networks: Vec<NetworkConfig>,
        bridge_oracles: Mapping<String, OracleConfig>,
        exchange_rates: Mapping<String, ExchangeRate>,
        
        /// Sales processing
        sales_records: Mapping<String, SaleRecord>,
        project_configurations: Mapping<String, ProjectSalesConfig>,
        escrow_accounts: Mapping<String, EscrowAccount>,
        
        /// Revenue distribution
        platform_fees: PlatformFeeConfig,
        revenue_distributions: Mapping<String, RevenueDistribution>,
        
        /// Affiliate system
        affiliate_programs: Mapping<String, AffiliateProgram>,
        affiliate_records: Mapping<(String, AccountId), AffiliateRecord>,
        referral_tracking: Mapping<String, ReferralData>,
        
        /// System state
        total_sales_volume: Balance,
        total_fees_collected: Balance,
        total_affiliate_commissions: Balance,
        active_projects: u32,
        paused: bool,
    }

    /// Network configuration for multi-chain support
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct NetworkConfig {
        pub network_id: String,
        pub network_name: String,
        pub native_currency: String,
        pub supported_stablecoins: Vec<String>,
        pub bridge_address: Option<AccountId>,
        pub oracle_address: Option<AccountId>,
        pub gas_fee_currency: String,
        pub active: bool,
    }

    /// Oracle configuration for price feeds
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct OracleConfig {
        pub oracle_address: AccountId,
        pub price_feed_id: String,
        pub update_frequency: u64,
        pub last_update: u64,
        pub reliability_score: u32,
    }

    /// Exchange rate information
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ExchangeRate {
        pub from_currency: String,
        pub to_currency: String,
        pub rate: Balance,
        pub last_updated: u64,
        pub source_oracle: AccountId,
        pub confidence_interval: u32,
    }

    /// Individual sale record
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct SaleRecord {
        pub sale_id: String,
        pub project_id: String,
        pub buyer: AccountId,
        pub payment_currency: String,
        pub payment_amount: Balance,
        pub payment_network: String,
        pub token_amount: Balance,
        pub token_price_usd: Balance,
        pub exchange_rate_used: Balance,
        pub platform_fee: Balance,
        pub affiliate_commission: Balance,
        pub net_project_revenue: Balance,
        pub sale_timestamp: u64,
        pub payment_tx_hash: String,
        pub distribution_status: DistributionStatus,
        pub affiliate_code: Option<String>,
        pub escrow_id: Option<String>,
    }

    /// Project sales configuration
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ProjectSalesConfig {
        pub project_id: String,
        pub project_owner: AccountId,
        pub project_token_network: String,        // Always "lunes"
        pub accepted_payment_currencies: Vec<String>, // USDT, USDC for payments
        pub accepted_payment_networks: Vec<String>,   // solana, ton for payments
        pub token_price_usd: Balance,
        pub min_purchase_amount: Balance,
        pub max_purchase_amount: Balance,
        pub affiliate_enabled: bool,
        pub affiliate_commission_rate: u32, // 5-15%
        pub custom_fee_rate: Option<u32>,
        pub revenue_wallets: ProjectWallets,      // Multiple wallets for different networks
        pub auto_distribution: bool,
        pub kyc_required: bool,
        pub sales_active: bool,
    }

    /// Project wallet configuration for receiving funds
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ProjectWallets {
        pub lunes_wallet: AccountId,              // Main wallet on Lunes Network
        pub solana_usdt_wallet: Option<String>,   // Solana wallet for USDT
        pub solana_usdc_wallet: Option<String>,   // Solana wallet for USDC
        pub ton_usdt_wallet: Option<String>,      // TON wallet for USDT
        pub ton_usdc_wallet: Option<String>,      // TON wallet for USDC
        pub auto_convert_to_lunes: bool,          // Convert all to LUNES automatically
        pub conversion_threshold: Balance,        // Minimum amount to trigger conversion
    }

    /// Escrow account for secure transactions
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct EscrowAccount {
        pub escrow_id: String,
        pub sale_id: String,
        pub buyer: AccountId,
        pub seller: AccountId,
        pub amount: Balance,
        pub currency: String,
        pub network: String,
        pub created_at: u64,
        pub release_conditions: Vec<ReleaseCondition>,
        pub status: EscrowStatus,
        pub timeout_period: u64,
    }

    /// Platform fee configuration
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct PlatformFeeConfig {
        pub base_fee_percentage: u32,        // 3% base platform fee
        pub smart_fund_percentage: u32,      // 1% to Smart Fund Treasury
        pub development_percentage: u32,     // 1% to development fund
        pub marketing_percentage: u32,       // 0.5% to marketing fund
        pub operations_percentage: u32,      // 0.5% to operations fund
        pub min_fee_amount: Balance,
        pub max_fee_amount: Balance,
        pub fee_currency: String,            // LUNES
    }

    /// Revenue distribution record
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct RevenueDistribution {
        pub distribution_id: String,
        pub sale_id: String,
        pub project_id: String,
        pub total_revenue: Balance,
        pub platform_fee: Balance,
        pub smart_fund_allocation: Balance,
        pub project_net_revenue: Balance,
        pub affiliate_commission: Balance,
        pub distribution_timestamp: u64,
        pub distribution_tx_hashes: Vec<String>,
        pub status: DistributionStatus,
    }

    /// Affiliate program configuration
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct AffiliateProgram {
        pub program_id: String,
        pub project_id: String,
        pub commission_rate: u32,            // 5-15%
        pub min_commission_rate: u32,        // 5%
        pub max_commission_rate: u32,        // 15%
        pub payment_currency: String,
        pub payment_threshold: Balance,
        pub payment_frequency: u64,         // seconds
        pub anti_fraud_enabled: bool,
        pub kyc_required: bool,
        pub active: bool,
        pub created_by: AccountId,
        pub created_at: u64,
    }

    /// Affiliate performance record
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct AffiliateRecord {
        pub affiliate_id: AccountId,
        pub program_id: String,
        pub referral_code: String,
        pub total_referrals: u32,
        pub total_sales_volume: Balance,
        pub total_commissions_earned: Balance,
        pub total_commissions_paid: Balance,
        pub pending_commissions: Balance,
        pub conversion_rate: u32,            // percentage
        pub fraud_score: u32,               // 0-100, lower is better
        pub status: AffiliateStatus,
        pub joined_at: u64,
        pub last_activity: u64,
    }

    /// Referral tracking data
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ReferralData {
        pub referral_id: String,
        pub affiliate_code: String,
        pub affiliate_id: AccountId,
        pub referred_user: AccountId,
        pub project_id: String,
        pub sale_amount: Balance,
        pub commission_amount: Balance,
        pub referral_timestamp: u64,
        pub conversion_timestamp: Option<u64>,
        pub ip_hash: Option<String>,         // For fraud detection
        pub user_agent_hash: Option<String>, // For fraud detection
        pub validated: bool,
    }

    /// Enums for various states
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum DistributionStatus {
        Pending,
        InProgress,
        Completed,
        Failed,
        Disputed,
    }

    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum EscrowStatus {
        Active,
        Released,
        Disputed,
        Refunded,
        Expired,
    }

    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum AffiliateStatus {
        Active,
        Suspended,
        Banned,
        PendingReview,
        Inactive,
    }

    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum ReleaseCondition {
        TimeDelay(u64),
        TokenDelivery,
        ManualApproval,
        ProjectMilestone,
    }

    /// Events for sales and revenue operations
    #[ink(event)]
    pub struct SaleProcessed {
        #[ink(topic)]
        sale_id: String,
        #[ink(topic)]
        project_id: String,
        #[ink(topic)]
        buyer: AccountId,
        payment_amount: Balance,
        payment_currency: String,
        token_amount: Balance,
        platform_fee: Balance,
        affiliate_commission: Balance,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct RevenueDistributed {
        #[ink(topic)]
        distribution_id: String,
        #[ink(topic)]
        project_id: String,
        total_revenue: Balance,
        platform_fee: Balance,
        smart_fund_allocation: Balance,
        project_net_revenue: Balance,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct AffiliateCommissionPaid {
        #[ink(topic)]
        affiliate_id: AccountId,
        #[ink(topic)]
        program_id: String,
        commission_amount: Balance,
        referral_count: u32,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct CrossChainPaymentReceived {
        #[ink(topic)]
        payment_id: String,
        source_network: String,
        target_network: String,
        amount: Balance,
        currency: String,
        exchange_rate: Balance,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct EscrowReleased {
        #[ink(topic)]
        escrow_id: String,
        #[ink(topic)]
        sale_id: String,
        amount: Balance,
        recipient: AccountId,
        timestamp: u64,
    }

    /// Errors
    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum SalesError {
        Unauthorized,
        ProjectNotFound,
        InvalidCurrency,
        InvalidNetwork,
        InsufficientAmount,
        ExceedsMaxAmount,
        SalesNotActive,
        InvalidAffiliateCode,
        EscrowNotFound,
        DistributionFailed,
        OracleError,
        BridgeError,
        FraudDetected,
        KYCRequired,
        ContractPaused,
        InvalidConfiguration,
    }

    pub type Result<T> = core::result::Result<T, SalesError>;

    impl SalesRevenueSystem {
        /// Constructor
        #[ink(constructor)]
        pub fn new(admin: AccountId) -> Self {
            // Initialize platform fee configuration (3% total)
            let platform_fees = PlatformFeeConfig {
                base_fee_percentage: 300,        // 3% (in basis points)
                smart_fund_percentage: 100,      // 1% to Smart Fund Treasury
                development_percentage: 100,     // 1% to development fund
                marketing_percentage: 50,        // 0.5% to marketing fund
                operations_percentage: 50,       // 0.5% to operations fund
                min_fee_amount: 1_000_000,       // 0.001 LUNES minimum
                max_fee_amount: 1_000_000_000_000, // 1M LUNES maximum
                fee_currency: "LUNES".to_string(),
            };

            // Initialize supported networks
            let supported_networks = vec![
                NetworkConfig {
                    network_id: "lunes".to_string(),
                    network_name: "Lunes Network".to_string(),
                    native_currency: "LUNES".to_string(),
                    supported_stablecoins: vec!["LUSDT".to_string(), "LUSDC".to_string()],
                    bridge_address: None,
                    oracle_address: None,
                    gas_fee_currency: "LUNES".to_string(),
                    active: true,
                },
                NetworkConfig {
                    network_id: "solana".to_string(),
                    network_name: "Solana".to_string(),
                    native_currency: "SOL".to_string(),
                    supported_stablecoins: vec!["USDT".to_string(), "USDC".to_string()],
                    bridge_address: None,
                    oracle_address: None,
                    gas_fee_currency: "SOL".to_string(),
                    active: true,
                },
                NetworkConfig {
                    network_id: "ton".to_string(),
                    network_name: "TON Network".to_string(),
                    native_currency: "TON".to_string(),
                    supported_stablecoins: vec!["USDT".to_string(), "USDC".to_string()],
                    bridge_address: None,
                    oracle_address: None,
                    gas_fee_currency: "TON".to_string(),
                    active: true,
                },
            ];

            Self {
                admin,
                treasury_address: None,
                custody_address: None,
                supported_networks,
                bridge_oracles: Mapping::default(),
                exchange_rates: Mapping::default(),
                sales_records: Mapping::default(),
                project_configurations: Mapping::default(),
                escrow_accounts: Mapping::default(),
                platform_fees,
                revenue_distributions: Mapping::default(),
                affiliate_programs: Mapping::default(),
                affiliate_records: Mapping::default(),
                referral_tracking: Mapping::default(),
                total_sales_volume: 0,
                total_fees_collected: 0,
                total_affiliate_commissions: 0,
                active_projects: 0,
                paused: false,
            }
        }

        /// Set integration addresses
        #[ink(message)]
        pub fn set_integration_addresses(
            &mut self,
            treasury_address: AccountId,
            custody_address: AccountId,
        ) -> Result<()> {
            self.ensure_admin()?;

            self.treasury_address = Some(treasury_address);
            self.custody_address = Some(custody_address);

            Ok(())
        }

        /// Configure project for sales with multi-chain wallet setup
        #[ink(message)]
        pub fn configure_project_sales(
            &mut self,
            project_id: String,
            project_owner: AccountId,
            token_price_usd: Balance,
            affiliate_commission_rate: u32, // 5-15%
            lunes_wallet: AccountId,
            solana_usdt_wallet: Option<String>,
            solana_usdc_wallet: Option<String>,
            ton_usdt_wallet: Option<String>,
            ton_usdc_wallet: Option<String>,
            auto_convert_to_lunes: bool,
        ) -> Result<()> {
            self.ensure_not_paused()?;

            // Validate affiliate commission rate (5-15%)
            if affiliate_commission_rate < 500 || affiliate_commission_rate > 1500 {
                return Err(SalesError::InvalidAffiliateCode);
            }

            let caller = self.env().caller();
            if caller != self.admin && caller != project_owner {
                return Err(SalesError::Unauthorized);
            }

            // Validate that at least one payment wallet is configured
            if solana_usdt_wallet.is_none() && solana_usdc_wallet.is_none() &&
               ton_usdt_wallet.is_none() && ton_usdc_wallet.is_none() {
                return Err(SalesError::InvalidConfiguration);
            }

            // Configure accepted payment currencies based on provided wallets
            let mut accepted_payment_currencies = vec!["LUNES".to_string()]; // Always accept LUNES
            let mut accepted_payment_networks = vec!["lunes".to_string()];   // Always support Lunes

            if solana_usdt_wallet.is_some() || solana_usdc_wallet.is_some() {
                accepted_payment_networks.push("solana".to_string());
                if solana_usdt_wallet.is_some() {
                    accepted_payment_currencies.push("USDT".to_string());
                }
                if solana_usdc_wallet.is_some() {
                    accepted_payment_currencies.push("USDC".to_string());
                }
            }

            if ton_usdt_wallet.is_some() || ton_usdc_wallet.is_some() {
                accepted_payment_networks.push("ton".to_string());
                if ton_usdt_wallet.is_some() && !accepted_payment_currencies.contains(&"USDT".to_string()) {
                    accepted_payment_currencies.push("USDT".to_string());
                }
                if ton_usdc_wallet.is_some() && !accepted_payment_currencies.contains(&"USDC".to_string()) {
                    accepted_payment_currencies.push("USDC".to_string());
                }
            }

            let project_wallets = ProjectWallets {
                lunes_wallet,
                solana_usdt_wallet,
                solana_usdc_wallet,
                ton_usdt_wallet,
                ton_usdc_wallet,
                auto_convert_to_lunes,
                conversion_threshold: 1000_000_000, // $1000 threshold
            };

            let config = ProjectSalesConfig {
                project_id: project_id.clone(),
                project_owner,
                project_token_network: "lunes".to_string(), // Always Lunes for tokens
                accepted_payment_currencies,
                accepted_payment_networks,
                token_price_usd,
                min_purchase_amount: 10_000_000,      // $10 minimum
                max_purchase_amount: 100_000_000_000, // $100k maximum
                affiliate_enabled: true,
                affiliate_commission_rate,
                custom_fee_rate: None,
                revenue_wallets: project_wallets,
                auto_distribution: true,
                kyc_required: false,
                sales_active: true,
            };

            self.project_configurations.insert(&project_id, &config);
            self.active_projects += 1;

            Ok(())
        }

        /// Process sale transaction
        #[ink(message)]
        pub fn process_sale(
            &mut self,
            sale_id: String,
            project_id: String,
            buyer: AccountId,
            payment_currency: String,
            payment_amount: Balance,
            payment_network: String,
            payment_tx_hash: String,
            affiliate_code: Option<String>,
        ) -> Result<()> {
            self.ensure_not_paused()?;

            // Get project configuration
            let project_config = self.project_configurations.get(&project_id)
                .ok_or(SalesError::ProjectNotFound)?;

            if !project_config.sales_active {
                return Err(SalesError::SalesNotActive);
            }

            // Validate payment currency and network
            if !project_config.accepted_payment_currencies.contains(&payment_currency) {
                return Err(SalesError::InvalidCurrency);
            }

            if !project_config.accepted_payment_networks.contains(&payment_network) {
                return Err(SalesError::InvalidNetwork);
            }

            // Validate that project has configured wallet for this payment method
            let has_wallet = match (payment_network.as_str(), payment_currency.as_str()) {
                ("lunes", "LUNES") => true, // Always has Lunes wallet
                ("solana", "USDT") => project_config.revenue_wallets.solana_usdt_wallet.is_some(),
                ("solana", "USDC") => project_config.revenue_wallets.solana_usdc_wallet.is_some(),
                ("ton", "USDT") => project_config.revenue_wallets.ton_usdt_wallet.is_some(),
                ("ton", "USDC") => project_config.revenue_wallets.ton_usdc_wallet.is_some(),
                _ => false,
            };

            if !has_wallet {
                return Err(SalesError::InvalidConfiguration);
            }

            // Get exchange rate to USD
            let exchange_rate = self.get_exchange_rate(&payment_currency, "USD")?;
            let payment_amount_usd = (payment_amount * exchange_rate) / 1_000_000_000_000; // Normalize

            // Validate purchase amount
            if payment_amount_usd < project_config.min_purchase_amount {
                return Err(SalesError::InsufficientAmount);
            }

            if payment_amount_usd > project_config.max_purchase_amount {
                return Err(SalesError::ExceedsMaxAmount);
            }

            // Calculate token amount
            let token_amount = (payment_amount_usd * 1_000_000_000_000) / project_config.token_price_usd;

            // Calculate fees and commissions
            let platform_fee = self.calculate_platform_fee(payment_amount_usd);
            let affiliate_commission = if let Some(ref code) = affiliate_code {
                self.calculate_affiliate_commission(&project_id, payment_amount_usd, code)?
            } else {
                0
            };

            let net_project_revenue = payment_amount_usd - platform_fee - affiliate_commission;

            let timestamp = ink::env::block_timestamp::<DefaultEnvironment>();

            // Create sale record
            let sale_record = SaleRecord {
                sale_id: sale_id.clone(),
                project_id: project_id.clone(),
                buyer,
                payment_currency: payment_currency.clone(),
                payment_amount,
                payment_network: payment_network.clone(),
                token_amount,
                token_price_usd: project_config.token_price_usd,
                exchange_rate_used: exchange_rate,
                platform_fee,
                affiliate_commission,
                net_project_revenue,
                sale_timestamp: timestamp,
                payment_tx_hash: payment_tx_hash.clone(),
                distribution_status: DistributionStatus::Pending,
                affiliate_code: affiliate_code.clone(),
                escrow_id: None,
            };

            self.sales_records.insert(&sale_id, &sale_record);

            // Update system metrics
            self.total_sales_volume += payment_amount_usd;
            self.total_fees_collected += platform_fee;
            if affiliate_commission > 0 {
                self.total_affiliate_commissions += affiliate_commission;
            }

            // Process affiliate referral if applicable
            if let Some(code) = affiliate_code {
                self.process_affiliate_referral(&sale_id, &code, buyer, payment_amount_usd)?;
            }

            // Create escrow if required
            if payment_network != "lunes" {
                self.create_escrow_account(&sale_id, buyer, project_config.project_owner,
                                         payment_amount, &payment_currency, &payment_network)?;
            }

            // Emit event
            self.env().emit_event(SaleProcessed {
                sale_id,
                project_id,
                buyer,
                payment_amount,
                payment_currency,
                token_amount,
                platform_fee,
                affiliate_commission,
                timestamp,
            });

            // Auto-distribute if enabled and on Lunes network
            if project_config.auto_distribution && payment_network == "lunes" {
                self.distribute_revenue(&sale_record)?;
            }

            Ok(())
        }

        /// Distribute revenue from sale
        #[ink(message)]
        pub fn distribute_revenue(&mut self, sale_record: SaleRecord) -> Result<()> {
            self.ensure_not_paused()?;

            let distribution_id = format!("dist_{}_{}", sale_record.sale_id,
                                        ink::env::block_timestamp::<DefaultEnvironment>());

            // Calculate Smart Fund allocation (1% of total revenue)
            let smart_fund_allocation = (sale_record.net_project_revenue *
                                       self.platform_fees.smart_fund_percentage as u128) / 10000;

            // Create distribution record
            let distribution = RevenueDistribution {
                distribution_id: distribution_id.clone(),
                sale_id: sale_record.sale_id.clone(),
                project_id: sale_record.project_id.clone(),
                total_revenue: sale_record.payment_amount,
                platform_fee: sale_record.platform_fee,
                smart_fund_allocation,
                project_net_revenue: sale_record.net_project_revenue - smart_fund_allocation,
                affiliate_commission: sale_record.affiliate_commission,
                distribution_timestamp: ink::env::block_timestamp::<DefaultEnvironment>(),
                distribution_tx_hashes: vec![], // Would be populated with actual tx hashes
                status: DistributionStatus::Completed,
            };

            self.revenue_distributions.insert(&distribution_id, &distribution);

            // Emit event
            self.env().emit_event(RevenueDistributed {
                distribution_id,
                project_id: sale_record.project_id.clone(),
                total_revenue: distribution.total_revenue,
                platform_fee: distribution.platform_fee,
                smart_fund_allocation: distribution.smart_fund_allocation,
                project_net_revenue: distribution.project_net_revenue,
                timestamp: distribution.distribution_timestamp,
            });

            Ok(())
        }

        /// Create affiliate program for project
        #[ink(message)]
        pub fn create_affiliate_program(
            &mut self,
            program_id: String,
            project_id: String,
            commission_rate: u32, // 5-15% in basis points (500-1500)
        ) -> Result<()> {
            self.ensure_not_paused()?;

            // Validate commission rate (5-15%)
            if commission_rate < 500 || commission_rate > 1500 {
                return Err(SalesError::InvalidAffiliateCode);
            }

            let caller = self.env().caller();
            let timestamp = ink::env::block_timestamp::<DefaultEnvironment>();

            let program = AffiliateProgram {
                program_id: program_id.clone(),
                project_id: project_id.clone(),
                commission_rate,
                min_commission_rate: 500,  // 5%
                max_commission_rate: 1500, // 15%
                payment_currency: "LUNES".to_string(),
                payment_threshold: 10_000_000_000, // 10 LUNES minimum
                payment_frequency: 604800, // Weekly payments
                anti_fraud_enabled: true,
                kyc_required: false,
                active: true,
                created_by: caller,
                created_at: timestamp,
            };

            self.affiliate_programs.insert(&program_id, &program);

            Ok(())
        }

        /// Register affiliate for program
        #[ink(message)]
        pub fn register_affiliate(
            &mut self,
            program_id: String,
            affiliate_id: AccountId,
            referral_code: String,
        ) -> Result<()> {
            self.ensure_not_paused()?;

            // Verify program exists
            let program = self.affiliate_programs.get(&program_id)
                .ok_or(SalesError::ProjectNotFound)?;

            if !program.active {
                return Err(SalesError::SalesNotActive);
            }

            let timestamp = ink::env::block_timestamp::<DefaultEnvironment>();

            let affiliate_record = AffiliateRecord {
                affiliate_id,
                program_id: program_id.clone(),
                referral_code: referral_code.clone(),
                total_referrals: 0,
                total_sales_volume: 0,
                total_commissions_earned: 0,
                total_commissions_paid: 0,
                pending_commissions: 0,
                conversion_rate: 0,
                fraud_score: 0,
                status: AffiliateStatus::Active,
                joined_at: timestamp,
                last_activity: timestamp,
            };

            self.affiliate_records.insert((program_id, affiliate_id), &affiliate_record);

            Ok(())
        }

        /// Process affiliate referral
        fn process_affiliate_referral(
            &mut self,
            sale_id: &str,
            affiliate_code: &str,
            referred_user: AccountId,
            sale_amount: Balance,
        ) -> Result<()> {
            // Find affiliate by code (simplified - would need proper lookup)
            let referral_id = format!("ref_{}_{}", sale_id, affiliate_code);
            let timestamp = ink::env::block_timestamp::<DefaultEnvironment>();

            // Anti-fraud checks
            let fraud_score = self.calculate_fraud_score(referred_user, affiliate_code);
            if fraud_score > 70 {
                return Err(SalesError::FraudDetected);
            }

            let referral_data = ReferralData {
                referral_id: referral_id.clone(),
                affiliate_code: affiliate_code.to_string(),
                affiliate_id: AccountId::from([0; 32]), // Would be looked up
                referred_user,
                project_id: "".to_string(), // Would be from sale record
                sale_amount,
                commission_amount: 0, // Calculated separately
                referral_timestamp: timestamp,
                conversion_timestamp: Some(timestamp),
                ip_hash: None,
                user_agent_hash: None,
                validated: fraud_score <= 30,
            };

            self.referral_tracking.insert(&referral_id, &referral_data);

            Ok(())
        }

        /// Update exchange rates from oracle
        #[ink(message)]
        pub fn update_exchange_rates(
            &mut self,
            rates: Vec<(String, String, Balance)>, // (from, to, rate)
        ) -> Result<()> {
            self.ensure_admin()?;

            let timestamp = ink::env::block_timestamp::<DefaultEnvironment>();

            for (from_currency, to_currency, rate) in rates {
                let rate_key = format!("{}_{}", from_currency, to_currency);

                let exchange_rate = ExchangeRate {
                    from_currency: from_currency.clone(),
                    to_currency: to_currency.clone(),
                    rate,
                    last_updated: timestamp,
                    source_oracle: self.admin, // Simplified
                    confidence_interval: 95,
                };

                self.exchange_rates.insert(&rate_key, &exchange_rate);
            }

            Ok(())
        }

        /// Process cross-chain payment
        #[ink(message)]
        pub fn process_cross_chain_payment(
            &mut self,
            payment_id: String,
            source_network: String,
            target_network: String,
            amount: Balance,
            currency: String,
            source_tx_hash: String,
        ) -> Result<()> {
            self.ensure_not_paused()?;

            // Validate networks
            let source_config = self.get_network_config(&source_network)?;
            let target_config = self.get_network_config(&target_network)?;

            if !source_config.active || !target_config.active {
                return Err(SalesError::InvalidNetwork);
            }

            // Get exchange rate if currency conversion needed
            let exchange_rate = if source_config.native_currency != target_config.native_currency {
                self.get_exchange_rate(&source_config.native_currency, &target_config.native_currency)?
            } else {
                1_000_000_000_000 // 1:1 ratio
            };

            let converted_amount = (amount * exchange_rate) / 1_000_000_000_000;

            // Emit cross-chain event
            self.env().emit_event(CrossChainPaymentReceived {
                payment_id,
                source_network,
                target_network,
                amount: converted_amount,
                currency,
                exchange_rate,
                timestamp: ink::env::block_timestamp::<DefaultEnvironment>(),
            });

            Ok(())
        }

        /// Create escrow account for cross-chain transactions
        fn create_escrow_account(
            &mut self,
            sale_id: &str,
            buyer: AccountId,
            seller: AccountId,
            amount: Balance,
            currency: &str,
            network: &str,
        ) -> Result<()> {
            let escrow_id = format!("escrow_{}_{}", sale_id,
                                  ink::env::block_timestamp::<DefaultEnvironment>());
            let timestamp = ink::env::block_timestamp::<DefaultEnvironment>();

            let escrow = EscrowAccount {
                escrow_id: escrow_id.clone(),
                sale_id: sale_id.to_string(),
                buyer,
                seller,
                amount,
                currency: currency.to_string(),
                network: network.to_string(),
                created_at: timestamp,
                release_conditions: vec![
                    ReleaseCondition::TokenDelivery,
                    ReleaseCondition::TimeDelay(86400), // 24 hours
                ],
                status: EscrowStatus::Active,
                timeout_period: 604800, // 7 days
            };

            self.escrow_accounts.insert(&escrow_id, &escrow);

            Ok(())
        }

        /// Release escrow funds
        #[ink(message)]
        pub fn release_escrow(
            &mut self,
            escrow_id: String,
            release_to: AccountId,
        ) -> Result<()> {
            self.ensure_not_paused()?;

            let mut escrow = self.escrow_accounts.get(&escrow_id)
                .ok_or(SalesError::EscrowNotFound)?;

            if escrow.status != EscrowStatus::Active {
                return Err(SalesError::EscrowNotFound);
            }

            // Check release conditions (simplified)
            let timestamp = ink::env::block_timestamp::<DefaultEnvironment>();
            let can_release = timestamp > escrow.created_at + 86400; // 24h delay

            if !can_release {
                return Err(SalesError::Unauthorized);
            }

            escrow.status = EscrowStatus::Released;
            self.escrow_accounts.insert(&escrow_id, &escrow);

            // Emit event
            self.env().emit_event(EscrowReleased {
                escrow_id,
                sale_id: escrow.sale_id,
                amount: escrow.amount,
                recipient: release_to,
                timestamp,
            });

            Ok(())
        }

        /// Get sale record
        #[ink(message)]
        pub fn get_sale_record(&self, sale_id: String) -> Option<SaleRecord> {
            self.sales_records.get(&sale_id)
        }

        /// Get project sales configuration
        #[ink(message)]
        pub fn get_project_config(&self, project_id: String) -> Option<ProjectSalesConfig> {
            self.project_configurations.get(&project_id)
        }

        /// Get affiliate record
        #[ink(message)]
        pub fn get_affiliate_record(&self, program_id: String, affiliate_id: AccountId) -> Option<AffiliateRecord> {
            self.affiliate_records.get((program_id, affiliate_id))
        }

        /// Get system metrics
        #[ink(message)]
        pub fn get_system_metrics(&self) -> SystemMetrics {
            SystemMetrics {
                total_sales_volume: self.total_sales_volume,
                total_fees_collected: self.total_fees_collected,
                total_affiliate_commissions: self.total_affiliate_commissions,
                active_projects: self.active_projects,
                supported_networks: self.supported_networks.len() as u32,
                platform_fee_percentage: self.platform_fees.base_fee_percentage,
            }
        }

        /// Helper functions
        fn ensure_admin(&self) -> Result<()> {
            if self.env().caller() != self.admin {
                return Err(SalesError::Unauthorized);
            }
            Ok(())
        }

        fn ensure_not_paused(&self) -> Result<()> {
            if self.paused {
                return Err(SalesError::ContractPaused);
            }
            Ok(())
        }

        fn get_exchange_rate(&self, from: &str, to: &str) -> Result<Balance> {
            let rate_key = format!("{}_{}", from, to);
            let rate = self.exchange_rates.get(&rate_key)
                .ok_or(SalesError::OracleError)?;
            Ok(rate.rate)
        }

        fn get_network_config(&self, network_id: &str) -> Result<NetworkConfig> {
            self.supported_networks.iter()
                .find(|config| config.network_id == network_id)
                .cloned()
                .ok_or(SalesError::InvalidNetwork)
        }

        fn calculate_platform_fee(&self, amount_usd: Balance) -> Balance {
            let fee = (amount_usd * self.platform_fees.base_fee_percentage as u128) / 10000;
            fee.max(self.platform_fees.min_fee_amount)
               .min(self.platform_fees.max_fee_amount)
        }

        fn calculate_affiliate_commission(
            &self,
            project_id: &str,
            amount_usd: Balance,
            affiliate_code: &str,
        ) -> Result<Balance> {
            // Get project config to find affiliate rate
            let config = self.project_configurations.get(project_id)
                .ok_or(SalesError::ProjectNotFound)?;

            if !config.affiliate_enabled {
                return Ok(0);
            }

            let commission = (amount_usd * config.affiliate_commission_rate as u128) / 10000;
            Ok(commission)
        }

        fn calculate_fraud_score(&self, user: AccountId, affiliate_code: &str) -> u32 {
            // Simplified fraud detection
            // In production, would check:
            // - IP patterns
            // - User agent patterns
            // - Transaction timing
            // - Historical behavior
            0 // Return low score for now
        }
    }

    /// System metrics structure
    #[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct SystemMetrics {
        pub total_sales_volume: Balance,
        pub total_fees_collected: Balance,
        pub total_affiliate_commissions: Balance,
        pub active_projects: u32,
        pub supported_networks: u32,
        pub platform_fee_percentage: u32,
    }
}
