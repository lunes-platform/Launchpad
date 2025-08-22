import React from "react";

export interface LoadingSpinnerProps {
  /** Tamanho do spinner */
  size?: "sm" | "md" | "lg" | "xl" | number;
  /** Cor do spinner */
  color?: string;
  /** Tipo de animação */
  variant?: "spin" | "pulse" | "bounce" | "dots" | "bars" | "ring";
  /** Velocidade da animação em milissegundos */
  speed?: number;
  /** Classe CSS adicional */
  className?: string;
  /** Texto de carregamento */
  label?: string;
  /** Se deve mostrar o texto */
  showLabel?: boolean;
}

/**
 * Componente de spinner de carregamento com múltiplas variações
 *
 * @example
 * <LoadingSpinner size="lg" variant="ring" color="#3b82f6" label="Carregando..." />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "#3b82f6",
  variant = "spin",
  speed = 1000,
  className = "",
  label = "Carregando...",
  showLabel = false,
}) => {
  const getSizeValue = () => {
    if (typeof size === "number") return size;

    const sizeMap = {
      sm: 16,
      md: 24,
      lg: 32,
      xl: 48,
    };
    return sizeMap[size];
  };

  const sizeValue = getSizeValue();

  // Injetar keyframes CSS dinamicamente
  React.useEffect(() => {
    const keyframeId = `loading-spinner-keyframes-${variant}-${speed}`;
    if (document.getElementById(keyframeId)) return;

    let keyframes = "";

    switch (variant) {
      case "spin":
        keyframes = `
          @keyframes spin-${speed} {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `;
        break;
      case "pulse":
        keyframes = `
          @keyframes pulse-${speed} {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
          }
        `;
        break;
      case "bounce":
        keyframes = `
          @keyframes bounce-${speed} {
            0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
            40%, 43% { transform: translate3d(0,-30px,0); }
            70% { transform: translate3d(0,-15px,0); }
            90% { transform: translate3d(0,-4px,0); }
          }
        `;
        break;
      case "dots":
        keyframes = `
          @keyframes dots-${speed} {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `;
        break;
      case "bars":
        keyframes = `
          @keyframes bars-${speed} {
            0%, 40%, 100% { transform: scaleY(0.4); }
            20% { transform: scaleY(1); }
          }
        `;
        break;
      case "ring":
        keyframes = `
          @keyframes ring-${speed} {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `;
        break;
    }

    const style = document.createElement("style");
    style.id = keyframeId;
    style.textContent = keyframes;
    document.head.appendChild(style);
  }, [variant, speed]);

  const renderSpinner = () => {
    const baseStyle: React.CSSProperties = {
      display: "inline-block",
      color,
    };

    switch (variant) {
      case "spin":
        return (
          <div
            style={{
              ...baseStyle,
              width: sizeValue,
              height: sizeValue,
              border: `${Math.max(2, sizeValue / 8)}px solid ${color}20`,
              borderTop: `${Math.max(2, sizeValue / 8)}px solid ${color}`,
              borderRadius: "50%",
              animation: `spin-${speed} ${speed}ms linear infinite`,
            }}
          />
        );

      case "pulse":
        return (
          <div
            style={{
              ...baseStyle,
              width: sizeValue,
              height: sizeValue,
              backgroundColor: color,
              borderRadius: "50%",
              animation: `pulse-${speed} ${speed}ms ease-in-out infinite`,
            }}
          />
        );

      case "bounce":
        return (
          <div
            style={{
              ...baseStyle,
              width: sizeValue / 4,
              height: sizeValue / 4,
              backgroundColor: color,
              borderRadius: "50%",
              animation: `bounce-${speed} ${speed}ms ease-in-out infinite`,
            }}
          />
        );

      case "dots":
        return (
          <div style={{ ...baseStyle, display: "flex", gap: sizeValue / 8 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: sizeValue / 4,
                  height: sizeValue / 4,
                  backgroundColor: color,
                  borderRadius: "50%",
                  animation: `dots-${speed} ${speed}ms ease-in-out infinite`,
                  animationDelay: `${i * (speed / 6)}ms`,
                }}
              />
            ))}
          </div>
        );

      case "bars":
        return (
          <div
            style={{
              ...baseStyle,
              display: "flex",
              gap: sizeValue / 12,
              alignItems: "center",
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: sizeValue / 8,
                  height: sizeValue,
                  backgroundColor: color,
                  animation: `bars-${speed} ${speed}ms ease-in-out infinite`,
                  animationDelay: `${i * (speed / 10)}ms`,
                }}
              />
            ))}
          </div>
        );

      case "ring":
        return (
          <div
            style={{
              ...baseStyle,
              width: sizeValue,
              height: sizeValue,
              border: `${Math.max(2, sizeValue / 8)}px solid transparent`,
              borderTop: `${Math.max(2, sizeValue / 8)}px solid ${color}`,
              borderRight: `${Math.max(2, sizeValue / 8)}px solid ${color}`,
              borderRadius: "50%",
              animation: `ring-${speed} ${speed}ms linear infinite`,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {renderSpinner()}
      {showLabel && label && (
        <span className="text-sm font-medium" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
