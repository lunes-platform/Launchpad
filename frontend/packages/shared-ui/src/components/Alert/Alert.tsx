import React from "react";
import { cn } from "../../utils/cn";

export interface AlertProps {
  /**
   * Variante do alert
   */
  variant?: "success" | "error" | "warning" | "info";
  /**
   * Título do alert
   */
  title?: string;
  /**
   * Conteúdo do alert
   */
  children: React.ReactNode;
  /**
   * Se deve mostrar o ícone
   */
  showIcon?: boolean;
  /**
   * Se deve mostrar o botão de fechar
   */
  dismissible?: boolean;
  /**
   * Callback quando o alert é fechado
   */
  onDismiss?: () => void;
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

const variantConfig = {
  success: {
    container: "bg-verde-900/20 border-verde-600 text-verde-300",
    icon: "✓",
    iconColor: "text-verde-400",
    title: "text-verde-200",
    closeButton: "text-verde-400 hover:text-verde-300",
  },
  error: {
    container: "bg-red-900/20 border-red-600 text-red-300",
    icon: "✕",
    iconColor: "text-red-400",
    title: "text-red-200",
    closeButton: "text-red-400 hover:text-red-300",
  },
  warning: {
    container: "bg-laranja-900/20 border-laranja-600 text-laranja-300",
    icon: "⚠",
    iconColor: "text-laranja-400",
    title: "text-laranja-200",
    closeButton: "text-laranja-400 hover:text-laranja-300",
  },
  info: {
    container: "bg-roxo-900/20 border-roxo-600 text-roxo-300",
    icon: "ℹ",
    iconColor: "text-roxo-400",
    title: "text-roxo-200",
    closeButton: "text-roxo-400 hover:text-roxo-300",
  },
};

/**
 * Componente Alert para feedback visual de diferentes estados
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Sucesso!">
 *   Operação realizada com sucesso.
 * </Alert>
 *
 * <Alert variant="error" dismissible onDismiss={() => console.log('dismissed')}>
 *   Ocorreu um erro durante a operação.
 * </Alert>
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className,
  ...props
}) => {
  const config = variantConfig[variant];

  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-colors duration-200",
        config.container,
        className,
      )}
      role="alert"
      {...props}
    >
      <div className="flex">
        {/* Icon */}
        {showIcon && (
          <div className="flex-shrink-0">
            <span
              className={cn("text-lg font-bold", config.iconColor)}
              aria-hidden={true}
            >
              {config.icon}
            </span>
          </div>
        )}

        {/* Content */}
        <div className={cn("ml-3 flex-1", !showIcon && "ml-0")}>
          {title && (
            <h3 className={cn("text-sm font-medium", config.title)}>{title}</h3>
          )}

          <div className={cn("text-sm", title && "mt-2")}>{children}</div>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={cn(
                  "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200",
                  config.closeButton,
                )}
                onClick={onDismiss}
                aria-label="Fechar alerta"
              >
                <span className="text-lg font-bold" aria-hidden={true}>
                  ×
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Alert.displayName = "Alert";

/**
 * Componente AlertBanner para alertas em formato de banner
 */
export interface AlertBannerProps extends Omit<AlertProps, "dismissible"> {
  /**
   * Se deve ocupar toda a largura
   */
  fullWidth?: boolean;
}

/**
 * Componente AlertBanner para alertas em formato de banner (sem bordas arredondadas)
 *
 * @example
 * ```tsx
 * <AlertBanner variant="warning" fullWidth>
 *   Sistema em manutenção programada.
 * </AlertBanner>
 * ```
 */
export const AlertBanner: React.FC<AlertBannerProps> = ({
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <Alert
      {...props}
      className={cn(
        "rounded-none border-l-4 border-r-0 border-t-0 border-b-0",
        fullWidth && "w-full",
        className,
      )}
    />
  );
};

AlertBanner.displayName = "AlertBanner";
