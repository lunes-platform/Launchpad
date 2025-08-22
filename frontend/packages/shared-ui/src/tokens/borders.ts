/**
 * Design Tokens - Sistema de Bordas
 * Definições padronizadas para bordas, raios e contornos da plataforma Launchpad
 */

// Raios de borda (border-radius)
export const borderRadius = {
  none: "0px",
  xs: "0.125rem", // 2px
  sm: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  "3xl": "1.5rem", // 24px
  full: "9999px", // Circular
} as const;

// Larguras de borda
export const borderWidth = {
  0: "0px",
  1: "1px",
  2: "2px",
  4: "4px",
  8: "8px",
} as const;

// Estilos de borda
export const borderStyle = {
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
  double: "double",
  none: "none",
} as const;

// Cores de borda para tema claro
export const lightBorderColors = {
  // Bordas neutras
  default: "#E5E7EB", // gray-200
  muted: "#F3F4F6", // gray-100
  subtle: "#F9FAFB", // gray-50
  strong: "#D1D5DB", // gray-300

  // Bordas da marca
  brand: "#6C38FF", // roxo principal
  brandLight: "#8B5CF6", // roxo claro
  brandMuted: "#EDE9FE", // roxo muito claro

  // Bordas semânticas
  success: "#26D07C", // verde
  successLight: "#34D399", // verde claro
  successMuted: "#D1FAE5", // verde muito claro

  error: "#EF4444", // vermelho
  errorLight: "#F87171", // vermelho claro
  errorMuted: "#FEE2E2", // vermelho muito claro

  warning: "#FE5F00", // laranja
  warningLight: "#FB923C", // laranja claro
  warningMuted: "#FED7AA", // laranja muito claro

  info: "#3B82F6", // azul
  infoLight: "#60A5FA", // azul claro
  infoMuted: "#DBEAFE", // azul muito claro
} as const;

// Cores de borda para tema escuro
export const darkBorderColors = {
  // Bordas neutras
  default: "#374151", // grafite-600
  muted: "#4B5563", // grafite-500
  subtle: "#6B7280", // grafite-400
  strong: "#1F2937", // grafite-700

  // Bordas da marca
  brand: "#6C38FF", // roxo principal
  brandLight: "#8B5CF6", // roxo claro
  brandMuted: "#4C1D95", // roxo escuro

  // Bordas semânticas
  success: "#26D07C", // verde
  successLight: "#34D399", // verde claro
  successMuted: "#065F46", // verde escuro

  error: "#EF4444", // vermelho
  errorLight: "#F87171", // vermelho claro
  errorMuted: "#7F1D1D", // vermelho escuro

  warning: "#FE5F00", // laranja
  warningLight: "#FB923C", // laranja claro
  warningMuted: "#92400E", // laranja escuro

  info: "#3B82F6", // azul
  infoLight: "#60A5FA", // azul claro
  infoMuted: "#1E3A8A", // azul escuro
} as const;

