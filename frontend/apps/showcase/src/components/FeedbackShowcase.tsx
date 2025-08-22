import React, { useState } from "react";
import {
  Button,
  Spinner,
  LoadingState,
  SkeletonLoader,
  ProgressBar,
  Alert,
  AnimatedButton,
  AnimatedCard,
  AnimatedBox,
} from "@launchpad/shared-ui";
import { useNotifications } from "../hooks/useNotifications";

export const FeedbackShowcase: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const { addNotification } = useNotifications();

  const handleAction = async (
    type: "success" | "error" | "warning" | "info",
  ) => {
    setIsLoading(true);
    setProgress(0);

    // Simula progresso
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simula uma operação assíncrona
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const messages = {
      success: "Operação realizada com sucesso!",
      error: "Ocorreu um erro durante a operação.",
      warning: "Atenção: Esta ação pode ter consequências.",
      info: "Informação importante sobre o sistema.",
    };

    addNotification({
      type,
      title: messages[type],
      message: "Operação processada com sucesso.",
      duration: 4000,
    });

    setIsLoading(false);
    setProgress(0);
  };

  const handleSkeletonDemo = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 3000);
  };

  return (
    <div className="p-8 space-y-12">
      {/* Header */}
      <AnimatedBox variant="fadeIn" className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Sistema de Feedback Visual & Animações
        </h1>
        <p className="text-xl text-gray-600">
          Demonstração dos componentes de notificação, feedback e
          microinterações
        </p>
      </AnimatedBox>

      {/* Animated Buttons Section */}
      <AnimatedBox variant="slideUp" delay={200}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Botões Animados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatedButton
            variant="primary"
            onClick={() => handleAction("success")}
            loading={isLoading}
            ripple
          >
            Sucesso
          </AnimatedButton>

          <AnimatedButton
            variant="secondary"
            onClick={() => handleAction("error")}
            loading={isLoading}
            ripple
          >
            Erro
          </AnimatedButton>

          <AnimatedButton
            variant="outline"
            onClick={() => handleAction("warning")}
            loading={isLoading}
            bounce
          >
            Aviso
          </AnimatedButton>

          <AnimatedButton
            variant="ghost"
            onClick={() => handleAction("info")}
            loading={isLoading}
            ripple
          >
            Info
          </AnimatedButton>
        </div>
      </AnimatedBox>

      {/* Progress and Loading States */}
      <AnimatedBox variant="slideUp" delay={400}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Estados de Carregamento
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">
              Barra de Progresso
            </h3>
            <ProgressBar value={progress} className="w-full" />
            <div className="flex items-center space-x-4">
              <Spinner size="sm" />
              <span className="text-sm text-gray-600">
                {progress}% concluído
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700">Loading State</h3>
            {isLoading ? (
              <LoadingState
                text="Processando sua solicitação..."
                description="Aguarde enquanto processamos os dados"
                variant="primary"
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">Conteúdo carregado com sucesso!</p>
              </div>
            )}
          </div>
        </div>
      </AnimatedBox>

      {/* Animated Cards */}
      <AnimatedBox variant="slideUp" delay={600}>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-grafite-100 mb-6">
          Cards Animados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard hover glow className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-grafite-100 mb-2">
              Card com Glow
            </h3>
            <p className="text-gray-600 dark:text-grafite-300">
              Este card tem efeito de brilho ao passar o mouse.
            </p>
          </AnimatedCard>

          <AnimatedCard hover tilt className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-grafite-100 mb-2">
              Card com Tilt
            </h3>
            <p className="text-gray-600 dark:text-grafite-300">
              Este card inclina conforme o movimento do mouse.
            </p>
          </AnimatedCard>

          <AnimatedCard hover scale shadow="xl" className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-grafite-100 mb-2">
              Card Escalável
            </h3>
            <p className="text-gray-600 dark:text-grafite-300">
              Este card aumenta de tamanho no hover.
            </p>
          </AnimatedCard>
        </div>
      </AnimatedBox>

      {/* Skeleton Loading Demo */}
      <AnimatedBox variant="slideUp" delay={800}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Skeleton Loading
        </h2>
        <div className="space-y-4">
          <AnimatedButton
            variant="outline"
            onClick={handleSkeletonDemo}
            disabled={showSkeleton}
          >
            {showSkeleton ? "Carregando..." : "Demonstrar Skeleton"}
          </AnimatedButton>

          <AnimatedCard className="p-6">
            {showSkeleton ? (
              <div className="space-y-4">
                <SkeletonLoader className="h-6 w-3/4" />
                <SkeletonLoader className="h-4 w-full" />
                <SkeletonLoader className="h-4 w-2/3" />
                <div className="flex space-x-4">
                  <SkeletonLoader className="h-10 w-20" />
                  <SkeletonLoader className="h-10 w-20" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Conteúdo Carregado
                </h3>
                <p className="text-gray-600">
                  Este é o conteúdo real que aparece após o carregamento. O
                  skeleton loading fornece uma prévia visual do layout.
                </p>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                    Ação 1
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                    Ação 2
                  </button>
                </div>
              </div>
            )}
          </AnimatedCard>
        </div>
      </AnimatedBox>

      {/* Alerts Section */}
      <AnimatedBox variant="slideUp" delay={1000}>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Alertas</h2>
        <div className="space-y-4">
          <Alert variant="success" title="Sucesso!">
            Sua operação foi concluída com êxito.
          </Alert>

          <Alert variant="warning" title="Atenção">
            Verifique os dados antes de prosseguir.
          </Alert>

          <Alert variant="error" title="Erro">
            Ocorreu um problema durante o processamento.
          </Alert>

          <Alert variant="info" title="Informação">
            Esta é uma mensagem informativa importante.
          </Alert>
        </div>
      </AnimatedBox>
    </div>
  );
};
