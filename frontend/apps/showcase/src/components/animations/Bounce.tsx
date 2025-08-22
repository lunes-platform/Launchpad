import React, { useEffect, useState, useRef } from "react";

export interface BounceProps {
  /** Filhos a serem animados */
  children: React.ReactNode;
  /** Duração da animação em milissegundos */
  duration?: number;
  /** Altura do bounce em pixels */
  height?: number;
  /** Número de bounces (-1 para infinito) */
  iterations?: number;
  /** Delay antes de iniciar a animação */
  delay?: number;
  /** Se deve animar apenas quando o elemento entra na viewport */
  triggerOnce?: boolean;
  /** Threshold para trigger da animação (0-1) */
  threshold?: number;
  /** Se a animação deve ser executada */
  animate?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Função de easing personalizada */
  easing?: string;
  /** Se deve pausar a animação no hover */
  pauseOnHover?: boolean;
  /** Tipo de bounce */
  type?: "vertical" | "horizontal" | "scale";
}

/**
 * Componente para animação de bounce/rebote
 *
 * @example
 * <Bounce height={10} duration={1000} iterations={3}>
 *   <div>Elemento com bounce</div>
 * </Bounce>
 */
export const Bounce: React.FC<BounceProps> = ({
  children,
  duration = 1000,
  height = 20,
  iterations = 1,
  delay = 0,
  triggerOnce = true,
  threshold = 0.1,
  animate = true,
  className = "",
  easing = "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  pauseOnHover = false,
  type = "vertical",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasTriggered(true);
          }, delay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [delay, triggerOnce, threshold, hasTriggered, animate]);

  const getKeyframes = () => {
    const keyframeId = `bounce-${type}-${height}-${duration}`;

    let keyframes = "";
    switch (type) {
      case "vertical":
        keyframes = `
          @keyframes ${keyframeId} {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0, 0, 0);
            }
            40%, 43% {
              transform: translate3d(0, -${height}px, 0);
            }
            70% {
              transform: translate3d(0, -${height * 0.5}px, 0);
            }
            90% {
              transform: translate3d(0, -${height * 0.25}px, 0);
            }
          }
        `;
        break;
      case "horizontal":
        keyframes = `
          @keyframes ${keyframeId} {
            0%, 20%, 53%, 80%, 100% {
              transform: translate3d(0, 0, 0);
            }
            40%, 43% {
              transform: translate3d(-${height}px, 0, 0);
            }
            70% {
              transform: translate3d(-${height * 0.5}px, 0, 0);
            }
            90% {
              transform: translate3d(-${height * 0.25}px, 0, 0);
            }
          }
        `;
        break;
      case "scale":
        keyframes = `
          @keyframes ${keyframeId} {
            0%, 20%, 53%, 80%, 100% {
              transform: scale3d(1, 1, 1);
            }
            40%, 43% {
              transform: scale3d(1.1, 1.1, 1.1);
            }
            70% {
              transform: scale3d(1.05, 1.05, 1.05);
            }
            90% {
              transform: scale3d(1.02, 1.02, 1.02);
            }
          }
        `;
        break;
    }

    return { keyframeId, keyframes };
  };

  const getAnimationStyle = (): React.CSSProperties => {
    if (!animate || !isVisible) {
      return {};
    }

    const { keyframeId, keyframes } = getKeyframes();

    // Injetar keyframes no documento se ainda não existirem
    if (!document.getElementById(keyframeId)) {
      const style = document.createElement("style");
      style.id = keyframeId;
      style.textContent = keyframes;
      document.head.appendChild(style);
    }

    const animationCount =
      iterations === -1 ? "infinite" : iterations.toString();
    const animationPlayState = isPaused ? "paused" : "running";

    return {
      animation: `${keyframeId} ${duration}ms ${easing} ${animationCount} ${animationPlayState}`,
      willChange: "transform",
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
      ref={elementRef}
      className={className}
      style={getAnimationStyle()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default Bounce;
