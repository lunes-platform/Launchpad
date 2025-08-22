import React from "react";
import { cn } from "../../utils/cn";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700",
  secondary: "bg-grafite-700 text-white hover:bg-grafite-600",
  outline: "border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white",
  ghost: "text-grafite-300 hover:text-white hover:bg-grafite-700",
  danger: "bg-red-600 text-white hover:bg-red-700"
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg"
};

const LoadingSpinner = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
);

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className,
  onClick,
  disabled,
  ...props
}) => {
  const buttonClasses = cn(
    "relative overflow-hidden rounded-lg font-medium transition-all duration-200 ease-in-out",
    "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
    "active:scale-95 transform",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner />
        </span>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
};

export default AnimatedButton;