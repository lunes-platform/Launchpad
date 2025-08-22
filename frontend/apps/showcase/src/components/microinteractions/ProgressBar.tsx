import React, { useEffect, useState } from "react";

export interface ProgressBarProps {
  /** Valor atual do progresso (0-100) */
  value: number;
  /** Valor máximo */
  max?: number;
  /** Altura da barra em pixels */
  height?: number;
  /** Cor da barra de progresso */
  color?: string;
  /** Cor de fundo da barra */
  backgroundColor?: string;
  /** Duração da animação em milissegundos */
  animationDuration?: number;
  /** Se deve mostrar o texto de porcentagem */
  showPercentage?: boolean;
  /** Se deve mostrar o valor atual */
  showValue?: boolean;
  /** Texto customizado */
  label?: string;
  /** Posição do texto */
  labelPosition?: "inside" | "outside" | "top" | "bottom";
  /** Se deve animar o progresso */
  animated?: boolean;
  /** Tipo de animação */
  variant?: "default" | "striped" | "gradient" | "pulse";
  /** Classe CSS adicional */
  className?: string;
  /** Se a barra deve ter bordas arredondadas */
  rounded?: boolean;
  /** Callback quando a animação termina */
  onAnimationComplete?: () => void;
}

/**
 * Componente de barra de progresso com animações
 *
 * @example
 * <ProgressBar
 *   value={75}
 *   variant="gradient"
 *   showPercentage
 *   animated
 *   color="#3b82f6"
 * />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height = 8,
  color = "#3b82f6",
  backgroundColor = "#e5e7eb",
  animationDuration = 1000,
  showPercentage = false,
  showValue = false,
  label,
  labelPosition = "outside",
  animated = true,
  variant = "default",
  className = "",
  rounded = true,
  onAnimationComplete,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    if (!animated) {
      setAnimatedValue(percentage);
      return;
    }

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = animatedValue;
    const targetValue = percentage;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeOut;

      setAnimatedValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onAnimationComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [percentage, animated, animationDuration, onAnimationComplete]);

  // Injetar keyframes CSS para animações especiais
  useEffect(() => {
    if (variant === "striped" || variant === "pulse") {
      const keyframeId = `progress-${variant}-${animationDuration}`;
      if (document.getElementById(keyframeId)) return;

      let keyframes = "";

      if (variant === "striped") {
        keyframes = `
          @keyframes progress-striped {
            0% { background-position: 0 0; }
            100% { background-position: 40px 0; }
          }
        `;
      } else if (variant === "pulse") {
        keyframes = `
          @keyframes progress-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `;
      }

      const style = document.createElement("style");
      style.id = keyframeId;
      style.textContent = keyframes;
      document.head.appendChild(style);
    }
  }, [variant, animationDuration]);

  const getProgressBarStyle = (): React.CSSProperties => {
    let backgroundStyle = color;

    switch (variant) {
      case "striped":
        backgroundStyle = `repeating-linear-gradient(
          45deg,
          ${color},
          ${color} 10px,
          ${color}80 10px,
          ${color}80 20px
        )`;
        break;
      case "gradient":
        backgroundStyle = `linear-gradient(90deg, ${color}80, ${color})`;
        break;
      case "pulse":
        backgroundStyle = color;
        break;
      default:
        backgroundStyle = color;
    }

    const baseStyle: React.CSSProperties = {
      width: `${animatedValue}%`,
      height: "100%",
      background: backgroundStyle,
      transition: animated ? "none" : `width ${animationDuration}ms ease-out`,
      borderRadius: rounded ? height / 2 : 0,
    };

    if (variant === "striped") {
      baseStyle.animation = "progress-striped 1s linear infinite";
    } else if (variant === "pulse") {
      baseStyle.animation = "progress-pulse 2s ease-in-out infinite";
    }

    return baseStyle;
  };

  const renderLabel = () => {
    let text = "";

    if (label) {
      text = label;
    } else if (showPercentage && showValue) {
      text = `${value}/${max} (${Math.round(percentage)}%)`;
    } else if (showPercentage) {
      text = `${Math.round(percentage)}%`;
    } else if (showValue) {
      text = `${value}/${max}`;
    }

    if (!text) return null;

    const labelStyle: React.CSSProperties = {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: labelPosition === "inside" ? "#ffffff" : "#374151",
    };

    if (labelPosition === "inside") {
      return (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={labelStyle}
        >
          {text}
        </div>
      );
    }

    return (
      <div
        className={`text-sm font-medium ${
          labelPosition === "top" ? "mb-1" : "mt-1"
        }`}
        style={labelStyle}
      >
        {text}
      </div>
    );
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    height,
    backgroundColor,
    borderRadius: rounded ? height / 2 : 0,
    overflow: "hidden",
    position: "relative",
  };

  return (
    <div className={`w-full ${className}`}>
      {(labelPosition === "top" || labelPosition === "outside") &&
        renderLabel()}

      <div style={containerStyle}>
        <div style={getProgressBarStyle()} />
        {labelPosition === "inside" && renderLabel()}
      </div>

      {labelPosition === "bottom" && renderLabel()}
    </div>
  );
};

export default ProgressBar;
