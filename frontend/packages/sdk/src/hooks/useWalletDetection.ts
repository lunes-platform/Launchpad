import { useState, useEffect, useCallback } from "react";

/**
 * Informações de uma carteira detectada
 */
export interface WalletInfo {
  name: string;
  version: string;
  installed: boolean;
  enabled: boolean;
  accounts: WalletAccount[];
  icon?: string;
  website?: string;
}

/**
 * Conta de uma carteira
 */
export interface WalletAccount {
  address: string;
  name?: string;
  type?: string;
  source: string;
}

/**
 * Estado da detecção de carteiras
 */
export interface WalletDetectionState {
  loading: boolean;
  error?: string;
  wallets: WalletInfo[];
  selectedWallet?: WalletInfo;
  selectedAccount?: WalletAccount;
  isConnected: boolean;
}

/**
 * Configuração do hook
 */
export interface UseWalletDetectionConfig {
  autoConnect?: boolean;
  preferredWallet?: string;
  pollInterval?: number;
}

/**
 * Hook para detecção e gerenciamento de carteiras Polkadot
 */
export function useWalletDetection(config: UseWalletDetectionConfig = {}) {
  const { autoConnect = false, preferredWallet, pollInterval = 1000 } = config;

  const [state, setState] = useState<WalletDetectionState>({
    loading: true,
    wallets: [],
    isConnected: false,
  });

  /**
   * Lista de carteiras conhecidas do ecossistema Polkadot
   */
  const knownWallets = [
    {
      name: "polkadot-js",
      displayName: "Polkadot{.js}",
      website: "https://polkadot.js.org/extension/",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNFNjAwN0EiLz4KPHBhdGggZD0iTTMyIDEyQzQwLjgzNjYgMTIgNDggMTkuMTYzNCA0OCAyOEM0OCAzNi44MzY2IDQwLjgzNjYgNDQgMzIgNDRDMjMuMTYzNCA0NCAxNiAzNi44MzY2IDE2IDI4QzE2IDE5LjE2MzQgMjMuMTYzNCAxMiAzMiAxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    },
    {
      name: "subwallet-js",
      displayName: "SubWallet",
      website: "https://subwallet.app/",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMwMDRCRkYiLz4KPHBhdGggZD0iTTMyIDEyQzQwLjgzNjYgMTIgNDggMTkuMTYzNCA0OCAyOEM0OCAzNi44MzY2IDQwLjgzNjYgNDQgMzIgNDRDMjMuMTYzNCA0NCAxNiAzNi44MzY2IDE2IDI4QzE2IDE5LjE2MzQgMjMuMTYzNCAxMiAzMiAxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    },
    {
      name: "talisman",
      displayName: "Talisman",
      website: "https://talisman.xyz/",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRjAwNzciLz4KPHBhdGggZD0iTTMyIDEyQzQwLjgzNjYgMTIgNDggMTkuMTYzNCA0OCAyOEM0OCAzNi44MzY2IDQwLjgzNjYgNDQgMzIgNDRDMjMuMTYzNCA0NCAxNiAzNi44MzY2IDE2IDI4QzE2IDE5LjE2MzQgMjMuMTYzNCAxMiAzMiAxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    },
    {
      name: "nova-wallet",
      displayName: "Nova Wallet",
      website: "https://novawallet.io/",
      icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiMwMEQ0QUEiLz4KPHBhdGggZD0iTTMyIDEyQzQwLjgzNjYgMTIgNDggMTkuMTYzNCA0OCAyOEM0OCAzNi44MzY2IDQwLjgzNjYgNDQgMzIgNDRDMjMuMTYzNCA0NCAxNiAzNi44MzY2IDE2IDI4QzE2IDE5LjE2MzQgMjMuMTYzNCAxMiAzMiAxMloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
    },
  ];

  /**
   * Detecta carteiras instaladas
   */
  const detectWallets = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    try {
      // Simula detecção de carteiras
      // Em implementação real, usaria window.injectedWeb3
      const detectedWallets: WalletInfo[] = [];

      // Simula algumas carteiras instaladas
      const mockInstalledWallets = ["polkadot-js", "subwallet-js"];

      for (const knownWallet of knownWallets) {
        const isInstalled = mockInstalledWallets.includes(knownWallet.name);

        const walletInfo: WalletInfo = {
          name: knownWallet.name,
          version: isInstalled ? "1.0.0" : "N/A",
          installed: isInstalled,
          enabled: false,
          accounts: [],
          icon: knownWallet.icon,
          website: knownWallet.website,
        };

        // Se instalada, simula algumas contas
        if (isInstalled) {
          walletInfo.accounts = [
            {
              address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
              name: "Account 1",
              type: "sr25519",
              source: knownWallet.name,
            },
            {
              address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
              name: "Account 2",
              type: "sr25519",
              source: knownWallet.name,
            },
          ];
          walletInfo.enabled = true;
        }

        detectedWallets.push(walletInfo);
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        wallets: detectedWallets,
      }));

      // Auto-conecta se configurado
      if (autoConnect && detectedWallets.length > 0) {
        const walletToConnect = preferredWallet
          ? detectedWallets.find(
              (w) => w.name === preferredWallet && w.installed,
            )
          : detectedWallets.find((w) => w.installed);

        if (walletToConnect) {
          await connectWallet(walletToConnect.name);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao detectar carteiras";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, [autoConnect, preferredWallet]);

  /**
   * Conecta a uma carteira específica
   */
  const connectWallet = useCallback(
    async (walletName: string) => {
      setState((prev) => ({ ...prev, loading: true, error: undefined }));

      try {
        const wallet = state.wallets.find((w) => w.name === walletName);
        if (!wallet) {
          throw new Error(`Carteira ${walletName} não encontrada`);
        }

        if (!wallet.installed) {
          throw new Error(`Carteira ${walletName} não está instalada`);
        }

        // Simula processo de conexão
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simula habilitação da carteira
        const updatedWallets = state.wallets.map((w) =>
          w.name === walletName ? { ...w, enabled: true } : w,
        );

        setState((prev) => ({
          ...prev,
          loading: false,
          wallets: updatedWallets,
          selectedWallet: wallet,
          selectedAccount: wallet.accounts[0],
          isConnected: true,
        }));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao conectar carteira";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    },
    [state.wallets],
  );

  /**
   * Desconecta a carteira atual
   */
  const disconnectWallet = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedWallet: undefined,
      selectedAccount: undefined,
      isConnected: false,
    }));
  }, []);

  /**
   * Seleciona uma conta específica
   */
  const selectAccount = useCallback((account: WalletAccount) => {
    setState((prev) => ({
      ...prev,
      selectedAccount: account,
    }));
  }, []);

  /**
   * Obtém contas de uma carteira específica
   */
  const getWalletAccounts = useCallback(
    async (walletName: string): Promise<WalletAccount[]> => {
      const wallet = state.wallets.find((w) => w.name === walletName);
      if (!wallet || !wallet.installed) {
        return [];
      }

      // Em implementação real, faria a chamada para a extensão
      return wallet.accounts;
    },
    [state.wallets],
  );

  /**
   * Verifica se uma carteira específica está instalada
   */
  const isWalletInstalled = useCallback(
    (walletName: string): boolean => {
      const wallet = state.wallets.find((w) => w.name === walletName);
      return wallet?.installed || false;
    },
    [state.wallets],
  );

  /**
   * Obtém a URL de instalação de uma carteira
   */
  const getWalletInstallUrl = useCallback(
    (walletName: string): string | undefined => {
      const knownWallet = knownWallets.find((w) => w.name === walletName);
      return knownWallet?.website;
    },
    [],
  );

  /**
   * Obtém estatísticas das carteiras
   */
  const getWalletStats = useCallback(() => {
    const installed = state.wallets.filter((w) => w.installed).length;
    const enabled = state.wallets.filter((w) => w.enabled).length;
    const totalAccounts = state.wallets.reduce(
      (sum, w) => sum + w.accounts.length,
      0,
    );

    return {
      total: state.wallets.length,
      installed,
      enabled,
      totalAccounts,
      hasConnection: state.isConnected,
    };
  }, [state.wallets, state.isConnected]);

  // Efeito para detecção inicial
  useEffect(() => {
    detectWallets();
  }, [detectWallets]);

  // Efeito para polling de carteiras (detecta instalações/desinstalações)
  useEffect(() => {
    if (pollInterval > 0) {
      const interval = setInterval(detectWallets, pollInterval);
      return () => clearInterval(interval);
    }
  }, [detectWallets, pollInterval]);

  return {
    // Estado
    ...state,

    // Ações
    detectWallets,
    connectWallet,
    disconnectWallet,
    selectAccount,

    // Utilitários
    getWalletAccounts,
    isWalletInstalled,
    getWalletInstallUrl,
    getWalletStats,

    // Dados computados
    installedWallets: state.wallets.filter((w) => w.installed),
    enabledWallets: state.wallets.filter((w) => w.enabled),
    availableAccounts: state.selectedWallet?.accounts || [],
    hasWallets: state.wallets.length > 0,
    hasInstalledWallets: state.wallets.some((w) => w.installed),
  };
}
