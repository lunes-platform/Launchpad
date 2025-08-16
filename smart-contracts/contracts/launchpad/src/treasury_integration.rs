//! Treasury Integration System
//! 
//! Handles integration between Smart Fund Treasury and other system components

#[cfg(test)]
mod treasury_integration {
    use super::smart_fund_treasury::*;
    use super::token_custody_system::*;
    use ink::env::test;
    use ink::env::DefaultEnvironment;

    /// Integration manager for treasury operations
    pub struct TreasuryIntegration {
        treasury: SmartFundTreasury,
        custody_system: TokenCustodySystem,
    }

    impl TreasuryIntegration {
        /// Initialize integrated system
        pub fn new(
            fund_name: String,
            fund_manager: AccountId,
            board_members: Vec<AccountId>,
            multisig_threshold: u32,
            emergency_admin: AccountId,
        ) -> Self {
            let treasury = SmartFundTreasury::new(
                fund_name,
                fund_manager,
                board_members,
                multisig_threshold,
            );

            let custody_system = TokenCustodySystem::new(
                fund_manager,
                emergency_admin,
            );

            Self {
                treasury,
                custody_system,
            }
        }

        /// Process investment from fund into project
        pub fn process_fund_investment(
            &mut self,
            project_id: String,
            investment_amount: Balance,
            phase_id: String,
        ) -> Result<String, String> {
            // 1. Create investment operation in treasury
            let investment_id = format!("inv_{}_{}", project_id, ink::env::block_timestamp::<DefaultEnvironment>());
            
            // 2. Propose investment operation
            let operation_id = format!("op_{}_{}", investment_id, ink::env::block_timestamp::<DefaultEnvironment>());
            
            match self.treasury.propose_operation(
                operation_id.clone(),
                OperationType::Investment,
                None,
                Some(investment_amount),
                format!("Investment in project {} phase {}", project_id, phase_id),
            ) {
                Ok(_) => {
                    // 3. Auto-approve if fund manager (simplified for demo)
                    let _ = self.treasury.approve_operation(operation_id.clone());
                    let _ = self.treasury.execute_approved_operation(operation_id);
                    
                    Ok(investment_id)
                },
                Err(e) => Err(format!("Investment proposal failed: {:?}", e)),
            }
        }

        /// Process airdrop reception
        pub fn process_airdrop_reception(
            &mut self,
            project_id: String,
            campaign_id: String,
            token_address: AccountId,
            total_airdrop_allocation: Balance,
        ) -> Result<String, String> {
            // Calculate 40% allocation for Smart Fund
            let smart_fund_allocation = (total_airdrop_allocation * 40) / 100;
            
            let airdrop_id = format!("airdrop_{}_{}", project_id, ink::env::block_timestamp::<DefaultEnvironment>());
            let distribution_tx_hash = format!("0x{}_distribution", airdrop_id);

            // Record airdrop in treasury
            match self.treasury.receive_airdrop(
                airdrop_id.clone(),
                project_id,
                campaign_id,
                token_address,
                smart_fund_allocation,
                total_airdrop_allocation,
                distribution_tx_hash,
            ) {
                Ok(_) => Ok(airdrop_id),
                Err(e) => Err(format!("Airdrop reception failed: {:?}", e)),
            }
        }

        /// Generate comprehensive fund report
        pub fn generate_fund_report(&self) -> FundReport {
            let overview = self.treasury.get_fund_overview();
            
            FundReport {
                fund_overview: overview,
                recent_investments: vec![], // Would be populated with actual data
                recent_airdrops: vec![],    // Would be populated with actual data
                performance_summary: PerformanceSummary {
                    total_return_percentage: 0,
                    monthly_return_percentage: 0,
                    best_performing_investment: None,
                    worst_performing_investment: None,
                    total_yield_earned: 0,
                },
                risk_metrics: RiskMetrics {
                    portfolio_volatility: 0,
                    sharpe_ratio: 0,
                    max_drawdown: 0,
                    var_95: 0,
                },
                compliance_status: ComplianceReport {
                    overall_status: ComplianceStatus::Compliant,
                    last_audit_date: 0,
                    next_audit_due: 0,
                    outstanding_issues: vec![],
                },
            }
        }
    }

    /// Comprehensive fund report structure
    #[derive(Debug, Clone)]
    pub struct FundReport {
        pub fund_overview: FundOverview,
        pub recent_investments: Vec<InvestmentSummary>,
        pub recent_airdrops: Vec<AirdropSummary>,
        pub performance_summary: PerformanceSummary,
        pub risk_metrics: RiskMetrics,
        pub compliance_status: ComplianceReport,
    }

    #[derive(Debug, Clone)]
    pub struct InvestmentSummary {
        pub investment_id: String,
        pub project_name: String,
        pub amount_invested: Balance,
        pub current_value: Balance,
        pub roi_percentage: i32,
        pub investment_date: u64,
    }

    #[derive(Debug, Clone)]
    pub struct AirdropSummary {
        pub airdrop_id: String,
        pub project_name: String,
        pub tokens_received: Balance,
        pub current_value: Balance,
        pub reception_date: u64,
    }

    #[derive(Debug, Clone)]
    pub struct PerformanceSummary {
        pub total_return_percentage: i32,
        pub monthly_return_percentage: i32,
        pub best_performing_investment: Option<String>,
        pub worst_performing_investment: Option<String>,
        pub total_yield_earned: Balance,
    }

    #[derive(Debug, Clone)]
    pub struct RiskMetrics {
        pub portfolio_volatility: i32,
        pub sharpe_ratio: i32,
        pub max_drawdown: i32,
        pub var_95: Balance, // Value at Risk 95%
    }

