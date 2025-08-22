import React from "react";
import { cn } from "../../utils/cn";

export interface SkeletonLoaderProps {
  /**
   * Largura do skeleton (pode ser string CSS ou número para pixels)
   */
  width?: string | number;
  /**
   * Altura do skeleton (pode ser string CSS ou número para pixels)
   */
  height?: string | number;
  /**
   * Formato do skeleton
   */
  variant?: "rectangular" | "circular" | "rounded" | "text";
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Se deve ter animação de pulso
   */
  animate?: boolean;
}

const variantClasses = {
  rectangular: "rounded-none",
  circular: "rounded-full",
  rounded: "rounded-md",
  text: "rounded-sm",
};

/**
 * Componente SkeletonLoader para placeholder de conteúdo durante carregamento
 *
 * @example
 * ```tsx
 * <SkeletonLoader width={200} height={20} variant="text" />
 * <SkeletonLoader width={40} height={40} variant="circular" />
 * <SkeletonLoader width="100%" height={120} variant="rounded" />
 * ```
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  variant = "rectangular",
  className,
  animate = true,
  ...props
}) => {
  // Define dimensões padrão para variante text
  const finalWidth = width ?? (variant === "text" ? "100%" : undefined);
  const finalHeight = height ?? (variant === "text" ? "1rem" : undefined);

  const style: React.CSSProperties = {
    width: typeof finalWidth === "number" ? `${finalWidth}px` : finalWidth,
    height: typeof finalHeight === "number" ? `${finalHeight}px` : finalHeight,
  };

  return (
    <div
      className={cn(
        "bg-grafite-600",
        animate && "animate-pulse",
        variantClasses[variant],
        className,
      )}
      style={style}
      role="status"
      aria-label="Carregando conteúdo..."
      {...props}
    />
  );
};

SkeletonLoader.displayName = "SkeletonLoader";

/**
 * Componente para múltiplas linhas de texto skeleton
 */
export interface SkeletonTextProps {
  /**
   * Número de linhas
   */
  lines?: number;
  /**
   * Largura da última linha (para simular texto real)
   */
  lastLineWidth?: string | number;
  /**
   * Espaçamento entre linhas
   */
  spacing?: "sm" | "md" | "lg";
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

const spacingClasses = {
  sm: "space-y-1",
  md: "space-y-2",
  lg: "space-y-3",
};

/**
 * Componente SkeletonText para múltiplas linhas de placeholder de texto
 *
 * @example
 * ```tsx
 * <SkeletonText lines={3} lastLineWidth="60%" />
 * <SkeletonText lines={2} spacing="lg" />
 * ```
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  lastLineWidth = "75%",
  spacing = "md",
  className,
  ...props
}) => {
  return (
    <div className={cn(spacingClasses[spacing], className)} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        <SkeletonLoader
          key={index}
          variant="text"
          width={index === lines - 1 ? lastLineWidth : "100%"}
          height={16}
        />
      ))}
    </div>
  );
};

SkeletonText.displayName = "SkeletonText";
