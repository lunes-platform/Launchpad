import React, { useState, useEffect } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useWallet } from "../../contexts/WalletContext";
import { Card, Button } from "@launchpad/shared-ui";
import {
  Wallet,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Key,
  FileSignature,
  ServerCog,
} from "lucide-react";

/**
 * Estados do processo de autenticação Web3
 */
const AuthStep = {
  IDLE: "idle",
  GENERATING_NONCE: "generating_nonce",
  SIGNING_MESSAGE: "signing_message",
  VERIFYING_SIGNATURE: "verifying_signature",
  COMPLETED: "completed",
  ERROR: "error"
} as const;

type AuthStepType = typeof AuthStep[keyof typeof AuthStep];

/**
 * Página de Login/Autenticação
 *
 * Funcionalidades:
 * - Conexão com carteira Web3
 * - Autenticação automática após conexão com fluxo Web3 real
 * - Visualização das etapas do processo (nonce, assinatura, verificação)
 * - Redirecionamento para página de origem
 * - Estados de loading e erro detalhados
 * - Interface responsiva e acessível
 */
export function LoginPage() {
  const { isAuthenticated, login, isLoading: authLoading, error: authError } = useAuth();
  const {
    accounts,
    selectedAccount,
    selectAccount,
    connect,
    isLoading: isConnecting,
    error: walletError,
  } = useWallet();
  const location = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStepType>(AuthStep.IDLE);

  // Página de origem para redirecionamento após login
  const from = (location.state as any)?.from || "/dashboard";

  // Efeito para login automático quando carteira é conectada
  useEffect(() => {
    const performLogin = async () => {
      if (selectedAccount && !isAuthenticated && !authLoading && !isLoggingIn) {
        setIsLoggingIn(true);
        setLoginError(null);
        setAuthStep(AuthStep.GENERATING_NONCE);

        try {
          console.log('🔐 Iniciando processo de login Web3...');
          await login();
          setAuthStep(AuthStep.COMPLETED);
        } catch (error) {
          console.error("Erro no login:", error);
          setAuthStep(AuthStep.ERROR);
          setLoginError(authError || "Falha na autenticação Web3. Tente novamente.");
        } finally {
          setIsLoggingIn(false);
        }
      }
    };

    performLogin();
  }, [selectedAccount, isAuthenticated, authLoading, login, isLoggingIn, authError]);

  // Atualizar erro quando authError muda
  useEffect(() => {
    if (authError) {
      setLoginError(authError);
      setAuthStep(AuthStep.ERROR);
    }
  }, [authError]);

  // Handler para conectar carteira
  const handleConnectWallet = async () => {
    setLoginError(null);
    setAuthStep(AuthStep.IDLE);
    try {
      await connect();
    } catch (error) {
      console.error("Erro ao conectar carteira:", error);
      setLoginError(
        "Falha ao conectar carteira. Verifique se a extensão está instalada.",
      );
      setAuthStep(AuthStep.ERROR);
    }
  };

  // Handler para selecionar conta
  const handleSelectAccount = async (accountAddress: string) => {
    setLoginError(null);
    setAuthStep(AuthStep.IDLE);
    try {
      const account = accounts?.find((acc) => acc.address === accountAddress);
      if (account) {
        selectAccount(account);
      }
    } catch (error) {
      console.error("Erro ao selecionar conta:", error);
      setLoginError("Falha ao selecionar conta. Tente novamente.");
      setAuthStep(AuthStep.ERROR);
    }
  };

  // Handler para tentar login novamente
  const handleRetryLogin = async () => {
    if (selectedAccount) {
      setLoginError(null);
      setAuthStep(AuthStep.IDLE);
      setIsLoggingIn(true);
      
      try {
        await login();
        setAuthStep(AuthStep.COMPLETED);
      } catch (error) {
        console.error("Erro no retry do login:", error);
        setAuthStep(AuthStep.ERROR);
        setLoginError(authError || "Falha na autenticação Web3. Tente novamente.");
      } finally {
        setIsLoggingIn(false);
      }
    }
  };

  // Renderizar etapas do processo Web3
  const renderAuthSteps = () => {
    const steps = [
      {
        key: AuthStep.GENERATING_NONCE,
        icon: Key,
        title: "Gerando Nonce",
        description: "Solicitando desafio criptográfico do servidor...",
        active: authStep === AuthStep.GENERATING_NONCE,
        completed: authStep === AuthStep.SIGNING_MESSAGE || authStep === AuthStep.VERIFYING_SIGNATURE || authStep === AuthStep.COMPLETED
      },
      {
        key: AuthStep.SIGNING_MESSAGE,
        icon: FileSignature,
        title: "Assinando Mensagem",
        description: "Aguardando assinatura da carteira...",
        active: authStep === AuthStep.SIGNING_MESSAGE,
        completed: authStep === AuthStep.VERIFYING_SIGNATURE || authStep === AuthStep.COMPLETED
      },
      {
        key: AuthStep.VERIFYING_SIGNATURE,
        icon: ServerCog,
        title: "Verificando Assinatura",
        description: "Validando credenciais no servidor...",
        active: authStep === AuthStep.VERIFYING_SIGNATURE,
        completed: authStep === AuthStep.COMPLETED
      }
    ];

    return (
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.key}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                step.active
                  ? "bg-azul-50 dark:bg-azul-900/20 border border-azul-200 dark:border-azul-800"
                  : step.completed
                  ? "bg-verde-50 dark:bg-verde-900/20 border border-verde-200 dark:border-verde-800"
                  : "bg-grafite-50 dark:bg-grafite-800 border border-grafite-200 dark:border-grafite-700"
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.active
                    ? "bg-azul-500 text-white"
                    : step.completed
                    ? "bg-verde-500 text-white"
                    : "bg-grafite-300 dark:bg-grafite-600 text-grafite-600 dark:text-grafite-300"
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-4 h-4" />
                ) : step.active ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <div
                  className={`font-medium ${
                    step.active || step.completed
                      ? "text-grafite-900 dark:text-grafite-50"
                      : "text-grafite-600 dark:text-grafite-400"
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-sm ${
                    step.active
                      ? "text-azul-600 dark:text-azul-400"
                      : step.completed
                      ? "text-verde-600 dark:text-verde-400"
                      : "text-grafite-500 dark:text-grafite-500"
                  }`}
                >
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Se já está autenticado, redireciona
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-azul-50 to-roxo-50 dark:from-grafite-900 dark:to-grafite-800 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-azul-100 dark:bg-azul-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-azul-600 dark:text-azul-400" />
          </div>
          <h1 className="text-2xl font-bold text-grafite-900 dark:text-grafite-50 mb-2">
            Acesse sua conta
          </h1>
          <p className="text-grafite-600 dark:text-grafite-300">
            Conecte sua carteira Web3 para continuar
          </p>
        </div>

        <Card className="p-6 space-y-6">
          {/* Estado: Sem carteira conectada */}
          {!selectedAccount && (!accounts || accounts.length === 0) && (
            <div className="space-y-4">
              <div className="text-center">
                <Wallet className="w-12 h-12 text-grafite-400 mx-auto mb-3" />
                <h3 className="font-semibold text-grafite-900 dark:text-grafite-50 mb-2">
                  Conectar Carteira
                </h3>
                <p className="text-sm text-grafite-600 dark:text-grafite-300 mb-4">
                  Para acessar a plataforma, você precisa conectar uma carteira
                  compatível com Polkadot.
                </p>
              </div>

              <Button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="w-full"
                size="lg"
              >
                {isConnecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 mr-2" />
                    Conectar Carteira
                  </>
                )}
              </Button>

              <div className="text-xs text-grafite-500 dark:text-grafite-400 text-center">
                Suportamos SubWallet, Polkadot.js e outras carteiras compatíveis
              </div>
            </div>
          )}

          {/* Estado: Contas disponíveis para seleção */}
          {!selectedAccount && accounts && accounts.length > 0 && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-verde-500 mx-auto mb-3" />
                <h3 className="font-semibold text-grafite-900 dark:text-grafite-50 mb-2">
                  Selecionar Conta
                </h3>
                <p className="text-sm text-grafite-600 dark:text-grafite-300 mb-4">
                  Escolha a conta que deseja usar para acessar a plataforma.
                </p>
              </div>

              <div className="space-y-2">
                {accounts?.map((account) => (
                  <button
                    key={account.address}
                    onClick={() => handleSelectAccount(account.address)}
                    className="w-full p-3 text-left border border-grafite-200 dark:border-grafite-700 rounded-lg hover:border-azul-300 dark:hover:border-azul-600 hover:bg-azul-50 dark:hover:bg-azul-900/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-grafite-900 dark:text-grafite-50">
                          {account.meta?.name || "Conta sem nome"}
                        </div>
                        <div className="text-sm text-grafite-500 dark:text-grafite-400 font-mono">
                          {account.address.slice(0, 8)}...
                          {account.address.slice(-8)}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-grafite-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Estado: Conta selecionada, fazendo login Web3 */}
          {selectedAccount && (isLoggingIn || authLoading) && authStep !== AuthStep.ERROR && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-azul-100 dark:bg-azul-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-azul-600 dark:text-azul-400" />
                </div>
                <h3 className="font-semibold text-grafite-900 dark:text-grafite-50 mb-2">
                  Autenticação Web3
                </h3>
                <p className="text-sm text-grafite-600 dark:text-grafite-300 mb-4">
                  Processando autenticação segura com sua carteira
                </p>
              </div>

              {/* Etapas do processo Web3 */}
              {renderAuthSteps()}

              <div className="text-center">
                <p className="text-xs text-grafite-500 dark:text-grafite-400">
                  Conta selecionada: {selectedAccount.meta?.name || "Sem nome"}
                </p>
                <p className="text-xs text-grafite-400 dark:text-grafite-500 font-mono">
                  {selectedAccount.address.slice(0, 12)}...{selectedAccount.address.slice(-12)}
                </p>
              </div>
            </div>
          )}

          {/* Estado: Erro na autenticação */}
          {authStep === AuthStep.ERROR && (walletError || loginError) && (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-1">
                    Erro de Autenticação Web3
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {walletError || loginError}
                  </p>
                </div>
              </div>

              {/* Botão para tentar novamente */}
              {selectedAccount && (
                <Button
                  onClick={handleRetryLogin}
                  disabled={isLoggingIn}
                  className="w-full"
                  variant="outline"
                >
                  {isLoggingIn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Tentando novamente...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Tentar Autenticação Novamente
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Link para voltar */}
          <div className="text-center pt-4 border-t border-grafite-200 dark:border-grafite-700">
            <Link
              to="/"
              className="text-sm text-azul-600 dark:text-azul-400 hover:text-azul-700 dark:hover:text-azul-300 transition-colors"
            >
              ← Voltar para página inicial
            </Link>
          </div>
        </Card>

        {/* Informações de segurança */}
        <div className="mt-6 text-center">
          <p className="text-xs text-grafite-500 dark:text-grafite-400">
            🔒 Autenticação Web3 segura: suas chaves privadas nunca são compartilhadas. 
            A autenticação é feita através de assinatura digital criptográfica.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