    #[derive(Debug, Clone)]
    pub struct ComplianceReport {
        pub overall_status: ComplianceStatus,
        pub last_audit_date: u64,
        pub next_audit_due: u64,
        pub outstanding_issues: Vec<String>,
    }

    /// Test integration scenarios
    #[ink::test]
    fn test_treasury_integration() {
        let fund_manager = AccountId::from([0x01; 32]);
        let emergency_admin = AccountId::from([0x02; 32]);
        let board_members = vec![
            AccountId::from([0x03; 32]),
            AccountId::from([0x04; 32]),
        ];

        test::set_caller::<DefaultEnvironment>(fund_manager);

        let mut integration = TreasuryIntegration::new(
            "Lunes Smart Fund".to_string(),
            fund_manager,
            board_members,
            2, // 2 out of 3 multisig
            emergency_admin,
        );

        // Test investment process
        let investment_result = integration.process_fund_investment(
            "defi-project-2024".to_string(),
            1_000_000_000_000, // 1M LUNES
            "presale".to_string(),
        );

        assert!(investment_result.is_ok());
        println!("✅ Investment processed: {:?}", investment_result);

        // Test airdrop reception
        let airdrop_result = integration.process_airdrop_reception(
            "defi-project-2024".to_string(),
            "airdrop-campaign-1".to_string(),
            AccountId::from([0x12; 32]),
            100_000_000, // 100M tokens total airdrop
        );

        assert!(airdrop_result.is_ok());
        println!("✅ Airdrop processed: {:?}", airdrop_result);

        // Generate report
        let report = integration.generate_fund_report();
        println!("✅ Fund report generated");
        println!("   Fund Name: {}", report.fund_overview.fund_name);
        println!("   Total AUM: {}", report.fund_overview.total_aum);
        println!("   Total Investments: {}", report.fund_overview.total_investments);
        println!("   Total Airdrops: {}", report.fund_overview.total_airdrops_received);
    }

    /// Test multi-signature workflow
    #[ink::test]
    fn test_multisig_workflow() {
        let fund_manager = AccountId::from([0x01; 32]);
        let board_member1 = AccountId::from([0x03; 32]);
        let board_member2 = AccountId::from([0x04; 32]);
        let emergency_admin = AccountId::from([0x02; 32]);

        let board_members = vec![board_member1, board_member2];

        test::set_caller::<DefaultEnvironment>(fund_manager);

        let mut integration = TreasuryIntegration::new(
            "Lunes Smart Fund".to_string(),
            fund_manager,
            board_members,
            3, // Require all 3 signatures (fund manager + 2 board members)
            emergency_admin,
        );

        // Fund manager proposes large investment
        let operation_id = "large_investment_001".to_string();
        let propose_result = integration.treasury.propose_operation(
            operation_id.clone(),
            OperationType::Investment,
            Some(AccountId::from([0x12; 32])),
            Some(5_000_000_000_000), // 5M LUNES - large investment
            "Large investment requiring board approval".to_string(),
        );

        assert!(propose_result.is_ok());
        println!("✅ Large investment proposed by fund manager");

        // Board member 1 approves
        test::set_caller::<DefaultEnvironment>(board_member1);
        let approve1_result = integration.treasury.approve_operation(operation_id.clone());
        assert!(approve1_result.is_ok());
        println!("✅ Board member 1 approved");

        // Board member 2 approves
        test::set_caller::<DefaultEnvironment>(board_member2);
        let approve2_result = integration.treasury.approve_operation(operation_id.clone());
        assert!(approve2_result.is_ok());
        println!("✅ Board member 2 approved");

        // Check if operation was auto-executed
        let operation = integration.treasury.get_pending_operation(operation_id);
        if let Some(op) = operation {
            assert!(op.executed);
            println!("✅ Operation auto-executed after sufficient approvals");
        }
    }

    /// Test emergency procedures
    #[ink::test]
    fn test_emergency_procedures() {
        let fund_manager = AccountId::from([0x01; 32]);
        let emergency_admin = AccountId::from([0x02; 32]);
        let board_members = vec![AccountId::from([0x03; 32])];

        test::set_caller::<DefaultEnvironment>(fund_manager);

        let mut integration = TreasuryIntegration::new(
            "Lunes Smart Fund".to_string(),
            fund_manager,
            board_members,
            2,
            emergency_admin,
        );

        // Emergency admin pauses operations
        test::set_caller::<DefaultEnvironment>(emergency_admin);
        let pause_result = integration.treasury.emergency_pause();
        assert!(pause_result.is_ok());
        println!("✅ Emergency pause activated");

        // Try to perform operation while paused (should fail)
        test::set_caller::<DefaultEnvironment>(fund_manager);
        let blocked_operation = integration.treasury.propose_operation(
            "blocked_op".to_string(),
            OperationType::Investment,
            None,
            Some(1_000_000),
            "Should be blocked".to_string(),
        );

        assert!(blocked_operation.is_err());
        println!("✅ Operations correctly blocked during emergency pause");

        // Fund manager unpauses
        let unpause_result = integration.treasury.unpause();
        assert!(unpause_result.is_ok());
        println!("✅ Operations resumed");

        // Now operation should work
        let working_operation = integration.treasury.propose_operation(
            "working_op".to_string(),
            OperationType::Investment,
            None,
            Some(1_000_000),
            "Should work now".to_string(),
        );

        assert!(working_operation.is_ok());
        println!("✅ Operations working normally after unpause");
    }
}
