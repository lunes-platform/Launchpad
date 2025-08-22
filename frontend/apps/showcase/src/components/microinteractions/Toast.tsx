import React, { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export interface ToastProps {
  /** ID único do toast */
  id: string;
  /** Tipo do toast */
  type: ToastType;
  /** Título do toast */
  title?: string;
  /** Mensagem do toast */
  message: string;
  /** Duração em milissegundos (0 = não remove automaticamente) */
  duration?: number;
  /** Se pode ser fechado manualmente */
  closable?: boolean;
  /** Ícone customizado */
  icon?: React.ReactNode;
  /** Ação customizada */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Callback quando o toast é removido */
  onRemove?: (id: string) => void;
  /** Se deve mostrar barra de progresso */
  showProgress?: boolean;
  /** Posição do toast */
  position?: ToastPosition;
  /** Classe CSS adicional */
  className?: string;
}

export interface ToastContainerProps {
  /** Lista de toasts */
  toasts: ToastProps[];
  /** Posição dos toasts */
  position?: ToastPosition;
  /** Máximo de toasts visíveis */
  maxToasts?: number;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * Componente individual de Toast
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  closable = true,
  icon,
  action,
  onRemove,
  showProgress = true,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [progress, setProgress] = useState(100);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove?.(id);
    }, 300); // Tempo da animação de saída
  }, [id, onRemove]);

  useEffect(() => {
    // Animação de entrada
    const enterTimer = setTimeout(() => setIsVisible(true), 50);

    // Auto-remove
    let removeTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (duration > 0) {
      removeTimer = setTimeout(handleRemove, duration);

      // Animação da barra de progresso
      if (showProgress) {
        const interval = 50;
        const steps = duration / interval;
        let currentStep = 0;

        progressTimer = setInterval(() => {
          currentStep++;
          const newProgress = ((steps - currentStep) / steps) * 100;
          setProgress(Math.max(0, newProgress));

          if (currentStep >= steps) {
            clearInterval(progressTimer);
          }
        }, interval);
      }
    }

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(removeTimer);
      clearInterval(progressTimer);
    };
  }, [duration, handleRemove, showProgress]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#10b981",
          borderColor: "#059669",
          iconColor: "#ffffff",
        };
      case "error":
        return {
          backgroundColor: "#ef4444",
          borderColor: "#dc2626",
          iconColor: "#ffffff",
        };
      case "warning":
        return {
          backgroundColor: "#f59e0b",
          borderColor: "#d97706",
          iconColor: "#ffffff",
        };
      case "info":
        return {
          backgroundColor: "#3b82f6",
          borderColor: "#2563eb",
          iconColor: "#ffffff",
        };
      default:
        return {
          backgroundColor: "#6b7280",
          borderColor: "#4b5563",
          iconColor: "#ffffff",
        };
    }
  };

  const getDefaultIcon = () => {
    switch (type) {
      case "success":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "error":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "warning":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "info":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const typeStyles = getTypeStyles();

  const toastStyle: React.CSSProperties = {
    transform: isVisible
      ? "translateX(0) scale(1)"
      : "translateX(100%) scale(0.95)",
    opacity: isVisible && !isRemoving ? 1 : 0,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    maxWidth: "400px",
    minWidth: "300px",
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg border-l-4 p-4 mb-3 ${className}`}
      style={{
        ...toastStyle,
        borderLeftColor: typeStyles.borderColor,
      }}
    >
      {/* Barra de progresso */}
      {showProgress && duration > 0 && (
        <div
          className="absolute top-0 left-0 h-1 rounded-t-lg transition-all duration-75 ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: typeStyles.backgroundColor,
          }}
        />
      )}

      <div className="flex items-start">
        {/* Ícone */}
        <div
          className="flex-shrink-0 mr-3"
          style={{ color: typeStyles.iconColor }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: typeStyles.backgroundColor }}
          >
            {icon || getDefaultIcon()}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-gray-900 mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm text-gray-700">{message}</p>

          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm font-medium hover:underline"
              style={{ color: typeStyles.backgroundColor }}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Botão de fechar */}
        {closable && (
          <button
            onClick={handleRemove}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Container para múltiplos toasts
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  position = "top-right",
  maxToasts = 5,
  className = "",
}) => {
  const getPositionStyles = (): React.CSSProperties => {
    const baseOffset = 20;

    switch (position) {
      case "top-right":
        return {
          position: "fixed",
          top: baseOffset,
          right: baseOffset,
          flexDirection: "column",
        };
      case "top-left":
        return {
          position: "fixed",
          top: baseOffset,
          left: baseOffset,
          flexDirection: "column",
        };
      case "bottom-right":
        return {
          position: "fixed",
          bottom: baseOffset,
          right: baseOffset,
          flexDirection: "column-reverse",
        };
      case "bottom-left":
        return {
          position: "fixed",
          bottom: baseOffset,
          left: baseOffset,
          flexDirection: "column-reverse",
        };
      case "top-center":
        return {
          position: "fixed",
          top: baseOffset,
          left: "50%",
          transform: "translateX(-50%)",
          flexDirection: "column",
        };
      case "bottom-center":
        return {
          position: "fixed",
          bottom: baseOffset,
          left: "50%",
          transform: "translateX(-50%)",
          flexDirection: "column-reverse",
        };
      default:
        return {
          position: "fixed",
          top: baseOffset,
          right: baseOffset,
          flexDirection: "column",
        };
    }
  };

  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <div className={`flex z-50 ${className}`} style={getPositionStyles()}>
      {visibleToasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default Toast;
