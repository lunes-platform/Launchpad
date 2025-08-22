import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Button,
  type ButtonVariant,
  type ButtonSize,
} from "@launchpad/shared-ui";

interface ThemeToggleProps {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}

/**
 * Componente para alternar entre tema claro e escuro
 * Utiliza o contexto de tema para gerenciar o estado global
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  size = "md",
  variant = "ghost",
}) => {
  const { theme, toggleTheme } = useTheme();

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`
        relative overflow-hidden transition-all duration-300
        hover:bg-neutral-100 dark:hover:bg-neutral-800
        ${className}
      `}
      aria-label={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
      title={`Alternar para tema ${theme === "light" ? "escuro" : "claro"}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Ícone do Sol (tema claro) */}
        <Sun
          size={iconSize}
          className={`
            absolute transition-all duration-300 text-amber-500
            ${
              theme === "light"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 rotate-90 scale-75"
            }
          `}
        />

        {/* Ícone da Lua (tema escuro) */}
        <Moon
          size={iconSize}
          className={`
            absolute transition-all duration-300 text-blue-400
            ${
              theme === "dark"
                ? "opacity-100 rotate-0 scale-100"
                : "opacity-0 -rotate-90 scale-75"
            }
          `}
        />
      </div>
    </Button>
  );
};

export default ThemeToggle;
