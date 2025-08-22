import React, { useEffect, useState, useRef } from "react";

export interface FadeInProps {
  /** Filhos a serem animados */
  children: React.ReactNode;
  /** Duração da animação em milissegundos */
  duration?: number;
  /** Delay antes de iniciar a animação em milissegundos */
  delay?: number;
  /** Direção da animação */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distância do movimento em pixels */
  distance?: number;
  /** Se deve animar apenas quando o elemento entra na viewport */
  triggerOnce?: boolean;
  /** Threshold para trigger da animação (0-1) */
  threshold?: number;
  /** Classe CSS adicional */
  className?: string;
  /** Se a animação deve ser executada */
  animate?: boolean;
}

/**
 * Componente para animação de fade-in com movimento opcional
 *
 * @example
 * <FadeIn direction="up" distance={20} delay={200}>
 *   <div>Conteúdo que será animado</div>
 * </FadeIn>
 */
export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = 600,
  delay = 0,
  direction = "none",
  distance = 20,
  triggerOnce = true,
  threshold = 0.1,
  className = "",
  animate = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
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

  const getTransform = () => {
    if (!animate || isVisible) return "translate3d(0, 0, 0)";

    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0)`;
      case "down":
        return `translate3d(0, -${distance}px, 0)`;
      case "left":
        return `translate3d(${distance}px, 0, 0)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0)`;
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  const animationStyle: React.CSSProperties = {
    opacity: animate ? (isVisible ? 1 : 0) : 1,
    transform: getTransform(),
    transition: animate
      ? `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
      : "none",
    willChange: animate ? "opacity, transform" : "auto",
  };

  return (
    <div ref={elementRef} className={className} style={animationStyle}>
      {children}
    </div>
  );
};

export default FadeIn;
