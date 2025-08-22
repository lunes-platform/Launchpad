import React from "react";

export type CardVariant = "default" | "elevated" | "outlined" | "filled";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  clickable?: boolean;
  fullWidth?: boolean;
}

const cardVariants = {
  default: "bg-grafite-800 border border-grafite-700",
  elevated: "bg-grafite-800 shadow-lg shadow-grafite-900/50 border-0",
  outlined: "bg-grafite-800 border-2 border-grafite-600",
  filled: "bg-grafite-700 border border-grafite-600",
};

const cardPadding = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      children,
      header,
      footer,
      hoverable = false,
      clickable = false,
      fullWidth = false,
      className,
      ...props
    },
    ref,
  ) => {
    const cardClasses = cn(
      "card-base",
      "rounded-lg transition-all duration-200 ease-in-out",
      cardVariants[variant],
      hoverable && "hover:shadow-md hover:scale-105",
      clickable && "cursor-pointer active:scale-95",
      fullWidth && "w-full",
      className,
    );

    const contentClasses = cn(cardPadding[padding]);

    return (
      <div ref={ref} className={cardClasses} {...props}>
        {header && (
          <div className="border-b border-grafite-600 px-6 py-4 text-white">
            {header}
          </div>
        )}

        <div className={contentClasses}>{children}</div>

        {footer && (
          <div className="border-t border-grafite-600 px-6 py-4 bg-grafite-700 text-grafite-200">
            {footer}
          </div>
        )}
      </div>
    );
  },
);

Card.displayName = "Card";
