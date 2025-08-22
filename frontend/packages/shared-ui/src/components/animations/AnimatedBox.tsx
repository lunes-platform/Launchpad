import React from "react";
import { useInViewAnimation } from "../../hooks/useAnimation";
import { cn } from "../../utils/cn";

interface AnimatedBoxProps {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale";
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Componente de animação baseado em CSS transitions
 * Alternativa robusta ao Framer Motion com Intersection Observer
 */
export const AnimatedBox: React.FC<AnimatedBoxProps> = ({
  children,
  className,
  variant = "fadeIn",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
}) => {
  const { ref, getAnimationStyle } = useInViewAnimation({
    threshold,
    rootMargin,
    duration,
    delay,
  });

  return (
    <div ref={ref} className={cn(className)} style={getAnimationStyle(variant)}>
      {children}
    </div>
  );
};

export default AnimatedBox;
