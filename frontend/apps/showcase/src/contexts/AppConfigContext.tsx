import { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
// Importações temporárias simplificadas
type Environment = "dev" | "staging" | "prod";
type Network = "local" | "testnet" | "mainnet";
type UserRole = "investor" | "developer" | "admin";
type WalletState = "readonly" | "signed" | "disconnected";
type OperationalState = "normal" | "paused" | "maintenance";
type PaymentCurrency = "LUNES" | "LUSDT";

interface ComplianceStatus {
  kycRequired: boolean;
  kycCompleted: boolean;
  whitelistRequired: boolean;
  whitelisted: boolean;
}

interface AppState {
  environment: Environment;
  network: Network;
  userRole: UserRole;
  walletState: WalletState;
  operationalState: OperationalState;
  compliance: ComplianceStatus;
  selectedCurrency: PaymentCurrency;
  connectedAccount?: string;
}

interface EnvironmentConfig {
  environment: Environment;
  defaultNetwork: Network;
  // Outras propriedades podem ser adicionadas conforme necessário
}

// Configuração temporária
const getCurrentEnvironment = (): Environment => "dev";
const currentConfig: EnvironmentConfig = {
  environment: "dev",
  defaultNetwork: "local",
};

/**
 * Ações disponíveis para o reducer de configuração
 */
type AppConfigAction =
  | { type: "SET_ENVIRONMENT"; payload: Environment }
  | { type: "SET_NETWORK"; payload: Network }
  | { type: "SET_USER_ROLE"; payload: UserRole }
  | { type: "SET_WALLET_STATE"; payload: WalletState }
  | { type: "SET_OPERATIONAL_STATE"; payload: OperationalState }
  | { type: "SET_COMPLIANCE"; payload: ComplianceStatus }
  | { type: "SET_CURRENCY"; payload: PaymentCurrency }
  | { type: "SET_CONNECTED_ACCOUNT"; payload: string | undefined }
  | { type: "RESET_CONFIG" };

/**
 * Interface do contexto de configuração
 */
interface AppConfigContextType {
  // Estado atual
  state: AppState;
  config: EnvironmentConfig;

  // Ações
  setEnvironment: (env: Environment) => void;
  setNetwork: (network: Network) => void;
  setUserRole: (role: UserRole) => void;
  setWalletState: (state: WalletState) => void;
  setOperationalState: (state: OperationalState) => void;
  setCompliance: (compliance: ComplianceStatus) => void;
  setCurrency: (currency: PaymentCurrency) => void;
  setConnectedAccount: (account: string | undefined) => void;
  resetConfig: () => void;

  // Utilitários
  isMainnet: boolean;
  isTestnet: boolean;
  isLocal: boolean;
  canSign: boolean;
  isAdmin: boolean;
  isDeveloper: boolean;
  isInvestor: boolean;
  isOperational: boolean;
  isPaused: boolean;
  isInMaintenance: boolean;
}

/**
 * Estado inicial da aplicação
 */
const initialState: AppState = {
  environment: getCurrentEnvironment(),
  network: currentConfig.defaultNetwork,
  userRole: "investor",
  walletState: "disconnected",
  operationalState: "normal",
  compliance: {
    kycRequired: false,
    kycCompleted: false,
    whitelistRequired: false,
    whitelisted: false,
  },
  selectedCurrency: "LUNES",
  connectedAccount: undefined,
};

/**
 * Reducer para gerenciar o estado da configuração
 */
function appConfigReducer(state: AppState, action: AppConfigAction): AppState {
  switch (action.type) {
    case "SET_ENVIRONMENT":
      return { ...state, environment: action.payload };

    case "SET_NETWORK":
      return { ...state, network: action.payload };

    case "SET_USER_ROLE":
      return { ...state, userRole: action.payload };

    case "SET_WALLET_STATE":
      return { ...state, walletState: action.payload };

    case "SET_OPERATIONAL_STATE":
      return { ...state, operationalState: action.payload };

    case "SET_COMPLIANCE":
      return { ...state, compliance: action.payload };

    case "SET_CURRENCY":
      return { ...state, selectedCurrency: action.payload };

    case "SET_CONNECTED_ACCOUNT":
      return { ...state, connectedAccount: action.payload };

    case "RESET_CONFIG":
      return initialState;

    default:
      return state;
  }
}

/**
 * Contexto de configuração
 */
const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined,
);

