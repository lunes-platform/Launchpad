import { useState, useEffect, useCallback } from "react";
import type {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import type { UseLunesExtensionReturn } from "./useLunesExtension";

/**
 * Hook mockado para simular a extensão da Lunes em ambiente de desenvolvimento
 * Fornece dados simulados para permitir o teste da aplicação sem extensão real
 */
export const useLunesExtensionMock = (): UseLunesExtensionReturn => {
  const [isReady, setIsReady] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [injector, setInjector] = useState<InjectedExtension | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Contas simuladas para diferentes tipos de usuário
  const mockAccounts: InjectedAccountWithMeta[] = [
    {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Usuário padrão
      meta: {
        genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        name: "Investidor Padrão",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
    {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKissuer", // Emissor adicional
      meta: {
        genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        name: "Emissor Secundário",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
    {
      address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJMcreator", // Criador
      meta: {
        genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        name: "Criador de Projetos",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
    {
      address: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYmanager", // Gerente
      meta: {
        genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        name: "Gerente de Projetos",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
    {
      address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694vip", // Usuário VIP
      meta: {
        genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        name: "Investidor VIP",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
    {
      address: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYverified", // Usuário verificado
      meta: {
        genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        name: "Investidor Verificado",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
    {
      address: "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctadmin", // Admin
      meta: {
        genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        name: "Administrador",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
    {
      address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutproject", // Project Issuer
      meta: {
        genesisHash: "0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3",
        name: "Emissor de Projetos",
        source: "polkadot-js",
      },
      type: "sr25519",
    },
  ];

  // Mock do injector
  const mockInjector: InjectedExtension = {
    name: "polkadot-js",
    version: "0.44.1",
    accounts: {
      get: async () => mockAccounts,
      subscribe: () => () => {},
    },
    signer: {} as any,
  };

  /**
   * Simula a conexão com a extensão
   */
  const connect = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Simula delay de conexão
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAccounts(mockAccounts);
      setSelectedAccount(mockAccounts[4]); // Seleciona o Emissor de Projetos por padrão
      setInjector(mockInjector);
      setIsReady(true);

      console.log('🔗 Extensão mockada conectada com sucesso');
      console.log('👥 Contas disponíveis:', mockAccounts.map(acc => ({ 
        name: acc.meta.name, 
        address: acc.address.slice(0, 8) + '...' 
      })));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao conectar carteira mockada";
      setError(errorMessage);
      console.error("Erro na conexão mockada:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Simula a desconexão
   */
  const disconnect = useCallback((): void => {
    setAccounts(null);
    setSelectedAccount(null);
    setInjector(null);
    setIsReady(false);
    setError(null);
    console.log('🔌 Extensão mockada desconectada');
  }, []);

  /**
   * Seleciona uma conta específica
   */
  const selectAccount = useCallback((account: InjectedAccountWithMeta): void => {
    setSelectedAccount(account);
    console.log('👤 Conta selecionada:', { 
      name: account.meta.name, 
      address: account.address.slice(0, 8) + '...' 
    });
  }, []);

  // Auto-conecta quando o hook é inicializado
  useEffect(() => {
    const autoConnect = async () => {
      await connect();
    };
    autoConnect();
  }, [connect]);

  return {
    isReady,
    accounts,
    selectedAccount,
    injector,
    error,
    isLoading,
    connect,
    disconnect,
    selectAccount,
    hasExtensions: true, // Sempre true no mock
  };
};

export default useLunesExtensionMock;