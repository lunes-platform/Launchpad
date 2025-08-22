import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useLunesExtension } from "../hooks/useLunesExtension";
import { useLunesExtensionMock } from "../hooks/useLunesExtensionMock";
import type { UseLunesExtensionReturn } from "../hooks/useLunesExtension";

// Declaração de tipo para window.injectedWeb3
declare global {
  interface Window {
    injectedWeb3?: any;
  }
}

// Determina se deve usar o mock baseado no ambiente
const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
const useMockWallet = isDevelopment && !window.injectedWeb3;

/**
 * Interface para as props do WalletProvider
 */
interface WalletProviderProps {
  children: ReactNode;
}

/**
 * Contexto para gerenciar o estado da carteira da Rede Lunes globalmente
 */
const WalletContext = createContext<UseLunesExtensionReturn | undefined>(
  undefined,
);

/**
 * Provider do contexto de carteira que encapsula a lógica do usePolkadotExtension
 * para conexão com a Rede Lunes
 *
 * Este provider deve ser colocado no nível raiz da aplicação para que todos os
 * componentes filhos tenham acesso ao estado da carteira da Rede Lunes.
 *
 * @param {WalletProviderProps} props - Props do provider
 * @returns {JSX.Element} Provider do contexto
 */
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // Usa o hook mockado em desenvolvimento quando não há extensão disponível
  const walletState = useMockWallet ? useLunesExtensionMock() : useLunesExtension();
  
  console.log('🏦 WalletProvider:', { 
    useMockWallet, 
    isDevelopment, 
    hasInjectedWeb3: !!window.injectedWeb3,
    isReady: walletState.isReady,
    selectedAccount: walletState.selectedAccount?.meta.name
  });

  return (
    <WalletContext.Provider value={walletState}>
      {children}
    </WalletContext.Provider>
  );
};

/**
 * Hook customizado para acessar o contexto da carteira da Rede Lunes
 *
 * Este hook deve ser usado em componentes que precisam acessar o estado
 * da carteira ou executar ações relacionadas à carteira na Rede Lunes.
 *
 * @throws {Error} Lança erro se usado fora do WalletProvider
 * @returns {UsePolkadotExtensionReturn} Estado e funções da carteira
 *
 * @example
 * ```tsx
 * const WalletButton = () => {
 *   const { isReady, connect, disconnect, selectedAccount } = useWallet();
 *
 *   return (
 *     <button onClick={isReady ? disconnect : connect}>
 *       {isReady ? `Desconectar ${selectedAccount?.meta.name}` : 'Conectar Carteira'}
 *     </button>
 *   );
 * };
 * ```
 */
export const useWallet = (): UseLunesExtensionReturn => {
  const context = useContext(WalletContext);

  if (context === undefined) {
    throw new Error(
      "useWallet deve ser usado dentro de um WalletProvider. " +
        "Certifique-se de que o componente está envolvido pelo WalletProvider.",
    );
  }

  return context;
};

export default WalletContext;
