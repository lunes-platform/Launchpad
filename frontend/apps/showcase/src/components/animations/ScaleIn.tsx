import React, { useEffect, useState, useRef } from "react";

export interface ScaleInProps {
  /** Filhos a serem animados */
  children: React.ReactNode;
  /** Duração da animação em milissegundos */
  duration?: number;
  /** Delay antes de iniciar a animação em milissegundos */
  delay?: number;
  /** Escala inicial (0-1) */
  initialScale?: number;
  /** Escala final (geralmente 1) */
  finalScale?: number;
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
  /** Origem da transformação */
  transformOrigin?: string;
}

/**
 * Componente para animação de scale-in
 *
 * @example
 * <ScaleIn initialScale={0.8} duration={500} delay={200}>
 *   <div>Conteúdo que será escalado</div>
 * </ScaleIn>
 */
export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  duration = 600,
  delay = 0,
  initialScale = 0.9,
  finalScale = 1,
  triggerOnce = true,
  threshold = 0.1,
  className = "",
  animate = true,
  easing = "cubic-bezier(0.34, 1.56, 0.64, 1)",
  transformOrigin = "center",
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

  const getScale = () => {
    if (!animate) return finalScale;
    return isVisible ? finalScale : initialScale;
  };

  const animationStyle: React.CSSProperties = {
    transform: `scale3d(${getScale()}, ${getScale()}, 1)`,
    transformOrigin,
    transition: animate ? `transform ${duration}ms ${easing}` : "none",
    willChange: animate ? "transform" : "auto",
  };

  return (
    <div ref={elementRef} className={className} style={animationStyle}>
      {children}
    </div>
  );
};

export default ScaleIn;
