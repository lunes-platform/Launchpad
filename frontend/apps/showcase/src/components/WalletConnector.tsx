import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";

/**
 * Interface para as props do WalletConnector
 */
interface WalletConnectorProps {
  /** Classe CSS adicional para customização */
  className?: string;
  /** Variante do botão */
  variant?: "primary" | "secondary" | "outline";
  /** Tamanho do botão */
  size?: "sm" | "md" | "lg";
}

/**
 * Componente para conectar e gerenciar carteiras compatíveis com a Rede Lunes
 *
 * Este componente fornece uma interface completa para:
 * - Conectar à extensão de carteira (Polkadot.js, SubWallet, etc.)
 * - Exibir contas disponíveis na Rede Lunes
 * - Selecionar conta ativa
 * - Desconectar da carteira
 * - Exibir erros de conexão
 *
 * @param {WalletConnectorProps} props - Props do componente
 * @returns {JSX.Element} Componente de conexão de carteira
 */
export const WalletConnector: React.FC<WalletConnectorProps> = ({
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const {
    isReady,
    accounts,
    selectedAccount,
    error,
    isLoading,
    connect,
    disconnect,
    selectAccount,
    hasExtensions,
  } = useWallet();

  const [showAccountSelector, setShowAccountSelector] = useState(false);

  /**
   * Classes CSS baseadas na variante do botão
   */
  const getVariantClasses = () => {
    const baseClasses =
      "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    switch (variant) {
      case "primary":
        return `${baseClasses} bg-roxo text-white hover:bg-roxo-600 focus:ring-roxo-500`;
      case "secondary":
        return `${baseClasses} bg-verde text-white hover:bg-verde-600 focus:ring-verde-500`;
      case "outline":
        return `${baseClasses} border-2 border-roxo text-roxo hover:bg-roxo hover:text-white focus:ring-roxo-500`;
      default:
        return `${baseClasses} bg-roxo text-white hover:bg-roxo-600 focus:ring-roxo-500`;
    }
  };

  /**
   * Classes CSS baseadas no tamanho do botão
   */
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1.5 text-sm";
      case "md":
        return "px-4 py-2 text-base";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  /**
   * Formata o endereço da conta para exibição
   */
  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  /**
   * Manipula a seleção de uma conta
   */
  const handleAccountSelect = (account: InjectedAccountWithMeta) => {
    selectAccount(account);
    setShowAccountSelector(false);
  };

  /**
   * Manipula a conexão da carteira
   */
  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      console.error("Erro ao conectar carteira:", err);
    }
  };

  /**
   * Manipula a desconexão da carteira
   */
  const handleDisconnect = () => {
    disconnect();
    setShowAccountSelector(false);
  };

  // Exibe erro se houver
  if (error) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Erro de Conexão
            </h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="text-sm bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Se não está conectado, exibe botão de conexão
  if (!isReady) {
    return (
      <button
        onClick={handleConnect}
        disabled={isLoading}
        className={`${getVariantClasses()} ${getSizeClasses()} ${className} disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Conectando...</span>
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span>Conectar Carteira</span>
          </>
        )}
      </button>
    );
  }

  // Se está conectado, exibe informações da conta
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-3">
        {/* Informações da conta selecionada */}
        <div className="flex items-center space-x-2 bg-white dark:bg-grafite-800 border border-gray-200 dark:border-grafite-600 rounded-lg px-3 py-2 shadow-sm transition-colors">
          <div className="w-2 h-2 bg-verde rounded-full"></div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-grafite">
              {selectedAccount?.meta.name || "Conta Sem Nome"}
            </span>
            <span className="text-xs text-gray-500 dark:text-grafite-400">
              {selectedAccount ? formatAddress(selectedAccount.address) : ""}
            </span>
          </div>
        </div>

        {/* Botão para trocar conta (se houver múltiplas contas) */}
        {accounts && accounts.length > 1 && (
          <button
            onClick={() => setShowAccountSelector(!showAccountSelector)}
            className="p-2 text-gray-400 dark:text-grafite-400 hover:text-grafite dark:hover:text-grafite-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-grafite-700"
            title="Trocar conta"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l4-4 4 4m0 6l-4 4-4-4"
              />
            </svg>
          </button>
        )}

        {/* Botão de desconectar */}
        <button
          onClick={handleDisconnect}
          className="p-2 text-gray-400 dark:text-grafite-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-grafite-700"
          title="Desconectar"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

      {/* Seletor de contas */}
      {showAccountSelector && accounts && accounts.length > 1 && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-grafite-800 border border-gray-200 dark:border-grafite-600 rounded-lg shadow-lg z-50 transition-colors">
          <div className="p-3 border-b border-gray-200 dark:border-grafite-600">
            <h3 className="text-sm font-medium text-grafite dark:text-grafite-50">
              Selecionar Conta
            </h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {accounts.map((account) => (
              <button
                key={account.address}
                onClick={() => handleAccountSelect(account)}
                className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-grafite-700 transition-colors flex items-center space-x-3 ${
                  selectedAccount?.address === account.address
                    ? "bg-roxo-50 dark:bg-roxo-900/20 border-r-2 border-roxo"
                    : ""
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    selectedAccount?.address === account.address
                      ? "bg-roxo"
                      : "bg-gray-300"
                  }`}
                ></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-grafite">
                    {account.meta.name || "Conta Sem Nome"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatAddress(account.address)}
                  </div>
                  {account.meta.source && (
                    <div className="text-xs text-roxo-600 capitalize">
                      {account.meta.source}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
