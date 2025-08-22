import React from "react";
import { cn } from "../../utils/cn";

export interface SpinnerProps {
  /**
   * Tamanho do spinner
   */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Cor do spinner
   */
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "white";
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Texto de acessibilidade
   */
  "aria-label"?: string;
}

const sizeClasses = {
  xs: "w-3 h-3 border",
  sm: "w-4 h-4 border",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-2",
  xl: "w-12 h-12 border-4",
};

const variantClasses = {
  primary: "border-roxo-500 border-t-transparent",
  secondary: "border-grafite border-t-transparent",
  success: "border-verde-500 border-t-transparent",
  warning: "border-laranja-500 border-t-transparent",
  error: "border-red-500 border-t-transparent",
  white: "border-white border-t-transparent",
};

/**
 * Componente Spinner para indicar carregamento
 *
 * @example
 * ```tsx
 * <Spinner size="md" variant="primary" />
 * <Spinner size="lg" variant="success" aria-label="Carregando dados" />
 * ```
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className,
  "aria-label": ariaLabel = "Carregando...",
  ...props
}) => {
  return (
    <div
      className={cn(
        "inline-block rounded-full animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      role="status"
      aria-label={ariaLabel}
      {...props}
    />
  );
};

Spinner.displayName = "Spinner";
