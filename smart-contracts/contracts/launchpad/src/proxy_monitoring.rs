#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// Monitoring and Metrics System for Launchpad Proxy
/// 
/// Features:
/// - Real-time metrics collection
/// - Health checks
/// - Performance monitoring
/// - Security event tracking
/// - Automated alerting

#[ink::contract]
mod proxy_monitoring {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;
    use ink::prelude::string::String;

    /// Monitoring data structure
    #[ink(storage)]
    pub struct ProxyMonitoring {
        /// Proxy contract being monitored
        proxy_address: AccountId,
        /// Admin who can configure monitoring
        admin: AccountId,
        /// Metrics collection
        call_count: u64,
        failed_calls: u64,
        upgrade_count: u64,
        pause_count: u64,
        /// Performance metrics
        average_gas_usage: u64,
        peak_gas_usage: u64,
        /// Security metrics
        unauthorized_attempts: u64,
        security_violations: Mapping<String, u64>,
        /// Health status
        last_health_check: u64,
        health_status: HealthStatus,
        /// Alert configuration
        alert_thresholds: AlertThresholds,
        /// Event log for analysis
        recent_events: Vec<MonitoringEvent>,
        max_events: u32,
    }

    /// Health status enumeration
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub enum HealthStatus {
        Healthy,
        Warning,
        Critical,
        Unknown,
    }

    /// Alert thresholds configuration
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct AlertThresholds {
        pub max_failed_calls_per_hour: u32,
        pub max_unauthorized_attempts_per_hour: u32,
        pub max_gas_usage_threshold: u64,
        pub health_check_interval: u64,
    }

    /// Monitoring event structure
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct MonitoringEvent {
        pub event_type: EventType,
        pub timestamp: u64,
        pub details: String,
        pub severity: Severity,
        pub gas_used: Option<u64>,
    }

    /// Event types for monitoring
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum EventType {
        ProxyCall,
        UpgradeProposed,
        UpgradeExecuted,
        UpgradeCancelled,
        EmergencyPause,
        UnauthorizedAccess,
        SecurityViolation,
        HealthCheck,
        PerformanceAlert,
    }

    /// Severity levels
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Severity {
        Info,
        Warning,
        Error,
        Critical,
    }

    /// Comprehensive metrics report
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct MetricsReport {
        pub total_calls: u64,
        pub failed_calls: u64,
        pub success_rate: u32, // Percentage
        pub upgrade_count: u64,
        pub pause_count: u64,
        pub unauthorized_attempts: u64,
        pub average_gas_usage: u64,
        pub peak_gas_usage: u64,
        pub health_status: HealthStatus,
        pub last_health_check: u64,
        pub uptime_percentage: u32,
    }

