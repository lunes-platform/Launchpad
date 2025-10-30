import React from "react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const badgeVariants = {
  default:
    "bg-gray-200 dark:bg-grafite-700 text-gray-900 dark:text-grafite-100 border-gray-300 dark:border-grafite-600 font-semibold",
  primary: "bg-roxo-claro text-white border-roxo-claro font-semibold",
  secondary: "bg-grafite-claro text-white border-grafite-claro font-semibold",
  success: "bg-verde-claro text-white border-verde-claro font-semibold",
  warning: "bg-laranja-claro text-white border-laranja-claro font-semibold",
  error:
    "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800 font-semibold",
  info: "bg-roxo-claro text-white border-roxo-claro font-semibold",
};

const badgeSizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-2 text-base",
};

/**
 * Componente Badge para exibir status, categorias ou informações destacadas
 */
export function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
  ...props
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center font-medium rounded-full border";
  const variantClasses = badgeVariants[variant];
  const sizeClasses = badgeSizes[size];

  const combinedClasses =
    `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  return (
    <span className={combinedClasses} {...props}>
      {children}
    </span>
  );
}
