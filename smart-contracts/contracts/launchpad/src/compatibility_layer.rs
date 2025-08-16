#![cfg_attr(not(feature = "std"), no_std, no_main)]

/// Compatibility Layer for Launchpad Lunes
/// 
/// Features:
/// - Backward compatibility between versions
/// - API translation between old and new interfaces
/// - Graceful degradation for unsupported features
/// - Version detection and routing

#[ink::contract]
mod compatibility_layer {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;
    use ink::prelude::string::String;
    use ink::scale::{Encode, Decode};

    /// Compatibility layer for handling different API versions
    #[ink(storage)]
    pub struct CompatibilityLayer {
        /// Current implementation version
        current_version: u32,
        /// Supported API versions
        supported_versions: Mapping<u32, bool>,
        /// Version-specific configurations
        version_configs: Mapping<u32, VersionConfig>,
        /// Feature compatibility matrix
        feature_compatibility: Mapping<(u32, String), bool>,
        /// Admin for configuration
        admin: AccountId,
    }

    /// Configuration for each version
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct VersionConfig {
        pub version: u32,
        pub api_prefix: String,
        pub supported_features: Vec<String>,
        pub deprecated_features: Vec<String>,
        pub migration_path: Option<u32>, // Next version to migrate to
    }

    /// API request wrapper for version handling
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ApiRequest {
        pub version: u32,
        pub method: String,
        pub params: Vec<u8>,
        pub caller: AccountId,
    }

    /// API response wrapper
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ApiResponse {
        pub success: bool,
        pub data: Vec<u8>,
        pub error_message: Option<String>,
        pub version_used: u32,
        pub deprecated_warning: Option<String>,
    }

    /// Legacy V1 project structure for compatibility
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct LegacyProjectInfo {
        pub project_id: String,
        pub owner: AccountId,
        pub token_address: AccountId,
        pub name: String,
        pub description: String,
        pub status: u8, // Simple enum as u8
        pub created_at: u64,
        pub safeguard_deposit_amount: Balance,
    }

    /// Modern V2 project structure
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct ModernProjectInfo {
        pub project_id: String,
        pub owner: AccountId,
        pub token_address: AccountId,
        pub name: String,
        pub description: String,
        pub status: ProjectStatus,
        pub created_at: u64,
        pub last_updated: u64,
        pub safeguard_deposit_tx: Option<String>,
        pub safeguard_deposit_amount: Balance,
        pub phase_schedule: Vec<PhaseInfo>,
        pub data_hash: [u8; 32],
        pub nonce: u64,
        // V2 additions
        pub project_category: String,
        pub social_links: Vec<String>,
        pub team_info: String,
        pub kyc_verified: bool,
    }

    /// Project status enum
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum ProjectStatus {
        PendingReview,
        PendingDeposit,
        Active,
        Completed,
        Cancelled,
        Rejected,
        Quarantined,
        EmergencySuspended,
    }

    /// Phase information
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct PhaseInfo {
        pub phase_type: u8,
        pub start_date: u64,
        pub end_date: u64,
        pub status: u8,
        pub fundraising_goal: Option<Balance>,
        pub token_price: Option<Balance>,
        pub max_participants: Option<u32>,
        pub validation_hash: [u8; 32],
    }

    /// Events for compatibility tracking
    #[ink(event)]
    pub struct CompatibilityWarning {
        #[ink(topic)]
        api_version: u32,
        #[ink(topic)]
        method: String,
        warning_message: String,
        caller: AccountId,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct VersionMismatch {
        #[ink(topic)]
        requested_version: u32,
        #[ink(topic)]
        current_version: u32,
        method: String,
        caller: AccountId,
        timestamp: u64,
    }

    #[ink(event)]
    pub struct FeatureDeprecated {
        #[ink(topic)]
        feature: String,
        #[ink(topic)]
        version: u32,
        replacement: Option<String>,
        caller: AccountId,
        timestamp: u64,
    }

    /// Errors
    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum CompatibilityError {
        UnsupportedVersion,
        UnsupportedFeature,
        DeprecatedMethod,
        InvalidRequest,
        TranslationFailed,
        Unauthorized,
    }

    pub type Result<T> = core::result::Result<T, CompatibilityError>;

