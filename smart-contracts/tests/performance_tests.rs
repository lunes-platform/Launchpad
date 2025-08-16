// Testes de Performance Comparativos para Otimizações de Gas
// Este arquivo contém benchmarks detalhados para validar as otimizações implementadas

#[cfg(test)]
mod performance_benchmarks {
    use super::*;
    use ink::env::test;
    
    // Estruturas para medição de performance
    struct PerformanceMetrics {
        gas_used: u64,
        storage_reads: u32,
        storage_writes: u32,
        execution_time_ns: u128,
    }
    
    impl PerformanceMetrics {
        fn new() -> Self {
            Self {
                gas_used: 0,
                storage_reads: 0,
                storage_writes: 0,
                execution_time_ns: 0,
            }
        }
        
        fn start_measurement() -> u64 {
            test::recorded_gas_consumption()
        }
        
        fn end_measurement(&mut self, start_gas: u64) {
            self.gas_used = test::recorded_gas_consumption() - start_gas;
        }
    }
    
    // Função auxiliar para criar dados de teste
    fn create_benchmark_data() -> (AccountId, [u8; 64], [u8; 256], Vec<PhaseCompact>) {
        let token_address = AccountId::from([0x42; 32]);
        
        let mut name = [0u8; 64];
        let name_str = b"Benchmark Project for Gas Optimization Testing";
        name[..name_str.len()].copy_from_slice(name_str);
        
        let mut description = [0u8; 256];
        let desc_str = b"This is a comprehensive benchmark project designed to test gas optimization improvements in the Launchpad Lunes smart contract system";
        description[..desc_str.len()].copy_from_slice(desc_str);
        
        let phases = vec![
            PhaseCompact {
                phase_type: PhaseType::Whitelist,
                status: PhaseStatus::PendingApproval,
                start_date: 2000000000,
                end_date: 2000001000,
                fundraising_goal: Some(100000),
                token_price: Some(1000),
                max_participants: Some(500),
            },
            PhaseCompact {
                phase_type: PhaseType::Presale,
                status: PhaseStatus::PendingApproval,
                start_date: 2000002000,
                end_date: 2000003000,
                fundraising_goal: Some(500000),
                token_price: Some(800),
                max_participants: Some(1000),
            },
            PhaseCompact {
                phase_type: PhaseType::PublicSale,
                status: PhaseStatus::PendingApproval,
                start_date: 2000004000,
                end_date: 2000005000,
                fundraising_goal: Some(1000000),
                token_price: Some(1200),
                max_participants: Some(5000),
            },
        ];
        
        (token_address, name, description, phases)
    }
    
    #[ink::test]
    fn benchmark_project_registration() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        let (token_address, name, description, phases) = create_benchmark_data();
        
        // Medição de performance
        let mut metrics = PerformanceMetrics::new();
        let start_gas = PerformanceMetrics::start_measurement();
        
        // Operação a ser medida
        let result = contract.register_project(token_address, name, description, phases);
        
        metrics.end_measurement(start_gas);
        
        // Validações
        assert!(result.is_ok());
        let project_id = result.unwrap();
        assert_eq!(project_id, 1);
        
        // Relatório de performance
        println!("📊 Benchmark: Project Registration");
        println!("   Gas usado: {} units", metrics.gas_used);
        println!("   Project ID: {}", project_id);
        
