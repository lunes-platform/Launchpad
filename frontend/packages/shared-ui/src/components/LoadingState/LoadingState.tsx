import React from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "../Spinner";

export interface LoadingStateProps {
  /**
   * Texto a ser exibido junto com o spinner
   */
  text?: string;
  /**
   * Descrição adicional (opcional)
   */
  description?: string;
  /**
   * Tamanho do componente
   */
  size?: "sm" | "md" | "lg";
  /**
   * Variante visual
   */
  variant?: "primary" | "secondary" | "minimal";
  /**
   * Layout do componente
   */
  layout?: "vertical" | "horizontal";
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Se deve ocupar toda a altura disponível
   */
  fullHeight?: boolean;
}

const sizeConfig = {
  sm: {
    spinner: "sm" as const,
    text: "text-sm",
    description: "text-xs",
    spacing: "gap-2",
  },
  md: {
    spinner: "md" as const,
    text: "text-base",
    description: "text-sm",
    spacing: "gap-3",
  },
  lg: {
    spinner: "lg" as const,
    text: "text-lg",
    description: "text-base",
    spacing: "gap-4",
  },
};

const variantClasses = {
  primary: {
    container:
      "bg-grafite-800/80 backdrop-blur-sm border border-grafite-600 rounded-lg p-6 shadow-sm",
    text: "text-white font-medium",
    description: "text-grafite-300",
  },
  secondary: {
    container: "bg-grafite-700 rounded-lg p-4",
    text: "text-white font-medium",
    description: "text-grafite-300",
  },
  minimal: {
    container: "",
    text: "text-white",
    description: "text-grafite-300",
  },
};

/**
 * Componente LoadingState para exibir estados de carregamento com texto e descrição
 *
 * @example
 * ```tsx
 * <LoadingState text="Carregando projetos..." />
 * <LoadingState
 *   text="Processando transação"
 *   description="Aguarde enquanto confirmamos na blockchain"
 *   size="lg"
 *   variant="primary"
 * />
 * ```
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  text = "Carregando...",
  description,
  size = "md",
  variant = "minimal",
  layout = "vertical",
  className,
  fullHeight = false,
  ...props
}) => {
  const config = sizeConfig[size];
  const variantStyle = variantClasses[variant];

  const containerClasses = cn(
    "flex items-center justify-center",
    layout === "vertical" ? "flex-col" : "flex-row",
    config.spacing,
    variantStyle.container,
    fullHeight && "min-h-[200px]",
    className,
  );

  return (
    <div className={containerClasses} {...props}>
      <Spinner
        size={config.spinner}
        variant={variant === "minimal" ? "primary" : "primary"}
      />

      <div
        className={cn(
          "text-center",
          layout === "horizontal" && "text-left ml-1",
        )}
      >
        {text && (
          <div className={cn(config.text, variantStyle.text)}>{text}</div>
        )}

        {description && (
          <div
            className={cn(config.description, variantStyle.description, "mt-1")}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

LoadingState.displayName = "LoadingState";