    impl CompatibilityLayer {
        /// Constructor
        #[ink(constructor)]
        pub fn new(admin: AccountId) -> Self {
            let mut instance = Self {
                current_version: 2, // Start with V2 as current
                supported_versions: Mapping::default(),
                version_configs: Mapping::default(),
                feature_compatibility: Mapping::default(),
                admin,
            };

            // Initialize supported versions
            instance.supported_versions.insert(1, &true);
            instance.supported_versions.insert(2, &true);

            // Configure V1
            let v1_config = VersionConfig {
                version: 1,
                api_prefix: "v1".to_string(),
                supported_features: vec![
                    "register_project".to_string(),
                    "update_status".to_string(),
                    "record_deposit".to_string(),
                ],
                deprecated_features: vec![],
                migration_path: Some(2),
            };
            instance.version_configs.insert(1, &v1_config);

            // Configure V2
            let v2_config = VersionConfig {
                version: 2,
                api_prefix: "v2".to_string(),
                supported_features: vec![
                    "register_project".to_string(),
                    "register_project_enhanced".to_string(),
                    "update_status".to_string(),
                    "record_deposit".to_string(),
                    "manage_phases".to_string(),
                    "social_integration".to_string(),
                ],
                deprecated_features: vec![],
                migration_path: None,
            };
            instance.version_configs.insert(2, &v2_config);

            // Set up feature compatibility
            instance.setup_feature_compatibility();

            instance
        }

        /// Handle API request with version compatibility
        #[ink(message)]
        pub fn handle_request(&mut self, request: ApiRequest) -> Result<ApiResponse> {
            // Check if version is supported
            if !self.is_version_supported(request.version) {
                self.env().emit_event(VersionMismatch {
                    requested_version: request.version,
                    current_version: self.current_version,
                    method: request.method.clone(),
                    caller: request.caller,
                    timestamp: self.env().block_timestamp(),
                });
                return Err(CompatibilityError::UnsupportedVersion);
            }

            // Route request based on version
            match request.version {
                1 => self.handle_v1_request(request),
                2 => self.handle_v2_request(request),
                _ => Err(CompatibilityError::UnsupportedVersion),
            }
        }

        /// Handle V1 API requests
        fn handle_v1_request(&mut self, request: ApiRequest) -> Result<ApiResponse> {
            match request.method.as_str() {
                "register_project" => {
                    // Decode V1 parameters and translate to V2
                    let v1_result = self.register_project_v1_compat(request.params);
                    match v1_result {
                        Ok(project_id) => Ok(ApiResponse {
                            success: true,
                            data: project_id.encode(),
                            error_message: None,
                            version_used: 1,
                            deprecated_warning: Some("V1 API is deprecated. Please migrate to V2.".to_string()),
                        }),
                        Err(error) => Ok(ApiResponse {
                            success: false,
                            data: Vec::new(),
                            error_message: Some(format!("V1 registration failed: {:?}", error)),
                            version_used: 1,
                            deprecated_warning: None,
                        }),
                    }
                },
                "get_project" => {
                    // Get project and convert to V1 format
                    let project_id = String::decode(&mut &request.params[..])
                        .map_err(|_| CompatibilityError::InvalidRequest)?;
                    
                    let v1_project = self.get_project_v1_compat(project_id)?;
                    Ok(ApiResponse {
                        success: true,
                        data: v1_project.encode(),
                        error_message: None,
                        version_used: 1,
                        deprecated_warning: Some("V1 format has limited fields. Consider upgrading to V2.".to_string()),
                    })
                },
                _ => {
                    self.emit_deprecation_warning(&request.method, 1);
                    Err(CompatibilityError::DeprecatedMethod)
                }
            }
        }

        /// Handle V2 API requests
        fn handle_v2_request(&mut self, request: ApiRequest) -> Result<ApiResponse> {
            match request.method.as_str() {
                "register_project_enhanced" => {
                    // Handle V2 enhanced registration
                    let v2_result = self.register_project_v2_enhanced(request.params);
                    match v2_result {
                        Ok(project_id) => Ok(ApiResponse {
                            success: true,
                            data: project_id.encode(),
                            error_message: None,
                            version_used: 2,
                            deprecated_warning: None,
                        }),
                        Err(error) => Ok(ApiResponse {
                            success: false,
                            data: Vec::new(),
                            error_message: Some(format!("V2 registration failed: {:?}", error)),
                            version_used: 2,
                            deprecated_warning: None,
                        }),
                    }
                },
                "get_project" => {
                    // Get project in V2 format
                    let project_id = String::decode(&mut &request.params[..])
                        .map_err(|_| CompatibilityError::InvalidRequest)?;
                    
                    let v2_project = self.get_project_v2_format(project_id)?;
                    Ok(ApiResponse {
                        success: true,
                        data: v2_project.encode(),
                        error_message: None,
                        version_used: 2,
                        deprecated_warning: None,
                    })
                },
                _ => Err(CompatibilityError::UnsupportedFeature),
            }
        }

        /// Register project with V1 compatibility
        fn register_project_v1_compat(&self, params: Vec<u8>) -> Result<String> {
            // Decode V1 registration parameters
            // In a real implementation, would decode actual V1 parameters
            // and translate them to V2 format with defaults
            
            let project_id = format!("v1-compat-{}", self.env().block_timestamp());
            
            // Emit compatibility warning
            self.env().emit_event(CompatibilityWarning {
                api_version: 1,
                method: "register_project".to_string(),
                warning_message: "Using V1 compatibility mode with limited features".to_string(),
                caller: self.env().caller(),
                timestamp: self.env().block_timestamp(),
            });
            
            Ok(project_id)
        }

