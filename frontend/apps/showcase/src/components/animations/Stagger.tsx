import React, {
  useEffect,
  useState,
  useRef,
  Children,
  cloneElement,
  isValidElement,
} from "react";

export interface StaggerProps {
  /** Filhos a serem animados */
  children: React.ReactNode;
  /** Delay entre cada elemento em milissegundos */
  staggerDelay?: number;
  /** Delay inicial antes de começar a sequência */
  initialDelay?: number;
  /** Duração da animação de cada elemento */
  duration?: number;
  /** Direção da animação */
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
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
  /** Função de easing personalizada */
  easing?: string;
}

/**
 * Componente para animar múltiplos elementos com delay escalonado
 *
 * @example
 * <Stagger staggerDelay={100} direction="up" distance={20}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stagger>
 */
export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 100,
  initialDelay = 0,
  duration = 600,
  direction = "up",
  distance = 20,
  triggerOnce = true,
  threshold = 0.1,
  className = "",
  animate = true,
  easing = "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
          }, initialDelay);
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      { threshold },
    );

    const currentElement = containerRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [initialDelay, triggerOnce, threshold, hasTriggered, animate]);

  const getInitialTransform = () => {
    if (!animate) return "translate3d(0, 0, 0) scale(1)";

    switch (direction) {
      case "up":
        return `translate3d(0, ${distance}px, 0) scale(1)`;
      case "down":
        return `translate3d(0, -${distance}px, 0) scale(1)`;
      case "left":
        return `translate3d(${distance}px, 0, 0) scale(1)`;
      case "right":
        return `translate3d(-${distance}px, 0, 0) scale(1)`;
      case "scale":
        return "translate3d(0, 0, 0) scale(0.8)";
      case "fade":
      default:
        return "translate3d(0, 0, 0) scale(1)";
    }
  };

  const getFinalTransform = () => {
    return "translate3d(0, 0, 0) scale(1)";
  };

  const childrenArray = Children.toArray(children);

  return (
    <div ref={containerRef} className={className}>
      {childrenArray.map((child, index) => {
        if (!isValidElement(child)) return child;

        const animationDelay = isVisible ? index * staggerDelay : 0;
        const shouldAnimate = animate && isVisible;

        const animationStyle: React.CSSProperties = {
          opacity: animate ? (shouldAnimate ? 1 : 0) : 1,
          transform: shouldAnimate
            ? getFinalTransform()
            : getInitialTransform(),
          transition: animate
            ? `opacity ${duration}ms ${easing} ${animationDelay}ms, transform ${duration}ms ${easing} ${animationDelay}ms`
            : "none",
          willChange: animate ? "opacity, transform" : "auto",
        };

        return cloneElement(child as React.ReactElement<any>, {
          key: index,
          style: {
            ...(child.props as any)?.style,
            ...animationStyle,
          },
        });
      })}
    </div>
  );
};

export default Stagger;
