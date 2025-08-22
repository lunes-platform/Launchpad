import React, { forwardRef, useState } from "react";

export type InputVariant = "default" | "filled" | "outline";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  size?: InputSize;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  showPasswordToggle?: boolean;
}

const inputVariants = {
  default: "border-grafite-600 focus:border-roxo-500 focus:ring-roxo-500",
  filled:
    "bg-grafite-700 border-transparent focus:bg-grafite-600 focus:border-roxo-500 focus:ring-roxo-500",
  outline: "border-2 border-grafite-600 focus:border-roxo-500 focus:ring-0",
};

const inputSizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const labelSizes = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = "default",
      size = "md",
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      showPasswordToggle = false,
      className,
      type = "text",
      id,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;
    const hasError = Boolean(error);

    const containerClasses = `relative ${fullWidth ? "w-full" : ""}`;

    const labelClasses = `block font-medium text-grafite-200 mb-1 ${labelSizes[size]} ${hasError ? "text-red-400" : ""}`;

    const inputClasses = `
      input-base block w-full rounded-lg border
      bg-grafite-800 text-grafite-100
      focus:outline-none focus:ring-1
      disabled:bg-grafite-700 disabled:text-grafite-400 disabled:cursor-not-allowed
      placeholder:text-grafite-400
      transition-all duration-200 ease-in-out
      ${inputVariants[variant]}
      ${inputSizes[size]}
      ${leftIcon ? "pl-10" : ""}
      ${rightIcon || (isPassword && showPasswordToggle) ? "pr-10" : ""}
      ${hasError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
      ${className || ""}
    `
      .replace(/\s+/g, " ")
      .trim();

    const iconClasses =
      "absolute top-1/2 transform -translate-y-1/2 text-grafite-400";
    const leftIconClasses = `${iconClasses} left-3`;
    const rightIconClasses = `${iconClasses} right-3`;

    const errorClasses = "mt-1 text-sm text-red-400";
    const helperClasses = "mt-1 text-sm text-grafite-400";

    return (
      <div className={containerClasses}>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && <div className={leftIconClasses}>{leftIcon}</div>}

          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClasses}
            {...props}
          />

          {isPassword && showPasswordToggle && (
            <button
              type="button"
              className={`${rightIconClasses} cursor-pointer hover:text-grafite-200`}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}

          {!isPassword && rightIcon && (
            <div className={rightIconClasses}>{rightIcon}</div>
          )}
        </div>

        {hasError && (
          <div className={errorClasses}>
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {!hasError && helperText && (
          <div className={helperClasses}>{helperText}</div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
