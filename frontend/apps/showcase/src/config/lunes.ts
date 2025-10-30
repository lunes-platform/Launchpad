/**
 * Configurações específicas da Rede Lunes
 *
 * Este arquivo centraliza todas as configurações relacionadas à Rede Lunes,
 * incluindo endpoints, parâmetros de rede e configurações de desenvolvimento.
 */

/**
 * Endpoints WebSocket da Rede Lunes
 */
export const LUNES_ENDPOINTS = {
  /** Rede de teste da Lunes */
  testnet: "wss://ws-test.lunes.io",

  /** Redes principais da Lunes */
  mainnet: {
    primary: "wss://ws.lunes.io",
    backup1: "wss://ws-lunes-main-01.lunes.io",
    backup2: "wss://ws-lunes-main-02.lunes.io",
    archive: "wss://ws-archive.lunes.io",
  },
} as const;

/**
 * Configurações de rede da Lunes
 */
export const LUNES_NETWORK_CONFIG = {
  /** Nome da rede */
  name: "Lunes Network",

  /** Símbolo do token nativo */
  tokenSymbol: "LUNES",

  /** Decimais do token nativo (padrão Substrate) */
  tokenDecimals: 12,

  /** Prefixo SS58 para endereços da Rede Lunes */
  ss58Format: 42, // Padrão Substrate genérico, pode ser customizado

  /** Tempo de bloco em milissegundos */
  blockTime: 6000, // 6 segundos (padrão Substrate)

  /** Configurações de existential deposit */
  existentialDeposit: "10000000000", // 0.01 LUNES (em unidades menores)
} as const;

/**
 * Configurações de desenvolvimento
 */
export const LUNES_DEV_CONFIG = {
  /** Usar rede de teste por padrão em desenvolvimento */
  defaultNetwork: import.meta.env.DEV ? "testnet" : "mainnet",

  /** Timeout para conexões WebSocket */
  connectionTimeout: 30000, // 30 segundos

  /** Intervalo de reconexão automática */
  reconnectInterval: 5000, // 5 segundos

  /** Máximo de tentativas de reconexão */
  maxReconnectAttempts: 5,

  /** Habilitar logs detalhados */
  enableDetailedLogs: import.meta.env.DEV,
} as const;

/**
 * Configurações de carteiras suportadas
 */
export const LUNES_WALLET_CONFIG = {
  /** Carteiras suportadas na Rede Lunes */
  supportedWallets: ["polkadot-js", "subwallet-js", "talisman", "nova-wallet"],

  /** Configurações específicas por carteira */
  walletSettings: {
    "polkadot-js": {
      name: "Polkadot.js Extension",
      icon: "/icons/polkadot-js.svg",
      downloadUrl: "https://polkadot.js.org/extension/",
    },
    "subwallet-js": {
      name: "SubWallet",
      icon: "/icons/subwallet.svg",
      downloadUrl: "https://subwallet.app/",
    },
    talisman: {
      name: "Talisman",
      icon: "/icons/talisman.svg",
      downloadUrl: "https://talisman.xyz/",
    },
    "nova-wallet": {
      name: "Nova Wallet",
      icon: "/icons/nova-wallet.svg",
      downloadUrl: "https://novawallet.io/",
    },
  },
} as const;

/**
 * Configurações de API e endpoints externos
 */
export const LUNES_API_CONFIG = {
  /** URL base da API do backend */
  backendUrl: import.meta.env.VITE_LUNES_API_URL || "http://localhost:3001/api/v1",

  /** Endpoints específicos da Rede Lunes */
  endpoints: {
    projects: "/lunes/projects",
    investments: "/lunes/investments",
    staking: "/lunes/staking",
    governance: "/lunes/governance",
    treasury: "/lunes/treasury",
  },

  /** Configurações de cache */
  cache: {
    /** Tempo de cache para dados de projetos (5 minutos) */
    projectsStaleTime: 5 * 60 * 1000,

    /** Tempo de cache para dados do usuário (1 minuto) */
    userDataStaleTime: 1 * 60 * 1000,

    /** Tempo de cache para preços (30 segundos) */
    pricesStaleTime: 30 * 1000,
  },
} as const;

/**
 * Configurações de transações
 */
export const LUNES_TRANSACTION_CONFIG = {
  /** Taxa padrão para transações */
  defaultTip: "0",

  /** Configurações de gas/fees */
  fees: {
    /** Taxa mínima para transações */
    minimumFee: "1000000000", // 0.001 LUNES

    /** Multiplicador de taxa para transações prioritárias */
    priorityMultiplier: 1.5,
  },

  /** Timeout para confirmação de transações */
  confirmationTimeout: 60000, // 1 minuto

  /** Número de confirmações necessárias */
  requiredConfirmations: 1,
} as const;

/**
 * Utilitários para trabalhar com a configuração da Rede Lunes
 */
export const lunesUtils = {
  /**
   * Obtém o endpoint principal baseado na rede
   */
  getPrimaryEndpoint: (network: "testnet" | "mainnet" = "testnet"): string => {
    return network === "testnet"
      ? LUNES_ENDPOINTS.testnet
      : LUNES_ENDPOINTS.mainnet.primary;
  },

  /**
   * Obtém todos os endpoints de uma rede
   */
  getAllEndpoints: (network: "testnet" | "mainnet" = "testnet"): string[] => {
    if (network === "testnet") {
      return [LUNES_ENDPOINTS.testnet];
    }

    return [
      LUNES_ENDPOINTS.mainnet.primary,
      LUNES_ENDPOINTS.mainnet.backup1,
      LUNES_ENDPOINTS.mainnet.backup2,
    ];
  },

  /**
   * Formata um valor em LUNES para exibição
   */
  formatLunesAmount: (
    amount: string | number,
    decimals: number = 4,
  ): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    const formatted = (
      numAmount / Math.pow(10, LUNES_NETWORK_CONFIG.tokenDecimals)
    ).toFixed(decimals);
    return `${formatted} ${LUNES_NETWORK_CONFIG.tokenSymbol}`;
  },

  /**
   * Converte um valor em LUNES para unidades menores
   */
  toLunesUnits: (amount: string | number): string => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return (
      numAmount * Math.pow(10, LUNES_NETWORK_CONFIG.tokenDecimals)
    ).toString();
  },

  /**
   * Converte unidades menores para LUNES
   */
  fromLunesUnits: (amount: string | number): number => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return numAmount / Math.pow(10, LUNES_NETWORK_CONFIG.tokenDecimals);
  },

  /**
   * Valida se um endpoint é válido da Rede Lunes
   */
  isValidLunesEndpoint: (endpoint: string): boolean => {
    const allEndpoints: string[] = [
      LUNES_ENDPOINTS.testnet,
      ...Object.values(LUNES_ENDPOINTS.mainnet),
    ];
    return allEndpoints.includes(endpoint);
  },
};

/**
 * Exportação padrão com todas as configurações
 */
export default {
  endpoints: LUNES_ENDPOINTS,
  network: LUNES_NETWORK_CONFIG,
  dev: LUNES_DEV_CONFIG,
  wallets: LUNES_WALLET_CONFIG,
  api: LUNES_API_CONFIG,
  transactions: LUNES_TRANSACTION_CONFIG,
  utils: lunesUtils,
};
