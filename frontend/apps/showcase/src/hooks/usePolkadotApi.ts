import { useState, useEffect, useCallback } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { formatBalance } from "@polkadot/util";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import type { AccountInfo } from "@polkadot/types/interfaces";
import { lunesUtils } from "../config/lunes";

/**
 * Interface para retorno do hook usePolkadotApi
 */
export interface UsePolkadotApiReturn {
  /** Instância da API Polkadot */
  api: ApiPromise | null;
  /** Status de conexão com a API */
  isConnected: boolean;
  /** Status de carregamento */
  isLoading: boolean;
  /** Mensagem de erro, se houver */
  error: string | null;
  /** Função para conectar à API */
  connect: (network?: "testnet" | "mainnet") => Promise<void>;
  /** Função para desconectar da API */
  disconnect: () => Promise<void>;
  /** Função para obter saldo de uma conta */
  getBalance: (address: string) => Promise<string | null>;
  /** Função para obter saldo bruto de uma conta */
  getRawBalance: (address: string) => Promise<string | null>;
  /** Função para obter informações da chain */
  getChainInfo: () => Promise<{
    name: string;
    version: string;
    tokenSymbol: string;
    tokenDecimals: number;
  } | null>;
  /** Função para transferir tokens */
  transfer: (
    from: InjectedAccountWithMeta,
    to: string,
    amount: string,
    injector: any,
  ) => Promise<string | null>;
}

/**
 * Hook para integração com a API Polkadot
 * Fornece funcionalidades para conectar à blockchain e realizar operações
 *
 * @param defaultEndpoint - Endpoint padrão para conexão (opcional)
 * @returns {UsePolkadotApiReturn} Objeto com estado e funções da API
 */
export const usePolkadotApi = (
  defaultEndpoint: string = "wss://rpc.polkadot.io",
): UsePolkadotApiReturn => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Conecta à API da Rede Lunes
   */
  const connect = useCallback(
    async (network: "testnet" | "mainnet" = "testnet"): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // Usa o utilitário para obter o endpoint principal
        const endpoint = lunesUtils.getPrimaryEndpoint(network);

        console.log(`🔗 Conectando à Rede Lunes (${network}):`, endpoint);

        // Criar provider WebSocket
        const provider = new WsProvider(endpoint);

        // Criar instância da API
        const apiInstance = await ApiPromise.create({ provider });

        // Aguardar a API estar pronta
        await apiInstance.isReady;

        setApi(apiInstance);
        setIsConnected(true);

        console.log("✅ Conectado à Rede Lunes com sucesso!");
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao conectar à API";
        setError(errorMessage);
        console.error("❌ Erro ao conectar à Rede Lunes:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [defaultEndpoint],
  );

  /**
   * Função para desconectar da API
   */
  const disconnect = useCallback(async (): Promise<void> => {
    try {
      if (api) {
        await api.disconnect();
        setApi(null);
        setIsConnected(false);
        console.log("Desconectado da API Polkadot");
      }
    } catch (err) {
      console.error("Erro ao desconectar da API:", err);
    }
  }, [api]);

  /**
   * Função para obter saldo de uma conta
   */
  const getBalance = useCallback(
    async (address: string): Promise<string | null> => {
      if (!api || !isConnected) {
        setError("API não está conectada");
        return null;
      }

      try {
        const accountInfo = (await api.query.system.account(
          address,
        )) as AccountInfo;
        const freeBalance = accountInfo.data.free.toString();

        // Obter informações da chain para formatação
        const chainInfo = await getChainInfo();
        if (chainInfo) {
          formatBalance.setDefaults({
            decimals: chainInfo.tokenDecimals,
            unit: chainInfo.tokenSymbol,
          });
          return formatBalance(freeBalance, { withSi: true, withUnit: true });
        }

        return freeBalance;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao obter saldo";
        setError(errorMessage);
        console.error("Erro ao obter saldo:", err);
        return null;
      }
    },
    [api, isConnected],
  );

  /**
   * Função para obter saldo bruto (sem formatação) de uma conta
   */
  const getRawBalance = useCallback(
    async (address: string): Promise<string | null> => {
      if (!api || !isConnected) {
        return null;
      }

      try {
        const accountInfo = (await api.query.system.account(
          address,
        )) as AccountInfo;
        return accountInfo.data.free.toString();
      } catch (err) {
        console.error("Erro ao obter saldo bruto:", err);
        return null;
      }
    },
    [api, isConnected],
  );

  /**
   * Função para obter informações da chain
   */
  const getChainInfo = useCallback(async () => {
    if (!api || !isConnected) {
      return null;
    }

    try {
      const [chain, version, properties] = await Promise.all([
        api.rpc.system.chain(),
        api.rpc.system.version(),
        api.rpc.system.properties(),
      ]);

      const tokenSymbol = properties.tokenSymbol.unwrap()[0].toString();
      const tokenDecimals = properties.tokenDecimals.unwrap()[0].toNumber();

      return {
        name: chain.toString(),
        version: version.toString(),
        tokenSymbol,
        tokenDecimals,
      };
    } catch (err) {
      console.error("Erro ao obter informações da chain:", err);
      return null;
    }
  }, [api, isConnected]);

  /**
   * Função para transferir tokens
   */
  const transfer = useCallback(
    async (
      from: InjectedAccountWithMeta,
      to: string,
      amount: string,
      injector: any,
    ): Promise<string | null> => {
      if (!api || !isConnected) {
        setError("API não está conectada");
        return null;
      }

      if (!injector) {
        setError("Injector não disponível");
        return null;
      }

      try {
        setIsLoading(true);

        // Criar transação de transferência
        const transfer = api.tx.balances.transfer(to, amount);

        // Assinar e enviar transação
        const hash = await transfer.signAndSend(
          from.address,
          { signer: injector.signer },
          (result) => {
            console.log("Status da transação:", result.status.toString());

            if (result.status.isInBlock) {
              console.log(
                "Transação incluída no bloco:",
                result.status.asInBlock.toString(),
              );
            } else if (result.status.isFinalized) {
              console.log(
                "Transação finalizada:",
                result.status.asFinalized.toString(),
              );
            }
          },
        );

        return hash.toString();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao realizar transferência";
        setError(errorMessage);
        console.error("Erro na transferência:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [api, isConnected],
  );

  /**
   * Effect para limpeza quando o componente for desmontado
   */
  useEffect(() => {
    return () => {
      if (api) {
        api.disconnect().catch(console.error);
      }
    };
  }, [api]);

  return {
    api,
    isConnected,
    isLoading,
    error,
    connect,
    disconnect,
    getBalance,
    getRawBalance,
    getChainInfo,
    transfer,
  };
};

export default usePolkadotApi;