// Bordas para componentes específicos
export const componentBorders = {
  // Inputs e formulários
  input: {
    default: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.md,
      color: {
        light: lightBorderColors.default,
        dark: darkBorderColors.default,
      },
    },
    focus: {
      width: borderWidth[2],
      style: borderStyle.solid,
      radius: borderRadius.md,
      color: {
        light: lightBorderColors.brand,
        dark: darkBorderColors.brand,
      },
    },
    error: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.md,
      color: {
        light: lightBorderColors.error,
        dark: darkBorderColors.error,
      },
    },
  },

  // Botões
  button: {
    primary: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.lg,
      color: {
        light: lightBorderColors.brand,
        dark: darkBorderColors.brand,
      },
    },
    secondary: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.lg,
      color: {
        light: lightBorderColors.default,
        dark: darkBorderColors.default,
      },
    },
    outline: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.lg,
      color: {
        light: lightBorderColors.brand,
        dark: darkBorderColors.brand,
      },
    },
  },

  // Cards
  card: {
    default: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.xl,
      color: {
        light: lightBorderColors.muted,
        dark: darkBorderColors.default,
      },
    },
    hover: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.xl,
      color: {
        light: lightBorderColors.default,
        dark: darkBorderColors.muted,
      },
    },
    selected: {
      width: borderWidth[2],
      style: borderStyle.solid,
      radius: borderRadius.xl,
      color: {
        light: lightBorderColors.brand,
        dark: darkBorderColors.brand,
      },
    },
  },

  // Modais
  modal: {
    default: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius["2xl"],
      color: {
        light: lightBorderColors.muted,
        dark: darkBorderColors.default,
      },
    },
  },

  // Navegação
  navigation: {
    default: {
      width: borderWidth[1],
      style: borderStyle.solid,
      radius: borderRadius.none,
      color: {
        light: lightBorderColors.muted,
        dark: darkBorderColors.default,
      },
    },
  },

  // Divisores
  divider: {
    horizontal: {
      width: borderWidth[1],
      style: borderStyle.solid,
      color: {
        light: lightBorderColors.muted,
        dark: darkBorderColors.default,
      },
    },
    vertical: {
      width: borderWidth[1],
      style: borderStyle.solid,
      color: {
        light: lightBorderColors.muted,
        dark: darkBorderColors.default,
      },
    },
  },
} as const;

// Bordas para estados interativos
export const interactiveBorders = {
  hover: {
    width: borderWidth[1],
    style: borderStyle.solid,
    color: {
      light: lightBorderColors.strong,
      dark: darkBorderColors.muted,
    },
  },
  focus: {
    width: borderWidth[2],
    style: borderStyle.solid,
    color: {
      light: lightBorderColors.brand,
      dark: darkBorderColors.brand,
    },
  },
  active: {
    width: borderWidth[2],
    style: borderStyle.solid,
    color: {
      light: lightBorderColors.brand,
      dark: darkBorderColors.brand,
    },
  },
  disabled: {
    width: borderWidth[1],
    style: borderStyle.solid,
    color: {
      light: lightBorderColors.muted,
      dark: darkBorderColors.strong,
    },
  },
} as const;

// Exportação consolidada
export const borders = {
  radius: borderRadius,
  width: borderWidth,
  style: borderStyle,
  colors: {
    light: lightBorderColors,
    dark: darkBorderColors,
  },
  component: componentBorders,
  interactive: interactiveBorders,
} as const;

// Tipos TypeScript
export type BorderRadius = keyof typeof borderRadius;
export type BorderWidth = keyof typeof borderWidth;
export type BorderStyle = keyof typeof borderStyle;
export type LightBorderColor = keyof typeof lightBorderColors;
export type DarkBorderColor = keyof typeof darkBorderColors;

// Utilitários para bordas
export const getBorder = {
  radius: (size: BorderRadius) => borderRadius[size],
  width: (size: BorderWidth) => borderWidth[size],
  color: (color: LightBorderColor, isDark = false) =>
    isDark
      ? darkBorderColors[color as DarkBorderColor]
      : lightBorderColors[color],
  component: (
    component: keyof typeof componentBorders,
    variant: string,
    isDark = false,
  ) => {
    const comp = componentBorders[component] as any;
    const border = comp[variant];
    return {
      width: border.width,
      style: border.style,
      radius: border.radius || borderRadius.none,
      color: isDark ? border.color.dark : border.color.light,
    };
  },
};

// Função para gerar classes CSS de borda
export const generateBorderClass = (
  width: BorderWidth,
  style: BorderStyle,
  color: string,
  radius?: BorderRadius,
) => {
  return {
    borderWidth: borderWidth[width],
    borderStyle: borderStyle[style],
    borderColor: color,
    ...(radius && { borderRadius: borderRadius[radius] }),
  };
};
