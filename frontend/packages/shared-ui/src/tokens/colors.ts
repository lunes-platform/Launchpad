/**
 * Design Tokens - Sistema de Cores
 * Paleta de cores padronizada para toda a plataforma Launchpad
 */

// Cores principais da marca
export const brandColors = {
  // Grafite - Cor principal para fundos e textos
  grafite: {
    50: "#F8F8F8",
    100: "#F0F0F0",
    200: "#E0E0E0",
    300: "#C0C0C0",
    400: "#A0A0A0",
    500: "#808080",
    600: "#606060",
    700: "#404040",
    800: "#2A2A2A",
    900: "#1A1A1A", // Cor principal
    950: "#0F0F0F",
  },

  // Roxo - Cor de destaque e ações primárias
  roxo: {
    50: "#F3F0FF",
    100: "#E6DBFF",
    200: "#D4C2FF",
    300: "#BFA3FF",
    400: "#A684FF",
    500: "#6C38FF", // Cor principal
    600: "#5A2EDB",
    700: "#4824B7",
    800: "#361A93",
    900: "#24106F",
    950: "#12084B",
  },

  // Verde - Sucesso e confirmações
  verde: {
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#26D07C", // Cor principal
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
    950: "#052E16",
  },

  // Laranja - Alertas e ações secundárias
  laranja: {
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#FE5F00", // Cor principal
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
    950: "#431407",
  },
} as const;

// Cores semânticas
export const semanticColors = {
  // Estados de sucesso
  success: {
    light: brandColors.verde[400],
    main: brandColors.verde[500],
    dark: brandColors.verde[600],
    bg: brandColors.verde[50],
    border: brandColors.verde[200],
  },

  // Estados de erro
  error: {
    light: "#FF6B6B",
    main: "#EF4444",
    dark: "#DC2626",
    bg: "#FEF2F2",
    border: "#FECACA",
  },

  // Estados de aviso
  warning: {
    light: brandColors.laranja[400],
    main: brandColors.laranja[500],
    dark: brandColors.laranja[600],
    bg: brandColors.laranja[50],
    border: brandColors.laranja[200],
  },

  // Estados de informação
  info: {
    light: "#60A5FA",
    main: "#3B82F6",
    dark: "#2563EB",
    bg: "#EFF6FF",
    border: "#DBEAFE",
  },
} as const;

// Cores neutras para textos e fundos
export const neutralColors = {
  // Textos
  text: {
    primary: "#FFFFFF",
    secondary: brandColors.grafite[300],
    tertiary: brandColors.grafite[400],
    disabled: brandColors.grafite[500],
  },

  // Fundos
  background: {
    primary: brandColors.grafite[900],
    secondary: brandColors.grafite[800],
    tertiary: brandColors.grafite[700],
    overlay: "rgba(26, 26, 26, 0.8)",
  },

  // Bordas
  border: {
    primary: brandColors.grafite[700],
    secondary: brandColors.grafite[600],
    focus: brandColors.roxo[500],
    error: semanticColors.error.main,
  },

  // Superfícies
  surface: {
    primary: brandColors.grafite[800],
    secondary: brandColors.grafite[700],
    elevated: brandColors.grafite[600],
  },
} as const;

// Exportação consolidada de todas as cores
export const colors = {
  ...brandColors,
  semantic: semanticColors,
  neutral: neutralColors,
} as const;

// Tipos TypeScript para autocompletar
export type BrandColor = keyof typeof brandColors;
export type ColorShade = keyof typeof brandColors.grafite;
export type SemanticColor = keyof typeof semanticColors;
export type NeutralColor = keyof typeof neutralColors;

// Utilitários para acessar cores
export const getColor = {
  brand: (color: BrandColor, shade: ColorShade) => brandColors[color][shade],
  semantic: (
    color: SemanticColor,
    variant: keyof typeof semanticColors.success,
  ) => semanticColors[color][variant],
  neutral: (category: keyof typeof neutralColors, variant: string) => {
    const colorCategory = neutralColors[category] as Record<string, string>;
    return colorCategory[variant];
  },
};
