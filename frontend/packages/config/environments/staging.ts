import type { EnvironmentConfig } from "./types";

/**
 * Configuração para ambiente de staging
 * Conecta com testnet para testes de integração
 */
export const stagingConfig: EnvironmentConfig = {
  environment: "staging",
  defaultNetwork: "testnet",

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
          address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Endereço staging testnet
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
  },

  features: {
    realTimeEvents: true,
    autoDistribution: true,
    launchpool: true,
    raffle: true,
    multiCurrency: true,
  },

  ui: {
    theme: "auto",
    showTestnetWarning: true,
    enableDevTools: false, // Desabilitado em staging
  },

  api: {
    baseUrl: "https://staging-api.launchpad.lunes.io/api",
    timeout: 15000,
    retryAttempts: 3,
  },
};
