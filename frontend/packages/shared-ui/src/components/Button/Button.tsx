import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";
export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary:
    "bg-roxo hover:bg-roxo-700 text-white border-transparent shadow-lg hover:shadow-xl",
  secondary:
    "bg-grafite-700 hover:bg-grafite-600 text-white border-transparent shadow-md hover:shadow-lg",
  outline:
    "bg-transparent hover:bg-grafite-800 text-grafite-100 border-grafite-600 hover:border-grafite-500 hover:text-white",
  ghost:
    "bg-transparent hover:bg-grafite-800 text-grafite-200 hover:text-white border-transparent",
  destructive:
    "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-md hover:shadow-lg",
};

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
  icon: "h-10 w-10",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    const baseClasses = cn(
      "btn-base",
      "inline-flex items-center justify-center gap-2",
      "font-medium rounded-lg border",
      "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-roxo-500 focus:ring-offset-grafite-900",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "transition-all duration-200 ease-in-out",
      "hover:scale-105 active:scale-95",
      buttonVariants[variant],
      buttonSizes[size],
      fullWidth && "w-full",
      className,
    );

    return (
      <button
        ref={ref}
        className={baseClasses}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
