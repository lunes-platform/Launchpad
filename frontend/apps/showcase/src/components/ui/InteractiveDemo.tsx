import React, { useState } from "react";
import {
  FadeIn,
  SlideIn,
  ScaleIn,
  Stagger,
  Pulse,
  Bounce,
  RotateIn,
} from "../animations";
import {
  ButtonRipple,
  HoverGlow,
  LoadingSpinner,
  ProgressBar,
  FloatingActionButton,
  Toast,
  ToastContainer,
} from "../microinteractions";
import type { ToastProps } from "../microinteractions";

/**
 * Componente de demonstração interativa das animações e microinterações
 *
 * Este componente serve como showcase das funcionalidades implementadas,
 * permitindo aos usuários visualizar e interagir com os diferentes efeitos.
 */
export const InteractiveDemo: React.FC = () => {
  const [progress, setProgress] = useState(45);
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [fabOpen, setFabOpen] = useState(false);

  const addToast = (type: "success" | "error" | "warning" | "info") => {
    const messages = {
      success: "Operação realizada com sucesso!",
      error: "Ocorreu um erro inesperado.",
      warning: "Atenção: Verifique os dados inseridos.",
      info: "Nova atualização disponível.",
    };

    const newToast: ToastProps = {
      id: Date.now().toString(),
      type,
      message: messages[type],
      title: type.charAt(0).toUpperCase() + type.slice(1),
      onRemove: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    };

    setToasts((prev) => [...prev, newToast]);
  };

  const demoItems = [
    { id: 1, title: "Item 1", description: "Primeiro item da demonstração" },
    { id: 2, title: "Item 2", description: "Segundo item da demonstração" },
    { id: 3, title: "Item 3", description: "Terceiro item da demonstração" },
    { id: 4, title: "Item 4", description: "Quarto item da demonstração" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-grafite-900 dark:to-grafite-800 p-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <FadeIn duration={800}>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-grafite-50 mb-4">
              Demonstração Interativa
            </h1>
            <p className="text-lg text-gray-600 dark:text-grafite-300">
              Explore as animações e microinterações implementadas
            </p>
          </div>
        </FadeIn>

        {/* Seção de Animações */}
        <div className="mb-16">
          <SlideIn direction="left" duration={600}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-grafite-50 mb-8">
              Componentes de Animação
            </h2>
          </SlideIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* FadeIn Demo */}
            <FadeIn delay={200}>
              <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-grafite-600 transition-colors duration-200">
                <h3 className="text-lg font-semibold mb-3 text-grafite dark:text-grafite-50">
                  FadeIn
                </h3>
                <p className="text-gray-600 dark:text-grafite-300 mb-4">
                  Animação de entrada com fade suave
                </p>
                <div className="h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-medium">
                  Fade Effect
                </div>
              </div>
            </FadeIn>

            {/* SlideIn Demo */}
            <SlideIn direction="up" duration={800} delay={400}>
              <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-grafite-600 transition-colors duration-200">
                <h3 className="text-lg font-semibold mb-3 text-grafite dark:text-grafite-50">
                  SlideIn
                </h3>
                <p className="text-gray-600 dark:text-grafite-300 mb-4">
                  Animação de deslizamento direcional
                </p>
                <div className="h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white font-medium">
                  Slide Effect
                </div>
              </div>
            </SlideIn>

            {/* ScaleIn Demo */}
            <ScaleIn duration={700} delay={600}>
              <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-grafite-600 transition-colors duration-200">
                <h3 className="text-lg font-semibold mb-3 text-grafite dark:text-grafite-50">
                  ScaleIn
                </h3>
                <p className="text-gray-600 dark:text-grafite-300 mb-4">
                  Animação de escala com entrada suave
                </p>
                <div className="h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium">
                  Scale Effect
                </div>
              </div>
            </ScaleIn>
          </div>

          {/* Stagger Demo */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 dark:text-grafite-50">
              Stagger Animation
            </h3>
            <Stagger staggerDelay={150} duration={600}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {demoItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-grafite-600 transition-colors duration-200"
                  >
                    <h4 className="font-semibold text-gray-800 dark:text-grafite-50">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-grafite-300 mt-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </Stagger>
          </div>

          {/* Pulse e Bounce Demo */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-grafite-50">
                Pulse Animation
              </h3>
              <Pulse duration={2000} minScale={1} maxScale={1.1}>
                <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-red-600 rounded-full mx-auto flex items-center justify-center text-white font-bold">
                  PULSE
                </div>
              </Pulse>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-grafite-50">
                Bounce Animation
              </h3>
              <Bounce height={20} duration={1000}>
                <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center text-white font-bold">
                  BOUNCE
                </div>
              </Bounce>
            </div>
          </div>
        </div>

        {/* Seção de Microinterações */}
        <div className="mb-16">
          <SlideIn direction="right" duration={600}>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-grafite-50 mb-8">
              Componentes de Microinteração
            </h2>
          </SlideIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* ButtonRipple Demo */}
            <FadeIn delay={200}>
              <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-grafite-600 transition-colors duration-200">
                <h3 className="text-lg font-semibold mb-3 text-grafite dark:text-grafite-50">
                  Button Ripple
                </h3>
                <p className="text-gray-600 dark:text-grafite-300 mb-4">
                  Efeito de ondulação em botões
                </p>
                <ButtonRipple
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  rippleColor="rgba(255, 255, 255, 0.6)"
                >
                  Clique para ver o efeito
                </ButtonRipple>
              </div>
            </FadeIn>

            {/* HoverGlow Demo */}
            <FadeIn delay={400}>
              <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-grafite-600 transition-colors duration-200">
                <h3 className="text-lg font-semibold mb-3 text-grafite dark:text-grafite-50">
                  Hover Glow
                </h3>
                <p className="text-gray-600 dark:text-grafite-300 mb-4">
                  Efeito de brilho no hover
                </p>
                <HoverGlow
                  glowColor="#10b981"
                  intensity={0.5}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors cursor-pointer text-center"
                >
                  Passe o mouse aqui
                </HoverGlow>
              </div>
            </FadeIn>

            {/* LoadingSpinner Demo */}
            <FadeIn delay={600}>
              <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-grafite-600 transition-colors duration-200">
                <h3 className="text-lg font-semibold mb-3 text-grafite dark:text-grafite-50">
                  Loading Spinner
                </h3>
                <p className="text-gray-600 dark:text-grafite-300 mb-4">
                  Indicadores de carregamento
                </p>
                <div className="flex justify-center space-x-4">
                  <LoadingSpinner variant="spin" size="md" color="#3b82f6" />
                  <LoadingSpinner variant="pulse" size="md" color="#10b981" />
                  <LoadingSpinner variant="dots" size="md" color="#f59e0b" />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ProgressBar Demo */}
          <div className="mt-8">
            <FadeIn delay={800}>
              <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-grafite-600 transition-colors duration-200">
                <h3 className="text-lg font-semibold mb-3 text-grafite dark:text-grafite-50">
                  Progress Bar
                </h3>
                <p className="text-gray-600 dark:text-grafite-300 mb-4">
                  Barras de progresso animadas
                </p>

                <div className="space-y-4">
                  <ProgressBar
                    value={progress}
                    variant="gradient"
                    showPercentage
                    animated
                    color="#3b82f6"
                  />

                  <ProgressBar
                    value={progress}
                    variant="striped"
                    showValue
                    animated
                    color="#10b981"
                  />

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => setProgress(Math.max(0, progress - 10))}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      -10%
                    </button>
                    <button
                      onClick={() => setProgress(Math.min(100, progress + 10))}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      +10%
                    </button>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Toast Demo */}
          <div className="mt-8">
            <FadeIn delay={1000}>
              <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-grafite-600 transition-colors duration-200">
                <h3 className="text-lg font-semibold mb-3 text-grafite dark:text-grafite-50">
                  Toast Notifications
                </h3>
                <p className="text-gray-600 dark:text-grafite-300 mb-4">
                  Notificações com animações
                </p>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => addToast("success")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Success
                  </button>
                  <button
                    onClick={() => addToast("error")}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Error
                  </button>
                  <button
                    onClick={() => addToast("warning")}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                  >
                    Warning
                  </button>
                  <button
                    onClick={() => addToast("info")}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Info
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Floating Action Button */}
        <FloatingActionButton
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          }
          position="bottom-right"
          isOpen={fabOpen}
          onToggle={setFabOpen}
          tooltip="Ações rápidas"
          actions={[
            {
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              ),
              label: "Editar",
              onClick: () => addToast("info"),
            },
            {
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              ),
              label: "Excluir",
              onClick: () => addToast("warning"),
              color: "#ef4444",
            },
            {
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              ),
              label: "Compartilhar",
              onClick: () => addToast("success"),
              color: "#10b981",
            },
          ]}
        />

        {/* Toast Container */}
        <ToastContainer toasts={toasts} position="top-right" />
      </div>
    </div>
  );
};

export default InteractiveDemo;