        /// Register project with V2 enhanced features
        fn register_project_v2_enhanced(&self, params: Vec<u8>) -> Result<String> {
            // Handle V2 enhanced registration with all features
            let project_id = format!("v2-enhanced-{}", self.env().block_timestamp());
            Ok(project_id)
        }

        /// Get project in V1 compatible format
        fn get_project_v1_compat(&self, project_id: String) -> Result<LegacyProjectInfo> {
            // In a real implementation, would fetch from storage and convert
            // For now, return a mock V1 project
            Ok(LegacyProjectInfo {
                project_id,
                owner: self.env().caller(),
                token_address: AccountId::from([0; 32]),
                name: "V1 Compatible Project".to_string(),
                description: "Project data converted to V1 format".to_string(),
                status: 0, // PendingReview
                created_at: self.env().block_timestamp(),
                safeguard_deposit_amount: 0,
            })
        }

        /// Get project in V2 format
        fn get_project_v2_format(&self, project_id: String) -> Result<ModernProjectInfo> {
            // In a real implementation, would fetch from storage
            // For now, return a mock V2 project
            Ok(ModernProjectInfo {
                project_id,
                owner: self.env().caller(),
                token_address: AccountId::from([0; 32]),
                name: "V2 Enhanced Project".to_string(),
                description: "Project with full V2 features".to_string(),
                status: ProjectStatus::PendingReview,
                created_at: self.env().block_timestamp(),
                last_updated: self.env().block_timestamp(),
                safeguard_deposit_tx: None,
                safeguard_deposit_amount: 0,
                phase_schedule: Vec::new(),
                data_hash: [0; 32],
                nonce: 1,
                project_category: "DeFi".to_string(),
                social_links: vec!["https://twitter.com/project".to_string()],
                team_info: "Experienced team".to_string(),
                kyc_verified: false,
            })
        }

        /// Check if version is supported
        #[ink(message)]
        pub fn is_version_supported(&self, version: u32) -> bool {
            self.supported_versions.get(version).unwrap_or(false)
        }

        /// Get version configuration
        #[ink(message)]
        pub fn get_version_config(&self, version: u32) -> Option<VersionConfig> {
            self.version_configs.get(version)
        }

        /// Check feature compatibility
        #[ink(message)]
        pub fn is_feature_compatible(&self, version: u32, feature: String) -> bool {
            self.feature_compatibility.get((version, feature)).unwrap_or(false)
        }

        /// Get current version
        #[ink(message)]
        pub fn get_current_version(&self) -> u32 {
            self.current_version
        }

        /// Setup feature compatibility matrix
        fn setup_feature_compatibility(&mut self) {
            // V1 features
            self.feature_compatibility.insert((1, "register_project".to_string()), &true);
            self.feature_compatibility.insert((1, "update_status".to_string()), &true);
            self.feature_compatibility.insert((1, "record_deposit".to_string()), &true);
            
            // V2 features (includes all V1 + new ones)
            self.feature_compatibility.insert((2, "register_project".to_string()), &true);
            self.feature_compatibility.insert((2, "register_project_enhanced".to_string()), &true);
            self.feature_compatibility.insert((2, "update_status".to_string()), &true);
            self.feature_compatibility.insert((2, "record_deposit".to_string()), &true);
            self.feature_compatibility.insert((2, "manage_phases".to_string()), &true);
            self.feature_compatibility.insert((2, "social_integration".to_string()), &true);
        }

        /// Emit deprecation warning
        fn emit_deprecation_warning(&self, method: &str, version: u32) {
            self.env().emit_event(FeatureDeprecated {
                feature: method.to_string(),
                version,
                replacement: Some("Use V2 API for enhanced features".to_string()),
                caller: self.env().caller(),
                timestamp: self.env().block_timestamp(),
            });
        }

        /// Admin functions
        #[ink(message)]
        pub fn add_version_support(&mut self, version: u32, config: VersionConfig) -> Result<()> {
            if self.env().caller() != self.admin {
                return Err(CompatibilityError::Unauthorized);
            }
            
            self.supported_versions.insert(version, &true);
            self.version_configs.insert(version, &config);
            Ok(())
        }

        #[ink(message)]
        pub fn remove_version_support(&mut self, version: u32) -> Result<()> {
            if self.env().caller() != self.admin {
                return Err(CompatibilityError::Unauthorized);
            }
            
            self.supported_versions.remove(version);
            self.version_configs.remove(version);
            Ok(())
        }
    }
}
