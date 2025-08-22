import type { EnvironmentConfig } from "./types";

/**
 * Configuração para ambiente de produção
 * Conecta com mainnet e configurações otimizadas para produção
 */
export const prodConfig: EnvironmentConfig = {
  environment: "prod",
  defaultNetwork: "mainnet",

  networks: {
    local: {
      name: "Local Development",
      rpcEndpoint: "ws://127.0.0.1:9944",
      wsEndpoint: "ws://127.0.0.1:9944",
      explorerUrl: "http://localhost:3000",
      contracts: {
        launchpad: {
          address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        },
        lusdt: {
          address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        },
      },
      tokens: {
        native: {
          symbol: "LUNES",
          decimals: 12,
          icon: "/tokens/lunes.svg",
        },
        lusdt: {
          symbol: "LUSDT",
          decimals: 6,
          address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
          icon: "/tokens/lusdt.svg",
        },
      },
    },

    testnet: {
      name: "Lunes Testnet",
      rpcEndpoint: "wss://testnet-rpc.lunes.io",
      wsEndpoint: "wss://testnet-ws.lunes.io",
      explorerUrl: "https://testnet-explorer.lunes.io",
      contracts: {
        launchpad: {
          address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        },
        lusdt: {
          address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
        },
      },
      tokens: {
        native: {
          symbol: "LUNES",
          decimals: 12,
          icon: "/tokens/lunes.svg",
        },
        lusdt: {
          symbol: "LUSDT",
          decimals: 6,
          address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
          icon: "/tokens/lusdt.svg",
        },
      },
    },

    mainnet: {
      name: "Lunes Mainnet",
      rpcEndpoint: "wss://mainnet-rpc.lunes.io",
      wsEndpoint: "wss://mainnet-ws.lunes.io",
      explorerUrl: "https://explorer.lunes.io",
      contracts: {
        launchpad: {
          address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Endereço real do contrato em produção
        },
        lusdt: {
          address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", // Endereço real do LUSDT em produção
        },
      },
      tokens: {
        native: {
          symbol: "LUNES",
          decimals: 12,
          icon: "/tokens/lunes.svg",
        },
        lusdt: {
          symbol: "LUSDT",
          decimals: 6,
          address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
          icon: "/tokens/lusdt.svg",
        },
      },
    },
  },

  features: {
    realTimeEvents: true,
    autoDistribution: true,
    launchpool: true,
    raffle: true,
    multiCurrency: true,
  },

  ui: {
    theme: "light",
    showTestnetWarning: false, // Não mostrar aviso em produção
    enableDevTools: false, // Desabilitado em produção
  },

  api: {
    baseUrl: "https://api.lunes.io/api",
    timeout: 20000, // Timeout maior para produção
    retryAttempts: 5, // Mais tentativas em produção
  },
};