/**
 * Props do provider
 */
interface AppConfigProviderProps {
  children: ReactNode;
}

/**
 * Provider do contexto de configuração
 */
export function AppConfigProvider({ children }: AppConfigProviderProps) {
  const [state, dispatch] = useReducer(appConfigReducer, initialState);

  // Atualiza a configuração quando o ambiente muda
  const config = currentConfig;

  // Efeito para sincronizar com localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("launchpad-config");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.network)
          dispatch({ type: "SET_NETWORK", payload: parsed.network });
        if (parsed.userRole)
          dispatch({ type: "SET_USER_ROLE", payload: parsed.userRole });
        if (parsed.selectedCurrency)
          dispatch({ type: "SET_CURRENCY", payload: parsed.selectedCurrency });
      } catch (error) {
        console.warn("Erro ao carregar configuração salva:", error);
      }
    }
  }, []);

  // Efeito para salvar no localStorage
  useEffect(() => {
    const configToSave = {
      network: state.network,
      userRole: state.userRole,
      selectedCurrency: state.selectedCurrency,
    };
    localStorage.setItem("launchpad-config", JSON.stringify(configToSave));
  }, [state.network, state.userRole, state.selectedCurrency]);

  // Ações
  const setEnvironment = (env: Environment) =>
    dispatch({ type: "SET_ENVIRONMENT", payload: env });
  const setNetwork = (network: Network) =>
    dispatch({ type: "SET_NETWORK", payload: network });
  const setUserRole = (role: UserRole) =>
    dispatch({ type: "SET_USER_ROLE", payload: role });
  const setWalletState = (walletState: WalletState) =>
    dispatch({ type: "SET_WALLET_STATE", payload: walletState });
  const setOperationalState = (operationalState: OperationalState) =>
    dispatch({ type: "SET_OPERATIONAL_STATE", payload: operationalState });
  const setCompliance = (compliance: ComplianceStatus) =>
    dispatch({ type: "SET_COMPLIANCE", payload: compliance });
  const setCurrency = (currency: PaymentCurrency) =>
    dispatch({ type: "SET_CURRENCY", payload: currency });
  const setConnectedAccount = (account: string | undefined) =>
    dispatch({ type: "SET_CONNECTED_ACCOUNT", payload: account });
  const resetConfig = () => dispatch({ type: "RESET_CONFIG" });

  // Utilitários computados
  const isMainnet = state.network === "mainnet";
  const isTestnet = state.network === "testnet";
  const isLocal = state.network === "local";
  const canSign = state.walletState === "signed";
  const isAdmin = state.userRole === "admin";
  const isDeveloper = state.userRole === "developer";
  const isInvestor = state.userRole === "investor";
  const isOperational = state.operationalState === "normal";
  const isPaused = state.operationalState === "paused";
  const isInMaintenance = state.operationalState === "maintenance";

  const contextValue: AppConfigContextType = {
    state,
    config,
    setEnvironment,
    setNetwork,
    setUserRole,
    setWalletState,
    setOperationalState,
    setCompliance,
    setCurrency,
    setConnectedAccount,
    resetConfig,
    isMainnet,
    isTestnet,
    isLocal,
    canSign,
    isAdmin,
    isDeveloper,
    isInvestor,
    isOperational,
    isPaused,
    isInMaintenance,
  };

  return (
    <AppConfigContext.Provider value={contextValue}>
      {children}
    </AppConfigContext.Provider>
  );
}

/**
 * Hook para usar o contexto de configuração
 */
export function useAppConfig(): AppConfigContextType {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error(
      "useAppConfig deve ser usado dentro de um AppConfigProvider",
    );
  }
  return context;
}
