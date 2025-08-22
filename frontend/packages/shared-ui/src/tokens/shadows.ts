/**
 * Design Tokens - Sistema de Sombras
 * Definições padronizadas para sombras e elevações da plataforma Launchpad
 */

// Sombras base para tema claro
export const lightShadows = {
  none: "none",
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
} as const;

// Sombras para tema escuro (mais sutis e com tons mais claros)
export const darkShadows = {
  none: "none",
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)",
} as const;

// Sombras coloridas para estados especiais
export const coloredShadows = {
  // Sombras da marca (roxo)
  brand: {
    light: "0 4px 14px 0 rgba(108, 56, 255, 0.15)",
    medium: "0 8px 25px 0 rgba(108, 56, 255, 0.25)",
    heavy: "0 12px 35px 0 rgba(108, 56, 255, 0.35)",
  },

  // Sombras de sucesso (verde)
  success: {
    light: "0 4px 14px 0 rgba(38, 208, 124, 0.15)",
    medium: "0 8px 25px 0 rgba(38, 208, 124, 0.25)",
    heavy: "0 12px 35px 0 rgba(38, 208, 124, 0.35)",
  },

  // Sombras de erro (vermelho)
  error: {
    light: "0 4px 14px 0 rgba(239, 68, 68, 0.15)",
    medium: "0 8px 25px 0 rgba(239, 68, 68, 0.25)",
    heavy: "0 12px 35px 0 rgba(239, 68, 68, 0.35)",
  },

  // Sombras de aviso (laranja)
  warning: {
    light: "0 4px 14px 0 rgba(254, 95, 0, 0.15)",
    medium: "0 8px 25px 0 rgba(254, 95, 0, 0.25)",
    heavy: "0 12px 35px 0 rgba(254, 95, 0, 0.35)",
  },

  // Sombras de informação (azul)
  info: {
    light: "0 4px 14px 0 rgba(59, 130, 246, 0.15)",
    medium: "0 8px 25px 0 rgba(59, 130, 246, 0.25)",
    heavy: "0 12px 35px 0 rgba(59, 130, 246, 0.35)",
  },
} as const;

// Sombras para componentes específicos
export const componentShadows = {
  // Cards
  card: {
    rest: lightShadows.sm,
    hover: lightShadows.md,
    active: lightShadows.xs,
    dark: {
      rest: darkShadows.sm,
      hover: darkShadows.md,
      active: darkShadows.xs,
    },
  },

  // Botões
  button: {
    rest: lightShadows.xs,
    hover: lightShadows.sm,
    active: lightShadows.inner,
    dark: {
      rest: darkShadows.xs,
      hover: darkShadows.sm,
      active: darkShadows.inner,
    },
  },

  // Modais e overlays
  modal: {
    backdrop: "rgba(0, 0, 0, 0.5)",
    content: lightShadows["2xl"],
    dark: {
      backdrop: "rgba(0, 0, 0, 0.7)",
      content: darkShadows["2xl"],
    },
  },

  // Dropdowns e menus
  dropdown: {
    light: lightShadows.lg,
    dark: darkShadows.lg,
  },

  // Tooltips
  tooltip: {
    light: lightShadows.md,
    dark: darkShadows.md,
  },

  // Navegação
  navigation: {
    light: lightShadows.sm,
    dark: darkShadows.sm,
  },

  // Inputs em foco
  input: {
    focus: {
      brand: "0 0 0 3px rgba(108, 56, 255, 0.1)",
      error: "0 0 0 3px rgba(239, 68, 68, 0.1)",
      success: "0 0 0 3px rgba(38, 208, 124, 0.1)",
    },
  },
} as const;

// Níveis de elevação (Material Design inspired)
export const elevation = {
  0: lightShadows.none,
  1: lightShadows.xs,
  2: lightShadows.sm,
  4: lightShadows.md,
  6: lightShadows.lg,
  8: lightShadows.xl,
  12: lightShadows["2xl"],
  16: "0 32px 64px -12px rgba(0, 0, 0, 0.25)",
  24: "0 40px 80px -12px rgba(0, 0, 0, 0.25)",
} as const;

// Elevação para tema escuro
export const darkElevation = {
  0: darkShadows.none,
  1: darkShadows.xs,
  2: darkShadows.sm,
  4: darkShadows.md,
  6: darkShadows.lg,
  8: darkShadows.xl,
  12: darkShadows["2xl"],
  16: "0 32px 64px -12px rgba(0, 0, 0, 0.6)",
  24: "0 40px 80px -12px rgba(0, 0, 0, 0.6)",
} as const;

// Exportação consolidada
export const shadows = {
  light: lightShadows,
  dark: darkShadows,
  colored: coloredShadows,
  component: componentShadows,
  elevation,
  darkElevation,
} as const;

// Tipos TypeScript
export type ShadowSize = keyof typeof lightShadows;
export type ColoredShadowType = keyof typeof coloredShadows;
export type ColoredShadowIntensity = keyof typeof coloredShadows.brand;
export type ElevationLevel = keyof typeof elevation;

// Utilitários para sombras
export const getShadow = {
  light: (size: ShadowSize) => lightShadows[size],
  dark: (size: ShadowSize) => darkShadows[size],
  colored: (type: ColoredShadowType, intensity: ColoredShadowIntensity) =>
    coloredShadows[type][intensity],
  elevation: (level: ElevationLevel, isDark = false) =>
    isDark ? darkElevation[level] : elevation[level],
};

// Função para gerar sombras responsivas
export const getResponsiveShadow = (baseSize: ShadowSize, isDark = false) => {
  const shadowSet = isDark ? darkShadows : lightShadows;
  return {
    mobile: shadowSet[baseSize],
    tablet: shadowSet[baseSize],
    desktop: shadowSet[baseSize],
  };
};
