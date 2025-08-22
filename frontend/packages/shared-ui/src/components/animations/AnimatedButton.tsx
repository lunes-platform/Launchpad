import React, { useState } from "react";
import { cn } from "../../utils/cn";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  ripple?: boolean;
  bounce?: boolean;
}

/**
 * Botão com animações e microinterações
 * Implementa feedback visual avançado para melhor UX
 */
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  ripple = true,
  bounce = false,
  disabled,
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const baseClasses = [
    "relative",
    "inline-flex",
    "items-center",
    "justify-center",
    "font-medium",
    "rounded-lg",
    "transition-all",
    "duration-200",
    "ease-out",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "active:scale-95",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "overflow-hidden",
  ];

  const variantClasses = {
    primary: [
      "bg-roxo-600",
      "text-white",
      "hover:bg-roxo-700",
      "focus:ring-roxo-500",
      "shadow-lg",
      "hover:shadow-xl",
    ],
    secondary: [
      "bg-grafite-600",
      "text-white",
      "hover:bg-grafite-700",
      "focus:ring-grafite-500",
      "shadow-lg",
      "hover:shadow-xl",
    ],
    outline: [
      "border-2",
      "border-roxo-600",
      "text-roxo-400",
      "hover:bg-grafite-700",
      "focus:ring-roxo-500",
      "hover:border-roxo-500",
    ],
    ghost: [
      "text-grafite-200",
      "hover:bg-grafite-700",
      "focus:ring-grafite-500",
    ],
  };

  const sizeClasses = {
    sm: ["px-3", "py-1.5", "text-sm"],
    md: ["px-4", "py-2", "text-base"],
    lg: ["px-6", "py-3", "text-lg"],
  };

  const bounceClasses = bounce ? ["hover:animate-bounce"] : [];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };

      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }

    // Press animation
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);

    onClick?.(e);
  };

  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    bounceClasses,
    {
      "transform scale-95": isPressed,
      "cursor-wait": loading,
    },
    className,
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Button content */}
      <span
        className={cn("transition-opacity duration-200", {
          "opacity-0": loading,
          "opacity-100": !loading,
        })}
      >
        {children}
      </span>

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white dark:bg-grafite-300 bg-opacity-30 dark:bg-opacity-20 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: "600ms",
            animationFillMode: "forwards",
          }}
        />
      ))}
    </button>
  );
};

export default AnimatedButton;
