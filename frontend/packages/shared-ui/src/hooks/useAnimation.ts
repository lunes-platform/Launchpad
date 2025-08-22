import { useState, useEffect } from "react";

/**
 * Hook para controlar animações baseadas em CSS
 * Alternativa robusta ao Framer Motion para casos simples
 */
export const useAnimation = ({
  duration = 300,
  delay = 0,
  easing = "ease-out",
} = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const trigger = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(true);
    }, delay);

    setTimeout(() => {
      setIsAnimating(false);
    }, delay + duration);
  };

  const reset = () => {
    setIsVisible(false);
    setIsAnimating(false);
  };

  useEffect(() => {
    trigger();
  }, []);

  const getTransitionStyle = () => ({
    transition: `all ${duration}ms ${easing}`,
    transitionDelay: `${delay}ms`,
  });

  return {
    isVisible,
    isAnimating,
    trigger,
    reset,
    getTransitionStyle,
  };
};

/**
 * Hook para animações de entrada com intersection observer
 */
export const useInViewAnimation = ({
  threshold = 0.1,
  rootMargin = "0px",
  duration = 600,
  delay = 0,
} = {}) => {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsInView(true);
            setHasAnimated(true);
          }, delay);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, delay, hasAnimated]);

  const getAnimationStyle = (
    variant:
      | "fadeIn"
      | "slideUp"
      | "slideDown"
      | "slideLeft"
      | "slideRight"
      | "scale" = "fadeIn",
  ) => {
    const baseStyle = {
      transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transitionDelay: `${delay}ms`,
    };

    if (!isInView) {
      switch (variant) {
        case "fadeIn":
          return { ...baseStyle, opacity: 0 };
        case "slideUp":
          return { ...baseStyle, opacity: 0, transform: "translateY(20px)" };
        case "slideDown":
          return { ...baseStyle, opacity: 0, transform: "translateY(-20px)" };
        case "slideLeft":
          return { ...baseStyle, opacity: 0, transform: "translateX(20px)" };
        case "slideRight":
          return { ...baseStyle, opacity: 0, transform: "translateX(-20px)" };
        case "scale":
          return { ...baseStyle, opacity: 0, transform: "scale(0.8)" };
        default:
          return { ...baseStyle, opacity: 0 };
      }
    }

    return {
      ...baseStyle,
      opacity: 1,
      transform: "translateX(0) translateY(0) scale(1)",
    };
  };

  return {
    ref: setRef,
    isInView,
    hasAnimated,
    getAnimationStyle,
  };
};

export default useAnimation;
