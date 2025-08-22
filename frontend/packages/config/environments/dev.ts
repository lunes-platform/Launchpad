import type { EnvironmentConfig } from "./types";

/**
 * Configuração para ambiente de desenvolvimento
 * Conecta com nó local e contratos de teste
 */
export const devConfig: EnvironmentConfig = {
  environment: "dev",
  defaultNetwork: "local",

  networks: {
    local: {
      name: "Local Development",
      rpcEndpoint: "ws://127.0.0.1:9944",
      wsEndpoint: "ws://127.0.0.1:9944",
      explorerUrl: "http://localhost:3000", // Polkadot.js Apps local
      contracts: {
        launchpad: {
          address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Endereço de desenvolvimento
        },
        lusdt: {
          address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", // Token PSP22 de teste
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
          address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Endereço testnet
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
          address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Endereço mainnet
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
    enableDevTools: true,
  },

  api: {
    baseUrl: "http://localhost:3001/api",
    timeout: 10000,
    retryAttempts: 3,
  },
};