        // Verificar eficiência
        assert!(metrics.gas_used < 50000, "Gas usage too high: {}", metrics.gas_used);
    }
    
    #[ink::test]
    fn benchmark_multiple_registrations() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        let mut total_gas = 0u64;
        
        // Registrar múltiplos projetos
        for i in 0..10 {
            let token_address = AccountId::from([i as u8; 32]);
            let (_, name, description, phases) = create_benchmark_data();
            
            let start_gas = PerformanceMetrics::start_measurement();
            let result = contract.register_project(token_address, name, description, phases);
            let gas_used = test::recorded_gas_consumption() - start_gas;
            
            assert!(result.is_ok());
            total_gas += gas_used;
        }
        
        let avg_gas = total_gas / 10;
        
        println!("📊 Benchmark: Multiple Registrations");
        println!("   Total gas: {} units", total_gas);
        println!("   Average gas per registration: {} units", avg_gas);
        println!("   Gas efficiency: {}%", (50000 - avg_gas) * 100 / 50000);
        
        // Verificar que o gas médio não aumenta significativamente
        assert!(avg_gas < 45000, "Average gas too high: {}", avg_gas);
    }
    
    #[ink::test]
    fn benchmark_status_updates() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        let (token_address, name, description, phases) = create_benchmark_data();
        
        // Registrar projeto
        let project_id = contract.register_project(token_address, name, description, phases).unwrap();
        
        // Benchmark de atualizações de status
        let status_transitions = vec![
            ProjectStatus::PendingDeposit,
            ProjectStatus::Active,
            ProjectStatus::Completed,
        ];
        
        let mut total_gas = 0u64;
        
        for status in status_transitions {
            let start_gas = PerformanceMetrics::start_measurement();
            let result = contract.update_project_status(project_id, status);
            let gas_used = test::recorded_gas_consumption() - start_gas;
            
            assert!(result.is_ok());
            total_gas += gas_used;
        }
        
        let avg_gas = total_gas / 3;
        
        println!("📊 Benchmark: Status Updates");
        println!("   Total gas: {} units", total_gas);
        println!("   Average gas per update: {} units", avg_gas);
        
        assert!(avg_gas < 10000, "Status update gas too high: {}", avg_gas);
    }
    
    #[ink::test]
    fn benchmark_deposit_recording() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        let (token_address, name, description, phases) = create_benchmark_data();
        
        // Registrar projeto
        let project_id = contract.register_project(token_address, name, description, phases).unwrap();
        
        // Benchmark de registro de depósito
        let deposit_hash = [0x42u8; 32];
        let amount = 5000u128;
        
        let start_gas = PerformanceMetrics::start_measurement();
        let result = contract.record_safeguard_deposit(project_id, deposit_hash, amount);
        let gas_used = test::recorded_gas_consumption() - start_gas;
        
        assert!(result.is_ok());
        
        println!("📊 Benchmark: Deposit Recording");
        println!("   Gas usado: {} units", gas_used);
        
        assert!(gas_used < 15000, "Deposit recording gas too high: {}", gas_used);
    }
    
    #[ink::test]
    fn benchmark_phase_operations() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        let (token_address, name, description, phases) = create_benchmark_data();
        
        // Registrar projeto com múltiplas fases
        let project_id = contract.register_project(token_address, name, description, phases).unwrap();
        
        // Benchmark de aprovação de fases
        let mut total_gas = 0u64;
        
        for phase_index in 0..3u8 {
            let start_gas = PerformanceMetrics::start_measurement();
            let result = contract.approve_phase(project_id, phase_index);
            let gas_used = test::recorded_gas_consumption() - start_gas;
            
            assert!(result.is_ok());
            total_gas += gas_used;
        }
        
        let avg_gas = total_gas / 3;
        
        println!("📊 Benchmark: Phase Operations");
        println!("   Total gas: {} units", total_gas);
        println!("   Average gas per phase approval: {} units", avg_gas);
        
        assert!(avg_gas < 8000, "Phase approval gas too high: {}", avg_gas);
    }
    
    #[ink::test]
    fn benchmark_query_operations() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        let (token_address, name, description, phases) = create_benchmark_data();
        
        // Registrar projeto
        let project_id = contract.register_project(token_address, name, description, phases).unwrap();
        
        // Benchmark de operações de consulta
        let queries = vec![
            ("get_project_core", || contract.get_project_core(project_id)),
            ("get_project_metadata", || contract.get_project_metadata(project_id)),
            ("get_project_phase", || contract.get_project_phase(project_id, 0)),
            ("is_token_registered", || Ok(contract.is_token_registered(token_address))),
        ];
        
        for (query_name, query_fn) in queries {
            let start_gas = PerformanceMetrics::start_measurement();
            let result = query_fn();
            let gas_used = test::recorded_gas_consumption() - start_gas;
            
            assert!(result.is_ok());
            
            println!("📊 Benchmark: {} - Gas: {} units", query_name, gas_used);
            assert!(gas_used < 5000, "{} gas too high: {}", query_name, gas_used);
        }
    }
    
    #[ink::test]
    fn benchmark_approver_operations() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        
        // Benchmark de operações de aprovador
        let approvers = vec![
            AccountId::from([0x10; 32]),
            AccountId::from([0x20; 32]),
            AccountId::from([0x30; 32]),
            AccountId::from([0x40; 32]),
            AccountId::from([0x50; 32]),
        ];
        
        let mut total_add_gas = 0u64;
        let mut total_check_gas = 0u64;
        let mut total_remove_gas = 0u64;
        
        // Adicionar aprovadores
        for approver in &approvers {
            let start_gas = PerformanceMetrics::start_measurement();
            let result = contract.add_approver(*approver);
            let gas_used = test::recorded_gas_consumption() - start_gas;
            
            assert!(result.is_ok());
            total_add_gas += gas_used;
        }
        
        // Verificar aprovadores
        for approver in &approvers {
            let start_gas = PerformanceMetrics::start_measurement();
            let is_approver = contract.is_approver(*approver);
            let gas_used = test::recorded_gas_consumption() - start_gas;
            
            assert!(is_approver);
            total_check_gas += gas_used;
        }
        
        // Remover aprovadores
        for approver in &approvers {
            let start_gas = PerformanceMetrics::start_measurement();
            let result = contract.remove_approver(*approver);
            let gas_used = test::recorded_gas_consumption() - start_gas;
            
            assert!(result.is_ok());
            total_remove_gas += gas_used;
        }
        
        let avg_add = total_add_gas / approvers.len() as u64;
        let avg_check = total_check_gas / approvers.len() as u64;
        let avg_remove = total_remove_gas / approvers.len() as u64;
        
        println!("📊 Benchmark: Approver Operations");
        println!("   Average add gas: {} units", avg_add);
        println!("   Average check gas: {} units", avg_check);
        println!("   Average remove gas: {} units", avg_remove);
        
        // Verificar eficiência O(1)
        assert!(avg_add < 3000, "Add approver gas too high: {}", avg_add);
        assert!(avg_check < 1000, "Check approver gas too high: {}", avg_check);
        assert!(avg_remove < 2000, "Remove approver gas too high: {}", avg_remove);
    }
    
    #[ink::test]
    fn benchmark_pause_operations() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        
        // Benchmark pause/unpause
        let start_gas = PerformanceMetrics::start_measurement();
        let result = contract.pause();
        let pause_gas = test::recorded_gas_consumption() - start_gas;
        
        assert!(result.is_ok());
        assert!(contract.is_paused());
        
        let start_gas = PerformanceMetrics::start_measurement();
        let result = contract.unpause();
        let unpause_gas = test::recorded_gas_consumption() - start_gas;
        
        assert!(result.is_ok());
        assert!(!contract.is_paused());
        
        println!("📊 Benchmark: Pause Operations");
        println!("   Pause gas: {} units", pause_gas);
        println!("   Unpause gas: {} units", unpause_gas);
        
        assert!(pause_gas < 5000, "Pause gas too high: {}", pause_gas);
        assert!(unpause_gas < 5000, "Unpause gas too high: {}", unpause_gas);
    }
    
    #[ink::test]
    fn benchmark_comprehensive_workflow() {
        let accounts = test::default_accounts::<ink::env::DefaultEnvironment>();
        test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
        
        let mut contract = ProjectRegistry::new(accounts.bob, 1000);
        let (token_address, name, description, phases) = create_benchmark_data();
        
        println!("📊 Comprehensive Workflow Benchmark");
        
        // 1. Registrar projeto
        let start_gas = PerformanceMetrics::start_measurement();
        let project_id = contract.register_project(token_address, name, description, phases).unwrap();
        let register_gas = test::recorded_gas_consumption() - start_gas;
        println!("   1. Register project: {} gas", register_gas);
        
        // 2. Atualizar status
        let start_gas = PerformanceMetrics::start_measurement();
        contract.update_project_status(project_id, ProjectStatus::PendingDeposit).unwrap();
        let status_gas = test::recorded_gas_consumption() - start_gas;
        println!("   2. Update status: {} gas", status_gas);
        
        // 3. Registrar depósito
        let start_gas = PerformanceMetrics::start_measurement();
        contract.record_safeguard_deposit(project_id, [0x42; 32], 5000).unwrap();
        let deposit_gas = test::recorded_gas_consumption() - start_gas;
        println!("   3. Record deposit: {} gas", deposit_gas);
        
        // 4. Aprovar fases
        let start_gas = PerformanceMetrics::start_measurement();
        contract.approve_phase(project_id, 0).unwrap();
        let phase_gas = test::recorded_gas_consumption() - start_gas;
        println!("   4. Approve phase: {} gas", phase_gas);
        
        // 5. Consultar dados
        let start_gas = PerformanceMetrics::start_measurement();
        let _project = contract.get_project_core(project_id).unwrap();
        let query_gas = test::recorded_gas_consumption() - start_gas;
        println!("   5. Query project: {} gas", query_gas);
        
        let total_gas = register_gas + status_gas + deposit_gas + phase_gas + query_gas;
        println!("   Total workflow gas: {} units", total_gas);
        
        // Verificar eficiência total
        assert!(total_gas < 100000, "Total workflow gas too high: {}", total_gas);
    }
}
