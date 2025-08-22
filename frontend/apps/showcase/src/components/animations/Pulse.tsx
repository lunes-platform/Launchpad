import React, { useEffect, useState } from "react";

export interface PulseProps {
  /** Filhos a serem animados */
  children: React.ReactNode;
  /** Duração de um ciclo completo de pulsação em milissegundos */
  duration?: number;
  /** Escala mínima durante a pulsação */
  minScale?: number;
  /** Escala máxima durante a pulsação */
  maxScale?: number;
  /** Opacidade mínima durante a pulsação */
  minOpacity?: number;
  /** Opacidade máxima durante a pulsação */
  maxOpacity?: number;
  /** Número de pulsações (-1 para infinito) */
  iterations?: number;
  /** Delay antes de iniciar a animação */
  delay?: number;
  /** Se a animação deve ser executada */
  animate?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Função de easing personalizada */
  easing?: string;
  /** Se deve pausar a animação no hover */
  pauseOnHover?: boolean;
}

/**
 * Componente para animação de pulsação
 *
 * @example
 * <Pulse duration={2000} minScale={0.95} maxScale={1.05}>
 *   <button>Botão com pulsação</button>
 * </Pulse>
 */
export const Pulse: React.FC<PulseProps> = ({
  children,
  duration = 2000,
  minScale = 1,
  maxScale = 1.05,
  minOpacity = 1,
  maxOpacity = 1,
  iterations = -1,
  delay = 0,
  animate = true,
  className = "",
  easing = "ease-in-out",
  pauseOnHover = false,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

  useEffect(() => {
    if (animate && delay > 0) {
      const timer = setTimeout(() => {
        setAnimationStarted(true);
      }, delay);

      return () => clearTimeout(timer);
    } else if (animate) {
      setAnimationStarted(true);
    }
  }, [animate, delay]);

  const getAnimationStyle = (): React.CSSProperties => {
    if (!animate || !animationStarted) {
      return {};
    }

    const scaleKeyframes = `
      @keyframes pulse-scale-${duration} {
        0%, 100% { transform: scale(${minScale}); }
        50% { transform: scale(${maxScale}); }
      }
    `;

    const opacityKeyframes = `
      @keyframes pulse-opacity-${duration} {
        0%, 100% { opacity: ${minOpacity}; }
        50% { opacity: ${maxOpacity}; }
      }
    `;

    // Injetar keyframes no documento se ainda não existirem
    const styleId = `pulse-keyframes-${duration}`;
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = scaleKeyframes + opacityKeyframes;
      document.head.appendChild(style);
    }

    const animationCount =
      iterations === -1 ? "infinite" : iterations.toString();
    const animationPlayState = isPaused ? "paused" : "running";

    return {
      animation: `
        pulse-scale-${duration} ${duration}ms ${easing} ${animationCount} ${animationPlayState},
        pulse-opacity-${duration} ${duration}ms ${easing} ${animationCount} ${animationPlayState}
      `
        .replace(/\s+/g, " ")
        .trim(),
      willChange: "transform, opacity",
    };
  };

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  return (
    <div
      className={className}
      style={getAnimationStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default Pulse;
