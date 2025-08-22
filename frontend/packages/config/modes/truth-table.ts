import type {
  Environment,
  Network,
  UserRole,
  OperationalState,
  SaleMode,
  WalletState,
  PaymentCurrency,
  ComplianceStatus,
} from "../environments/types";

/**
 * Configuração de modo específica para uma combinação de contexto
 */
export interface ModeConfiguration {
  // Identificação do modo
  id: string;
  name: string;
  description: string;

  // Contexto de aplicação
  environment: Environment;
  network: Network;
  userRole: UserRole;
  walletState: WalletState;
  operationalState: OperationalState;
  saleMode?: SaleMode;
  compliance?: Partial<ComplianceStatus>;

  // Funcionalidades habilitadas
  features: {
    // Ações de investimento
    canInvest: boolean;
    canWithdraw: boolean;
    canStake: boolean;
    canParticipateRaffle: boolean;
    canClaimRewards: boolean;

    // Configurações de UI
    canSwitchCurrency: boolean;
    canSwitchNetwork: boolean;
    showAdvancedFeatures: boolean;
    showDebugInfo: boolean;

    // Avisos e validações
    showKycWarning: boolean;
    showWhitelistWarning: boolean;
    requiresSignature: boolean;

    // Funcionalidades específicas por papel
    canManageProjects: boolean;
    canAccessAnalytics: boolean;
    canModerateUsers: boolean;
    canConfigureSystem: boolean;
  };

  // Limitações e restrições
  limits: {
    minInvestment?: string;
    maxInvestment?: string;
    dailyLimit?: string;
    cooldownPeriod?: number; // em segundos
    maxProjectsPerUser?: number;
  };

  // Moedas permitidas
  allowedCurrencies: PaymentCurrency[];

  // Configurações de UI
  ui: {
    theme: "light" | "dark" | "auto";
    showBetaFeatures: boolean;
    enableAnimations: boolean;
    compactMode: boolean;
  };

  // Configurações de polling e cache
  polling: {
    contractState: number;
    userData: number;
    prices: number;
  };
}

/**
 * Tabela de verdade dos modos
 * Cada entrada define um modo específico baseado no contexto
 */
