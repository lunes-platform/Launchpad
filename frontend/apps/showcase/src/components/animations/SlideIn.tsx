import React, { useEffect, useState, useRef } from "react";

export interface SlideInProps {
  /** Filhos a serem animados */
  children: React.ReactNode;
  /** Duração da animação em milissegundos */
  duration?: number;
  /** Delay antes de iniciar a animação em milissegundos */
  delay?: number;
  /** Direção do slide */
  direction: "left" | "right" | "up" | "down";
  /** Distância do slide em pixels */
  distance?: number;
  /** Se deve animar apenas quando o elemento entra na viewport */
  triggerOnce?: boolean;
  /** Threshold para trigger da animação (0-1) */
  threshold?: number;
  /** Classe CSS adicional */
  className?: string;
  /** Se a animação deve ser executada */
  animate?: boolean;
  /** Função de easing personalizada */
  easing?: string;
}

/**
 * Componente para animação de slide-in
 *
 * @example
 * <SlideIn direction="left" distance={100} delay={300}>
 *   <div>Conteúdo que deslizará da esquerda</div>
 * </SlideIn>
 */
export const SlideIn: React.FC<SlideInProps> = ({
  children,
  duration = 800,
  delay = 0,
  direction,
  distance = 100,
  triggerOnce = true,
  threshold = 0.1,
  className = "",
  animate = true,
  easing = "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
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

  const getInitialTransform = () => {
    if (!animate || isVisible) return "translate3d(0, 0, 0)";

    switch (direction) {
      case "left":
        return `translate3d(-${distance}px, 0, 0)`;
      case "right":
        return `translate3d(${distance}px, 0, 0)`;
      case "up":
        return `translate3d(0, -${distance}px, 0)`;
      case "down":
        return `translate3d(0, ${distance}px, 0)`;
      default:
        return "translate3d(0, 0, 0)";
    }
  };

  const animationStyle: React.CSSProperties = {
    transform: getInitialTransform(),
    transition: animate ? `transform ${duration}ms ${easing}` : "none",
    willChange: animate ? "transform" : "auto",
  };

  return (
    <div ref={elementRef} className={className} style={animationStyle}>
      {children}
    </div>
  );
};

export default SlideIn;
