import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme: Theme = "dark"; // Força o tema escuro

  // Aplica o tema ao documento
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("dark");
    // Garante que a classe 'light' seja removida caso exista
    root.classList.remove("light");
  }, []);

  // Funções vazias para manter a compatibilidade do contexto
  const toggleTheme = () => {};
  const setTheme = (_newTheme: Theme) => {};

  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