    /// Events for external monitoring systems
    #[ink(event)]
    pub struct MetricsUpdated {
        #[ink(topic)]
        metric_type: String,
        old_value: u64,
        new_value: u64,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct AlertTriggered {
        #[ink(topic)]
        alert_type: String,
        #[ink(topic)]
        severity: Severity,
        message: String,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct HealthStatusChanged {
        #[ink(topic)]
        old_status: HealthStatus,
        #[ink(topic)]
        new_status: HealthStatus,
        reason: String,
        timestamp: u64,
    }

    /// Errors
    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum MonitoringError {
        Unauthorized,
        InvalidThreshold,
        EventLogFull,
        InvalidMetric,
    }

    pub type Result<T> = core::result::Result<T, MonitoringError>;

    impl ProxyMonitoring {
        /// Constructor
        #[ink(constructor)]
        pub fn new(proxy_address: AccountId, admin: AccountId) -> Self {
            let default_thresholds = AlertThresholds {
                max_failed_calls_per_hour: 100,
                max_unauthorized_attempts_per_hour: 50,
                max_gas_usage_threshold: 10_000_000,
                health_check_interval: 3600, // 1 hour
            };

            Self {
                proxy_address,
                admin,
                call_count: 0,
                failed_calls: 0,
                upgrade_count: 0,
                pause_count: 0,
                average_gas_usage: 0,
                peak_gas_usage: 0,
                unauthorized_attempts: 0,
                security_violations: Mapping::default(),
                last_health_check: 0,
                health_status: HealthStatus::Unknown,
                alert_thresholds: default_thresholds,
                recent_events: Vec::new(),
                max_events: 1000,
            }
        }

        /// Record a proxy call
        #[ink(message)]
        pub fn record_call(&mut self, success: bool, gas_used: u64) -> Result<()> {
            self.call_count += 1;
            
            if !success {
                self.failed_calls += 1;
            }

            // Update gas metrics
            self.update_gas_metrics(gas_used);

            // Add event to log
            self.add_event(MonitoringEvent {
                event_type: EventType::ProxyCall,
                timestamp: self.env().block_timestamp(),
                details: format!("Call {} - Gas: {}", if success { "succeeded" } else { "failed" }, gas_used),
                severity: if success { Severity::Info } else { Severity::Warning },
                gas_used: Some(gas_used),
            })?;

            // Check for alerts
            self.check_performance_alerts()?;

            Ok(())
        }

        /// Record an upgrade event
        #[ink(message)]
        pub fn record_upgrade(&mut self, event_type: EventType, details: String) -> Result<()> {
            self.ensure_admin()?;

            match event_type {
                EventType::UpgradeProposed | EventType::UpgradeExecuted => {
                    if event_type == EventType::UpgradeExecuted {
                        self.upgrade_count += 1;
                    }
                },
                _ => {}
            }

            self.add_event(MonitoringEvent {
                event_type,
                timestamp: self.env().block_timestamp(),
                details,
                severity: Severity::Info,
                gas_used: None,
            })?;

            Ok(())
        }

        /// Record security violation
        #[ink(message)]
        pub fn record_security_violation(&mut self, violation_type: String, details: String) -> Result<()> {
            // Increment violation counter
            let current_count = self.security_violations.get(&violation_type).unwrap_or(0);
            self.security_violations.insert(&violation_type, &(current_count + 1));

            if violation_type == "unauthorized_access" {
                self.unauthorized_attempts += 1;
            }

            // Add high-severity event
            self.add_event(MonitoringEvent {
                event_type: EventType::SecurityViolation,
                timestamp: self.env().block_timestamp(),
                details: format!("{}: {}", violation_type, details),
                severity: Severity::Error,
                gas_used: None,
            })?;

            // Trigger security alert
            self.env().emit_event(AlertTriggered {
                alert_type: "SECURITY_VIOLATION".to_string(),
                severity: Severity::Error,
                message: format!("Security violation detected: {}", violation_type),
                timestamp: self.env().block_timestamp(),
            });

            // Check if we need to escalate health status
            self.update_health_status_on_security_event()?;

            Ok(())
        }

        /// Perform health check
        #[ink(message)]
        pub fn perform_health_check(&mut self) -> Result<HealthStatus> {
            let current_time = self.env().block_timestamp();
            self.last_health_check = current_time;

            let new_status = self.calculate_health_status();
            
            if new_status != self.health_status {
                let old_status = self.health_status.clone();
                self.health_status = new_status.clone();

                self.env().emit_event(HealthStatusChanged {
                    old_status,
                    new_status: new_status.clone(),
                    reason: "Periodic health check".to_string(),
                    timestamp: current_time,
                });
            }

            self.add_event(MonitoringEvent {
                event_type: EventType::HealthCheck,
                timestamp: current_time,
                details: format!("Health status: {:?}", new_status),
                severity: match new_status {
                    HealthStatus::Healthy => Severity::Info,
                    HealthStatus::Warning => Severity::Warning,
                    HealthStatus::Critical => Severity::Critical,
                    HealthStatus::Unknown => Severity::Warning,
                },
                gas_used: None,
            })?;

            Ok(new_status)
        }

        /// Get comprehensive metrics report
        #[ink(message)]
        pub fn get_metrics_report(&self) -> MetricsReport {
            let success_rate = if self.call_count > 0 {
                ((self.call_count - self.failed_calls) * 100 / self.call_count) as u32
            } else {
                100
            };

            // Calculate uptime (simplified - in production would track actual downtime)
            let uptime_percentage = match self.health_status {
                HealthStatus::Healthy => 100,
                HealthStatus::Warning => 95,
                HealthStatus::Critical => 80,
                HealthStatus::Unknown => 50,
            };

            MetricsReport {
                total_calls: self.call_count,
                failed_calls: self.failed_calls,
                success_rate,
                upgrade_count: self.upgrade_count,
                pause_count: self.pause_count,
                unauthorized_attempts: self.unauthorized_attempts,
                average_gas_usage: self.average_gas_usage,
                peak_gas_usage: self.peak_gas_usage,
                health_status: self.health_status.clone(),
                last_health_check: self.last_health_check,
                uptime_percentage,
            }
        }

        /// Get recent events for analysis
        #[ink(message)]
        pub fn get_recent_events(&self, count: u32) -> Vec<MonitoringEvent> {
            let actual_count = core::cmp::min(count as usize, self.recent_events.len());
            self.recent_events[self.recent_events.len() - actual_count..].to_vec()
        }

        /// Update alert thresholds
        #[ink(message)]
        pub fn update_alert_thresholds(&mut self, new_thresholds: AlertThresholds) -> Result<()> {
            self.ensure_admin()?;
            
            // Validate thresholds
            if new_thresholds.max_failed_calls_per_hour == 0 || 
               new_thresholds.health_check_interval == 0 {
                return Err(MonitoringError::InvalidThreshold);
            }

            self.alert_thresholds = new_thresholds;
            Ok(())
        }

        /// Get security violation counts
        #[ink(message)]
        pub fn get_security_violations(&self) -> Vec<(String, u64)> {
            // In a real implementation, would iterate through the mapping
            // For now, return a simplified version
            vec![
                ("unauthorized_access".to_string(), self.unauthorized_attempts),
                ("invalid_upgrade".to_string(), 0), // Would be tracked separately
            ]
        }

        /// Private helper functions

        fn update_gas_metrics(&mut self, gas_used: u64) {
            if gas_used > self.peak_gas_usage {
                self.peak_gas_usage = gas_used;
            }

            // Update average (simplified calculation)
            if self.call_count == 1 {
                self.average_gas_usage = gas_used;
            } else {
                self.average_gas_usage = (self.average_gas_usage * (self.call_count - 1) + gas_used) / self.call_count;
            }
        }

        fn add_event(&mut self, event: MonitoringEvent) -> Result<()> {
            if self.recent_events.len() >= self.max_events as usize {
                self.recent_events.remove(0); // Remove oldest event
            }
            
            self.recent_events.push(event);
            Ok(())
        }

        fn calculate_health_status(&self) -> HealthStatus {
            let current_time = self.env().block_timestamp();
            
            // Check if health check is overdue
            if self.last_health_check > 0 && 
               current_time - self.last_health_check > self.alert_thresholds.health_check_interval * 2 {
                return HealthStatus::Unknown;
            }

            // Check failure rate
            if self.call_count > 0 {
                let failure_rate = (self.failed_calls * 100) / self.call_count;
                if failure_rate > 20 {
                    return HealthStatus::Critical;
                } else if failure_rate > 10 {
                    return HealthStatus::Warning;
                }
            }

            // Check unauthorized attempts
            if self.unauthorized_attempts > self.alert_thresholds.max_unauthorized_attempts_per_hour as u64 {
                return HealthStatus::Warning;
            }

            HealthStatus::Healthy
        }

        fn check_performance_alerts(&mut self) -> Result<()> {
            // Check gas usage alert
            if self.peak_gas_usage > self.alert_thresholds.max_gas_usage_threshold {
                self.env().emit_event(AlertTriggered {
                    alert_type: "HIGH_GAS_USAGE".to_string(),
                    severity: Severity::Warning,
                    message: format!("Peak gas usage exceeded threshold: {}", self.peak_gas_usage),
                    timestamp: self.env().block_timestamp(),
                });
            }

            // Check failure rate alert
            if self.call_count > 0 {
                let failure_rate = (self.failed_calls * 100) / self.call_count;
                if failure_rate > 15 {
                    self.env().emit_event(AlertTriggered {
                        alert_type: "HIGH_FAILURE_RATE".to_string(),
                        severity: Severity::Error,
                        message: format!("Failure rate is {}%", failure_rate),
                        timestamp: self.env().block_timestamp(),
                    });
                }
            }

            Ok(())
        }

        fn update_health_status_on_security_event(&mut self) -> Result<()> {
            if self.unauthorized_attempts > self.alert_thresholds.max_unauthorized_attempts_per_hour as u64 {
                let old_status = self.health_status.clone();
                self.health_status = HealthStatus::Warning;

                self.env().emit_event(HealthStatusChanged {
                    old_status,
                    new_status: HealthStatus::Warning,
                    reason: "High number of security violations".to_string(),
                    timestamp: self.env().block_timestamp(),
                });
            }

            Ok(())
        }

        fn ensure_admin(&self) -> Result<()> {
            if self.env().caller() != self.admin {
                return Err(MonitoringError::Unauthorized);
            }
            Ok(())
        }
    }
}