export const MODE_TRUTH_TABLE: ModeConfiguration[] = [
  // ========================================
  // DESENVOLVIMENTO - LOCAL
  // ========================================
  {
    id: "dev-local-investor-disconnected",
    name: "Desenvolvimento - Investidor Desconectado",
    description:
      "Modo para desenvolvimento local com investidor sem carteira conectada",
    environment: "dev",
    network: "local",
    userRole: "investor",
    walletState: "disconnected",
    operationalState: "normal",
    features: {
      canInvest: false,
      canWithdraw: false,
      canStake: false,
      canParticipateRaffle: false,
      canClaimRewards: false,
      canSwitchCurrency: true,
      canSwitchNetwork: true,
      showAdvancedFeatures: false,
      showDebugInfo: true,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {},
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "auto",
      showBetaFeatures: true,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 10000, // 10s para dev
      userData: 30000, // 30s para dev
      prices: 60000, // 1min para dev
    },
  },

  {
    id: "dev-local-investor-readonly",
    name: "Desenvolvimento - Investidor Somente Leitura",
    description:
      "Modo para desenvolvimento local com investidor em modo somente leitura",
    environment: "dev",
    network: "local",
    userRole: "investor",
    walletState: "readonly",
    operationalState: "normal",
    features: {
      canInvest: false,
      canWithdraw: false,
      canStake: false,
      canParticipateRaffle: false,
      canClaimRewards: false,
      canSwitchCurrency: true,
      canSwitchNetwork: true,
      showAdvancedFeatures: false,
      showDebugInfo: true,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: true,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {},
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "auto",
      showBetaFeatures: true,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 10000,
      userData: 30000,
      prices: 60000,
    },
  },

  {
    id: "dev-local-investor-signed",
    name: "Desenvolvimento - Investidor Conectado",
    description:
      "Modo para desenvolvimento local com investidor com carteira assinada",
    environment: "dev",
    network: "local",
    userRole: "investor",
    walletState: "signed",
    operationalState: "normal",
    saleMode: "presale",
    features: {
      canInvest: true,
      canWithdraw: true,
      canStake: true,
      canParticipateRaffle: true,
      canClaimRewards: true,
      canSwitchCurrency: true,
      canSwitchNetwork: true,
      showAdvancedFeatures: false,
      showDebugInfo: true,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {
      minInvestment: "10",
      maxInvestment: "100000",
      dailyLimit: "50000",
      cooldownPeriod: 300, // 5 minutos para dev
    },
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "auto",
      showBetaFeatures: true,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 10000,
      userData: 15000,
      prices: 60000,
    },
  },

  {
    id: "dev-local-developer-signed",
    name: "Desenvolvimento - Desenvolvedor",
    description: "Modo para desenvolvimento local com desenvolvedor",
    environment: "dev",
    network: "local",
    userRole: "developer",
    walletState: "signed",
    operationalState: "normal",
    features: {
      canInvest: true,
      canWithdraw: true,
      canStake: true,
      canParticipateRaffle: true,
      canClaimRewards: true,
      canSwitchCurrency: true,
      canSwitchNetwork: true,
      showAdvancedFeatures: true,
      showDebugInfo: true,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: true,
      canAccessAnalytics: true,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {
      minInvestment: "1",
      maxInvestment: "1000000",
      dailyLimit: "500000",
      cooldownPeriod: 60,
      maxProjectsPerUser: 10,
    },
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "auto",
      showBetaFeatures: true,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 5000,
      userData: 10000,
      prices: 30000,
    },
  },

  {
    id: "dev-local-admin-signed",
    name: "Desenvolvimento - Administrador",
    description: "Modo para desenvolvimento local com administrador",
    environment: "dev",
    network: "local",
    userRole: "admin",
    walletState: "signed",
    operationalState: "normal",
    features: {
      canInvest: true,
      canWithdraw: true,
      canStake: true,
      canParticipateRaffle: true,
      canClaimRewards: true,
      canSwitchCurrency: true,
      canSwitchNetwork: true,
      showAdvancedFeatures: true,
      showDebugInfo: true,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: true,
      canAccessAnalytics: true,
      canModerateUsers: true,
      canConfigureSystem: true,
    },
    limits: {
      minInvestment: "0.1",
      maxInvestment: "10000000",
      dailyLimit: "5000000",
      cooldownPeriod: 0,
      maxProjectsPerUser: 100,
    },
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "auto",
      showBetaFeatures: true,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 5000,
      userData: 10000,
      prices: 30000,
    },
  },

  // ========================================
  // DESENVOLVIMENTO - TESTNET
  // ========================================
  {
    id: "dev-testnet-investor-signed",
    name: "Desenvolvimento - Testnet Investidor",
    description: "Modo para desenvolvimento em testnet com investidor",
    environment: "dev",
    network: "testnet",
    userRole: "investor",
    walletState: "signed",
    operationalState: "normal",
    saleMode: "presale",
    compliance: {
      kycRequired: true,
      whitelistRequired: false,
    },
    features: {
      canInvest: true,
      canWithdraw: true,
      canStake: true,
      canParticipateRaffle: true,
      canClaimRewards: true,
      canSwitchCurrency: true,
      canSwitchNetwork: true,
      showAdvancedFeatures: false,
      showDebugInfo: true,
      showKycWarning: true,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {
      minInvestment: "50",
      maxInvestment: "50000",
      dailyLimit: "25000",
      cooldownPeriod: 600, // 10 minutos
    },
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "auto",
      showBetaFeatures: true,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 15000,
      userData: 30000,
      prices: 60000,
    },
  },

  // ========================================
  // STAGING - TESTNET
  // ========================================
  {
    id: "staging-testnet-investor-signed",
    name: "Staging - Investidor",
    description: "Modo para ambiente de staging com investidor",
    environment: "staging",
    network: "testnet",
    userRole: "investor",
    walletState: "signed",
    operationalState: "normal",
    saleMode: "presale",
    compliance: {
      kycRequired: true,
      kycCompleted: false,
      whitelistRequired: true,
      whitelisted: false,
    },
    features: {
      canInvest: false, // Bloqueado até KYC e whitelist
      canWithdraw: true,
      canStake: false,
      canParticipateRaffle: false,
      canClaimRewards: true,
      canSwitchCurrency: true,
      canSwitchNetwork: false, // Fixo em testnet
      showAdvancedFeatures: false,
      showDebugInfo: false,
      showKycWarning: true,
      showWhitelistWarning: true,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {
      minInvestment: "100",
      maxInvestment: "25000",
      dailyLimit: "10000",
      cooldownPeriod: 1800, // 30 minutos
    },
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "light",
      showBetaFeatures: false,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 30000,
      userData: 60000,
      prices: 120000,
    },
  },

  {
    id: "staging-testnet-investor-signed-verified",
    name: "Staging - Investidor Verificado",
    description: "Modo para ambiente de staging com investidor verificado",
    environment: "staging",
    network: "testnet",
    userRole: "investor",
    walletState: "signed",
    operationalState: "normal",
    saleMode: "presale",
    compliance: {
      kycRequired: true,
      kycCompleted: true,
      whitelistRequired: true,
      whitelisted: true,
    },
    features: {
      canInvest: true,
      canWithdraw: true,
      canStake: true,
      canParticipateRaffle: true,
      canClaimRewards: true,
      canSwitchCurrency: true,
      canSwitchNetwork: false,
      showAdvancedFeatures: false,
      showDebugInfo: false,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {
      minInvestment: "100",
      maxInvestment: "25000",
      dailyLimit: "10000",
      cooldownPeriod: 1800,
    },
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "light",
      showBetaFeatures: false,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 30000,
      userData: 60000,
      prices: 120000,
    },
  },

  // ========================================
  // PRODUÇÃO - MAINNET
  // ========================================
  {
    id: "prod-mainnet-investor-disconnected",
    name: "Produção - Investidor Desconectado",
    description: "Modo para produção com investidor sem carteira",
    environment: "prod",
    network: "mainnet",
    userRole: "investor",
    walletState: "disconnected",
    operationalState: "normal",
    features: {
      canInvest: false,
      canWithdraw: false,
      canStake: false,
      canParticipateRaffle: false,
      canClaimRewards: false,
      canSwitchCurrency: true,
      canSwitchNetwork: false,
      showAdvancedFeatures: false,
      showDebugInfo: false,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {},
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "light",
      showBetaFeatures: false,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 60000,
      userData: 120000,
      prices: 300000,
    },
  },

  {
    id: "prod-mainnet-investor-signed-verified",
    name: "Produção - Investidor Verificado",
    description: "Modo para produção com investidor verificado",
    environment: "prod",
    network: "mainnet",
    userRole: "investor",
    walletState: "signed",
    operationalState: "normal",
    saleMode: "publicsale",
    compliance: {
      kycRequired: true,
      kycCompleted: true,
      whitelistRequired: false,
      whitelisted: true,
    },
    features: {
      canInvest: true,
      canWithdraw: true,
      canStake: true,
      canParticipateRaffle: true,
      canClaimRewards: true,
      canSwitchCurrency: true,
      canSwitchNetwork: false,
      showAdvancedFeatures: false,
      showDebugInfo: false,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {
      minInvestment: "500",
      maxInvestment: "100000",
      dailyLimit: "50000",
      cooldownPeriod: 3600, // 1 hora
    },
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "light",
      showBetaFeatures: false,
      enableAnimations: true,
      compactMode: false,
    },
    polling: {
      contractState: 60000,
      userData: 120000,
      prices: 300000,
    },
  },

  {
    id: "prod-mainnet-admin-signed",
    name: "Produção - Administrador",
    description: "Modo para produção com administrador",
    environment: "prod",
    network: "mainnet",
    userRole: "admin",
    walletState: "signed",
    operationalState: "normal",
    features: {
      canInvest: true,
      canWithdraw: true,
      canStake: true,
      canParticipateRaffle: true,
      canClaimRewards: true,
      canSwitchCurrency: true,
      canSwitchNetwork: false,
      showAdvancedFeatures: true,
      showDebugInfo: false,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: true,
      canAccessAnalytics: true,
      canModerateUsers: true,
      canConfigureSystem: true,
    },
    limits: {
      minInvestment: "1",
      maxInvestment: "10000000",
      dailyLimit: "5000000",
      cooldownPeriod: 0,
      maxProjectsPerUser: 1000,
    },
    allowedCurrencies: ["LUNES", "LUSDT"],
    ui: {
      theme: "light",
      showBetaFeatures: false,
      enableAnimations: true,
      compactMode: true,
    },
    polling: {
      contractState: 30000,
      userData: 60000,
      prices: 180000,
    },
  },

  // ========================================
  // MODOS ESPECIAIS - PAUSADO/MANUTENÇÃO
  // ========================================
  {
    id: "any-any-any-paused",
    name: "Sistema Pausado",
    description: "Modo quando o sistema está pausado",
    environment: "dev", // Aplicável a qualquer ambiente
    network: "local", // Aplicável a qualquer rede
    userRole: "investor", // Aplicável a qualquer papel
    walletState: "signed",
    operationalState: "paused",
    features: {
      canInvest: false,
      canWithdraw: false,
      canStake: false,
      canParticipateRaffle: false,
      canClaimRewards: false,
      canSwitchCurrency: false,
      canSwitchNetwork: false,
      showAdvancedFeatures: false,
      showDebugInfo: false,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {},
    allowedCurrencies: [],
    ui: {
      theme: "light",
      showBetaFeatures: false,
      enableAnimations: false,
      compactMode: true,
    },
    polling: {
      contractState: 120000, // Polling mais lento quando pausado
      userData: 300000,
      prices: 600000,
    },
  },

  {
    id: "any-any-any-maintenance",
    name: "Manutenção",
    description: "Modo durante manutenção do sistema",
    environment: "dev",
    network: "local",
    userRole: "investor",
    walletState: "disconnected",
    operationalState: "maintenance",
    features: {
      canInvest: false,
      canWithdraw: false,
      canStake: false,
      canParticipateRaffle: false,
      canClaimRewards: false,
      canSwitchCurrency: false,
      canSwitchNetwork: false,
      showAdvancedFeatures: false,
      showDebugInfo: false,
      showKycWarning: false,
      showWhitelistWarning: false,
      requiresSignature: false,
      canManageProjects: false,
      canAccessAnalytics: false,
      canModerateUsers: false,
      canConfigureSystem: false,
    },
    limits: {},
    allowedCurrencies: [],
    ui: {
      theme: "light",
      showBetaFeatures: false,
      enableAnimations: false,
      compactMode: true,
    },
    polling: {
      contractState: 0, // Sem polling durante manutenção
      userData: 0,
      prices: 0,
    },
  },
];

