import React, { useState } from "react";
import { cn } from "../../utils/cn";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  tilt?: boolean;
  scale?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
}

/**
 * Card animado com efeitos hover avançados
 * Implementa microinterações para melhor feedback visual
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className,
  hover = true,
  glow = false,
  tilt = false,
  scale = true,
  shadow = "md",
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const baseClasses = [
    "relative",
    "bg-grafite-800",
    "rounded-xl",
    "border",
    "border-grafite-600",
    "transition-all",
    "duration-300",
    "ease-out",
    "overflow-hidden",
  ];

  const shadowClasses = {
    none: [],
    sm: ["shadow-sm"],
    md: ["shadow-md", hover ? "hover:shadow-lg" : ""],
    lg: ["shadow-lg", hover ? "hover:shadow-xl" : ""],
    xl: ["shadow-xl", hover ? "hover:shadow-2xl" : ""],
  };

  const hoverClasses = hover
    ? [
        "hover:border-roxo-500",
        scale ? "hover:scale-105" : "",
        "cursor-pointer",
      ]
    : [];

  const glowClasses =
    glow && isHovered ? ["ring-2", "ring-roxo-500", "ring-opacity-40"] : [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const getTiltStyle = () => {
    if (!tilt || !isHovered) return {};

    const rect = { width: 300, height: 200 }; // Approximate card size
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((mousePosition.y - centerY) / centerY) * -10;
    const rotateY = ((mousePosition.x - centerX) / centerX) * 10;

    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
      transformStyle: "preserve-3d" as const,
    };
  };

  const cardClasses = cn(
    baseClasses,
    shadowClasses[shadow],
    hoverClasses,
    glowClasses,
    className,
  );

  return (
    <div
      className={cardClasses}
      style={getTiltStyle()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
    >
      {/* Gradient overlay for glow effect */}
      {glow && (
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300",
            "bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10",
            {
              "opacity-100": isHovered,
            },
          )}
        />
      )}

      {/* Shine effect */}
      {hover && (
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-all duration-500",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "transform -skew-x-12 -translate-x-full",
            {
              "opacity-100 translate-x-full": isHovered,
            },
          )}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AnimatedCard;
