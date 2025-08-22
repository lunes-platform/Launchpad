import React, { useState, useRef } from "react";

export interface HoverGlowProps {
  /** Filhos a serem envolvidos pelo efeito */
  children: React.ReactNode;
  /** Cor do brilho */
  glowColor?: string;
  /** Intensidade do brilho (0-1) */
  intensity?: number;
  /** Tamanho do brilho em pixels */
  glowSize?: number;
  /** Duração da transição em milissegundos */
  duration?: number;
  /** Se o efeito deve ser habilitado */
  disabled?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Se deve seguir o cursor do mouse */
  followCursor?: boolean;
  /** Offset do brilho em relação ao cursor */
  cursorOffset?: { x: number; y: number };
}

/**
 * Componente que adiciona efeito de brilho no hover
 *
 * @example
 * <HoverGlow glowColor="#3b82f6" intensity={0.8} followCursor>
 *   <div className="p-4 bg-gray-800 rounded">
 *     Passe o mouse aqui
 *   </div>
 * </HoverGlow>
 */
export const HoverGlow: React.FC<HoverGlowProps> = ({
  children,
  glowColor = "#3b82f6",
  intensity = 0.6,
  glowSize = 100,
  duration = 300,
  disabled = false,
  className = "",
  followCursor = false,
  cursorOffset = { x: 0, y: 0 },
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!followCursor || disabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left + cursorOffset.x,
      y: event.clientY - rect.top + cursorOffset.y,
    });
  };

  const getGlowStyle = (): React.CSSProperties => {
    if (disabled) return {};

    const baseStyle: React.CSSProperties = {
      position: "relative",
      transition: `all ${duration}ms ease-out`,
    };

    if (!isHovered || followCursor) return baseStyle;

    const glowOpacity = intensity;
    const blur = glowSize / 4;

    return {
      ...baseStyle,
      boxShadow: `0 0 ${glowSize}px ${glowColor}${Math.round(glowOpacity * 255)
        .toString(16)
        .padStart(2, "0")}`,
      filter: `drop-shadow(0 0 ${blur}px ${glowColor}${Math.round(
        glowOpacity * 255,
      )
        .toString(16)
        .padStart(2, "0")})`,
    };
  };

  // Para o efeito de cursor, precisamos usar um pseudo-elemento via CSS dinâmico
  const injectCursorGlowStyles = () => {
    if (!followCursor || !isHovered) return null;

    const styleId = `hover-glow-cursor-${glowSize}-${duration}`;
    if (document.getElementById(styleId)) return null;

    const glowOpacity = Math.round(intensity * 255)
      .toString(16)
      .padStart(2, "0");
    const blur = glowSize / 4;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .hover-glow-cursor::before {
        content: '';
        position: absolute;
        width: ${glowSize}px;
        height: ${glowSize}px;
        background: radial-gradient(circle, ${glowColor}${glowOpacity} 0%, transparent 70%);
        border-radius: 50%;
        filter: blur(${blur}px);
        pointer-events: none;
        z-index: -1;
        transition: opacity ${duration}ms ease-out;
        opacity: ${isHovered ? 1 : 0};
      }
    `;
    document.head.appendChild(style);
  };

  React.useEffect(() => {
    if (followCursor) {
      injectCursorGlowStyles();
    }
  }, [followCursor, isHovered, glowSize, glowColor, intensity, duration]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
    ...(!followCursor
      ? getGlowStyle()
      : {
          transition: `all ${duration}ms ease-out`,
        }),
  };

  const glowElementStyle: React.CSSProperties =
    followCursor && isHovered
      ? {
          position: "absolute",
          left: mousePosition.x - glowSize / 2,
          top: mousePosition.y - glowSize / 2,
          width: glowSize,
          height: glowSize,
          background: `radial-gradient(circle, ${glowColor}${Math.round(
            intensity * 255,
          )
            .toString(16)
            .padStart(2, "0")} 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: `blur(${glowSize / 4}px)`,
          pointerEvents: "none",
          zIndex: -1,
          transition: `opacity ${duration}ms ease-out`,
          opacity: 1,
        }
      : { opacity: 0 };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden transition-all duration-300 ease-out hover:shadow-lg dark:hover:shadow-roxo-500/20 ${className}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {followCursor && (
        <div
          style={glowElementStyle}
          className={`absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none bg-gradient-radial from-white/30 via-white/10 to-transparent dark:from-grafite-300/30 dark:via-grafite-300/10 dark:to-transparent ${isHovered ? "opacity-100" : ""}`}
        />
      )}
      {children}
    </div>
  );
};

export default HoverGlow;
