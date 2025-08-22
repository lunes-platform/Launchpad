import React from "react";
import { cn } from "../../utils/cn";

export interface ProgressBarProps {
  /**
   * Valor atual do progresso (0-100)
   */
  value: number;
  /**
   * Valor máximo (padrão: 100)
   */
  max?: number;
  /**
   * Tamanho da barra de progresso
   */
  size?: "sm" | "md" | "lg";
  /**
   * Variante visual
   */
  variant?: "primary" | "success" | "warning" | "error" | "gradient";
  /**
   * Se deve mostrar o texto de porcentagem
   */
  showPercentage?: boolean;
  /**
   * Texto customizado (substitui a porcentagem)
   */
  label?: string;
  /**
   * Se deve ter animação suave
   */
  animated?: boolean;
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

const sizeClasses = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const variantClasses = {
  primary: "bg-roxo-500",
  success: "bg-verde-500",
  warning: "bg-laranja-500",
  error: "bg-red-500",
  gradient: "bg-gradient-to-r from-roxo-500 to-roxo-600",
};

/**
 * Componente ProgressBar para indicar progresso de operações
 *
 * @example
 * ```tsx
 * <ProgressBar value={75} showPercentage />
 * <ProgressBar value={50} variant="success" size="lg" />
 * <ProgressBar value={25} label="Carregando..." animated />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = "md",
  variant = "primary",
  showPercentage = false,
  label,
  animated = true,
  className,
  ...props
}) => {
  // Calcula a porcentagem
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Texto a ser exibido
  const displayText =
    label || (showPercentage ? `${Math.round(percentage)}%` : "");

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Label/Percentage */}
      {displayText && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-white">{displayText}</span>
          {label && showPercentage && (
            <span className="text-sm text-grafite-300">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div
        className={cn(
          "w-full bg-grafite-700 rounded-full overflow-hidden",
          sizeClasses[size],
        )}
      >
        {/* Progress Bar Fill */}
        <div
          className={cn(
            "h-full rounded-full",
            variantClasses[variant],
            animated && "transition-all duration-300 ease-out",
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={displayText || `Progresso: ${Math.round(percentage)}%`}
        />
      </div>
    </div>
  );
};

ProgressBar.displayName = "ProgressBar";

/**
 * Componente ProgressCircle para progresso circular
 */
export interface ProgressCircleProps {
  /**
   * Valor atual do progresso (0-100)
   */
  value: number;
  /**
   * Valor máximo (padrão: 100)
   */
  max?: number;
  /**
   * Tamanho do círculo
   */
  size?: number;
  /**
   * Espessura da linha
   */
  strokeWidth?: number;
  /**
   * Variante visual
   */
  variant?: "primary" | "success" | "warning" | "error";
  /**
   * Se deve mostrar o texto de porcentagem no centro
   */
  showPercentage?: boolean;
  /**
   * Texto customizado no centro
   */
  label?: string;
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

const circleVariantColors = {
  primary: "#6C38FF", // roxo
  success: "#26D07C", // verde
  warning: "#FE5F00", // laranja
  error: "#EF4444", // red-500
};

/**
 * Componente ProgressCircle para progresso circular
 *
 * @example
 * ```tsx
 * <ProgressCircle value={75} showPercentage />
 * <ProgressCircle value={50} variant="success" size={120} />
 * ```
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = "primary",
  showPercentage = false,
  label,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const displayText =
    label || (showPercentage ? `${Math.round(percentage)}%` : "");

  return (
    <div className={cn("relative inline-flex", className)} {...props}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={circleVariantColors[variant]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </svg>

      {/* Center Text */}
      {displayText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-white text-center">
            {displayText}
          </span>
        </div>
      )}
    </div>
  );
};

ProgressCircle.displayName = "ProgressCircle";
