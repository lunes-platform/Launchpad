import React, { forwardRef } from "react";
import { cn } from "../../utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const selectClasses = cn(
      "w-full px-3 py-2 text-sm",
      "bg-white dark:bg-grafite-800",
      "border border-gray-300 dark:border-grafite-600",
      "rounded-lg",
      "focus:outline-none focus:ring-2 focus:ring-roxo-500 focus:border-transparent",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "transition-colors duration-200",
      error
        ? "border-red-500 focus:ring-red-500"
        : "hover:border-gray-400 dark:hover:border-grafite-500",
      className,
    );

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-grafite-200">
            {label}
          </label>
        )}
        <div className="relative">
          <select ref={ref} className={selectClasses} disabled={disabled} {...props}>
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-grafite-400">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";