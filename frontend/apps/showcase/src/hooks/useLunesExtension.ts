import { useState, useEffect, useCallback } from "react";
import type {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";

/**
 * Interface que define o retorno do hook useLunesExtension
 */
export interface UseLunesExtensionReturn {
  /** Indica se a extensão está pronta para uso */
  isReady: boolean;
  /** Lista de contas disponíveis na extensão */
  accounts: InjectedAccountWithMeta[] | null;
  /** Conta atualmente selecionada */
  selectedAccount: InjectedAccountWithMeta | null;
  /** Injector da conta selecionada para assinatura de transações */
  injector: InjectedExtension | null;
  /** Erro que pode ocorrer durante a conexão */
  error: string | null;
  /** Estado de carregamento */
  isLoading: boolean;
  /** Função para conectar à extensão */
  connect: () => Promise<void>;
  /** Função para desconectar da extensão */
  disconnect: () => void;
  /** Função para selecionar uma conta específica */
  selectAccount: (account: InjectedAccountWithMeta) => void;
  /** Indica se há extensões disponíveis */
  hasExtensions: boolean;
}

/**
 * Utilitário para aguardar o documento estar pronto
 */
const documentReadyPromise = <T>(fn: () => T): Promise<T> => {
  return new Promise((resolve) => {
    if (document.readyState !== "loading") {
      resolve(fn());
    } else {
      document.addEventListener("DOMContentLoaded", () => resolve(fn()));
    }
  });
};

/**
 * Hook customizado para integração com extensões de carteira Polkadot compatíveis com a Rede Lunes
 *
 * Suporta múltiplas extensões como:
 * - Polkadot.js Extension
 * - SubWallet
 * - Talisman
 * - Nova Wallet
 *
 * Conecta especificamente à Rede Lunes (solochain baseada em Substrate)
 *
 * @returns {UseLunesExtensionReturn} Objeto com estado e funções da extensão
 */
export const useLunesExtension = (): UseLunesExtensionReturn => {
  const [isReady, setIsReady] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[] | null>(
    null,
  );
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);
  const [injector, setInjector] = useState<InjectedExtension | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [extensions, setExtensions] = useState<InjectedExtension[] | null>(
    null,
  );
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  /**
   * Função para conectar às extensões de carteira disponíveis
   */
  const connect = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      // Importação dinâmica para evitar problemas de SSR
      const extensionDapp = await import("@polkadot/extension-dapp");
      const { web3Enable, web3AccountsSubscribe } = extensionDapp;

      // Aguarda o documento estar pronto e habilita as extensões
      const injectedPromise = documentReadyPromise(() =>
        web3Enable("Launchpad Lunes"),
      );

      const availableExtensions = await injectedPromise;
      setExtensions(availableExtensions);

      if (availableExtensions.length === 0) {
        throw new Error(
          "Nenhuma extensão de carteira Polkadot encontrada. " +
            "Por favor, instale uma extensão como Polkadot.js, SubWallet ou Talisman.",
        );
      }

      // Subscreve às mudanças de contas
      const unsubscribeFn = await web3AccountsSubscribe((injectedAccounts) => {
        setAccounts(injectedAccounts);

        // Se não há conta selecionada e há contas disponíveis, seleciona a primeira
        if (!selectedAccount && injectedAccounts.length > 0) {
          setSelectedAccount(injectedAccounts[0]);
        }

        setIsReady(true);
      });

      setUnsubscribe(() => unsubscribeFn);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro desconhecido ao conectar carteira";
      setError(errorMessage);
      console.error(
        "Erro ao conectar extensão compatível com Rede Lunes:",
        err,
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedAccount]);

  /**
   * Função para desconectar da extensão
   */
  const disconnect = useCallback((): void => {
    if (unsubscribe) {
      unsubscribe();
      setUnsubscribe(null);
    }

    setAccounts(null);
    setSelectedAccount(null);
    setInjector(null);
    setExtensions(null);
    setIsReady(false);
    setError(null);
  }, [unsubscribe]);

  /**
   * Função para selecionar uma conta específica
   */
  const selectAccount = useCallback(
    (account: InjectedAccountWithMeta): void => {
      setSelectedAccount(account);
    },
    [],
  );

  /**
   * Effect para obter o injector da conta selecionada
   */
  useEffect(() => {
    const getInjector = async (): Promise<void> => {
      if (!selectedAccount?.meta.source) {
        setInjector(null);
        return;
      }

      try {
        const { web3FromSource } = await import("@polkadot/extension-dapp");
        const accountInjector = await web3FromSource(
          selectedAccount.meta.source,
        );
        setInjector(accountInjector);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro ao obter injector da conta";
        setError(errorMessage);
        console.error("Erro ao obter injector:", err);
      }
    };

    getInjector();
  }, [selectedAccount]);

  /**
   * Effect de limpeza para desinscrever quando o componente for desmontado
   */
  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

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
    hasExtensions: extensions !== null && extensions.length > 0,
  };
};

export default useLunesExtension;
