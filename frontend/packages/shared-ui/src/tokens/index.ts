/**
 * Design Tokens - Exportação Centralizada
 * Sistema de design tokens da plataforma Launchpad
 */

// Exportações individuais
export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./shadows";
export * from "./borders";

// Importações para consolidação
import { colors, type BrandColor, type SemanticColor } from "./colors";
import {
  typography,
  type FontFamily,
  type FontWeight,
  type FontSize,
  type TextStyle,
} from "./typography";
import {
  spacingTokens,
  type SpacingScale,
  type ComponentSpacingSize,
} from "./spacing";
import { shadows, type ShadowSize, type ElevationLevel } from "./shadows";
import { borders, type BorderRadius, type BorderWidth } from "./borders";

// Objeto consolidado com todos os tokens
export const designTokens = {
  colors,
  typography,
  spacing: spacingTokens,
  shadows,
  borders,
} as const;

// Tipos consolidados
export interface DesignTokens {
  colors: typeof colors;
  typography: typeof typography;
  spacing: typeof spacingTokens;
  shadows: typeof shadows;
  borders: typeof borders;
}

// Utilitários consolidados
export const tokens = {
  // Cores
  getBrandColor: (palette: BrandColor, shade: keyof typeof colors.grafite) =>
    colors[palette][shade],
  getSemanticColor: (
    type: SemanticColor,
    shade: keyof typeof colors.semantic.success,
  ) => colors.semantic[type][shade],

  // Tipografia
  getTextStyle: (style: TextStyle) => typography.textStyles[style],
  getFontSize: (size: FontSize) => typography.fontSizes[size],
  getFontWeight: (weight: FontWeight) => typography.fontWeights[weight],

  // Espaçamento
  getSpacing: (scale: SpacingScale) => spacingTokens.base[scale],
  getComponentSpacing: (
    type: "padding" | "margin" | "gap",
    size: ComponentSpacingSize,
  ) => spacingTokens.component[type][size],

  // Sombras
  getShadow: (size: ShadowSize, isDark = false) =>
    isDark ? shadows.dark[size] : shadows.light[size],
  getElevation: (level: ElevationLevel, isDark = false) =>
    isDark ? shadows.darkElevation[level] : shadows.elevation[level],

  // Bordas
  getBorderRadius: (size: BorderRadius) => borders.radius[size],
  getBorderWidth: (size: BorderWidth) => borders.width[size],
} as const;

// Configurações de tema
export const themeConfig = {
  // Tema padrão
  default: {
    colors: {
      grafite: colors.grafite,
      roxo: colors.roxo,
      verde: colors.verde,
      laranja: colors.laranja,
    },
    semantic: colors.semantic,
    neutral: colors.neutral,
    typography: typography.textStyles,
    spacing: spacingTokens.component,
    shadows: shadows.light,
    borders: borders.colors.light,
  },

  // Tema escuro
  dark: {
    colors: {
      grafite: colors.grafite,
      roxo: colors.roxo,
      verde: colors.verde,
      laranja: colors.laranja,
    },
    semantic: colors.semantic,
    neutral: colors.neutral,
    typography: typography.textStyles,
    spacing: spacingTokens.component,
    shadows: shadows.dark,
    borders: borders.colors.dark,
  },
} as const;

// Breakpoints para design responsivo
export const breakpoints = {
  mobile: "320px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1280px",
  ultrawide: "1536px",
} as const;

// Transições e animações
export const transitions = {
  duration: {
    fast: "150ms",
    normal: "200ms",
    slow: "300ms",
    slower: "500ms",
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: "auto",
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Exportação do sistema completo
export const launchpadDesignSystem = {
  tokens: designTokens,
  utils: tokens,
  theme: themeConfig,
  breakpoints,
  transitions,
  zIndex,
} as const;

// Tipo para o sistema completo
export type LaunchpadDesignSystem = typeof launchpadDesignSystem;

// Função para criar tema customizado
export const createTheme = (overrides: Partial<DesignTokens>) => {
  return {
    ...designTokens,
    ...overrides,
  };
};

// Função para validar tokens
export const validateTokens = (tokens: Partial<DesignTokens>): boolean => {
  try {
    // Validações básicas
    if (tokens.colors && typeof tokens.colors !== "object") return false;
    if (tokens.typography && typeof tokens.typography !== "object")
      return false;
    if (tokens.spacing && typeof tokens.spacing !== "object") return false;
    if (tokens.shadows && typeof tokens.shadows !== "object") return false;
    if (tokens.borders && typeof tokens.borders !== "object") return false;

    return true;
  } catch {
    return false;
  }
};