/**
 * Função para encontrar a configuração de modo baseada no contexto atual
 */
export function findModeConfiguration(context: {
  environment: Environment;
  network: Network;
  userRole: UserRole;
  walletState: WalletState;
  operationalState: OperationalState;
  saleMode?: SaleMode;
  compliance?: Partial<ComplianceStatus>;
}): ModeConfiguration | null {
  // Primeiro, verifica modos especiais (pausado/manutenção)
  if (context.operationalState === "paused") {
    return (
      MODE_TRUTH_TABLE.find((mode) => mode.id === "any-any-any-paused") || null
    );
  }

  if (context.operationalState === "maintenance") {
    return (
      MODE_TRUTH_TABLE.find((mode) => mode.id === "any-any-any-maintenance") ||
      null
    );
  }

  // Busca por correspondência exata
  const exactMatch = MODE_TRUTH_TABLE.find(
    (mode) =>
      mode.environment === context.environment &&
      mode.network === context.network &&
      mode.userRole === context.userRole &&
      mode.walletState === context.walletState &&
      mode.operationalState === context.operationalState &&
      (!mode.saleMode || mode.saleMode === context.saleMode) &&
      (!mode.compliance ||
        ((!mode.compliance.kycRequired ||
          mode.compliance.kycCompleted === context.compliance?.kycCompleted) &&
          (!mode.compliance.whitelistRequired ||
            mode.compliance.whitelisted === context.compliance?.whitelisted))),
  );

  if (exactMatch) {
    return exactMatch;
  }

  // Busca por correspondência parcial (sem compliance)
  const partialMatch = MODE_TRUTH_TABLE.find(
    (mode) =>
      mode.environment === context.environment &&
      mode.network === context.network &&
      mode.userRole === context.userRole &&
      mode.walletState === context.walletState &&
      mode.operationalState === context.operationalState &&
      !mode.compliance,
  );

  return partialMatch || null;
}

/**
 * Função para obter todas as configurações de modo para um ambiente específico
 */
export function getModeConfigurationsForEnvironment(
  environment: Environment,
): ModeConfiguration[] {
  return MODE_TRUTH_TABLE.filter(
    (mode) =>
      mode.environment === environment || mode.id.startsWith("any-any-any-"),
  );
}

/**
 * Função para obter todas as configurações de modo para uma rede específica
 */
export function getModeConfigurationsForNetwork(
  network: Network,
): ModeConfiguration[] {
  return MODE_TRUTH_TABLE.filter(
    (mode) => mode.network === network || mode.id.startsWith("any-any-any-"),
  );
}

/**
 * Função para obter todas as configurações de modo para um papel específico
 */
export function getModeConfigurationsForRole(
  userRole: UserRole,
): ModeConfiguration[] {
  return MODE_TRUTH_TABLE.filter(
    (mode) => mode.userRole === userRole || mode.id.startsWith("any-any-any-"),
  );
}
