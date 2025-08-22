/**
 * Design Tokens - Sistema de Espaçamento
 * Definições padronizadas para espaçamentos da plataforma Launchpad
 */

// Escala base de espaçamento (em rem)
export const spacing = {
  0: "0rem", // 0px
  px: "0.0625rem", // 1px
  0.5: "0.125rem", // 2px
  1: "0.25rem", // 4px
  1.5: "0.375rem", // 6px
  2: "0.5rem", // 8px
  2.5: "0.625rem", // 10px
  3: "0.75rem", // 12px
  3.5: "0.875rem", // 14px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  7: "1.75rem", // 28px
  8: "2rem", // 32px
  9: "2.25rem", // 36px
  10: "2.5rem", // 40px
  11: "2.75rem", // 44px
  12: "3rem", // 48px
  14: "3.5rem", // 56px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  28: "7rem", // 112px
  32: "8rem", // 128px
  36: "9rem", // 144px
  40: "10rem", // 160px
  44: "11rem", // 176px
  48: "12rem", // 192px
  52: "13rem", // 208px
  56: "14rem", // 224px
  60: "15rem", // 240px
  64: "16rem", // 256px
  72: "18rem", // 288px
  80: "20rem", // 320px
  96: "24rem", // 384px
} as const;

// Espaçamentos semânticos para componentes
export const componentSpacing = {
  // Espaçamentos internos (padding)
  padding: {
    xs: spacing[2], // 8px
    sm: spacing[3], // 12px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
    "2xl": spacing[12], // 48px
  },

  // Espaçamentos externos (margin)
  margin: {
    xs: spacing[2], // 8px
    sm: spacing[4], // 16px
    md: spacing[6], // 24px
    lg: spacing[8], // 32px
    xl: spacing[12], // 48px
    "2xl": spacing[16], // 64px
  },

  // Gaps para layouts
  gap: {
    xs: spacing[1], // 4px
    sm: spacing[2], // 8px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
    "2xl": spacing[12], // 48px
  },
} as const;

// Espaçamentos específicos para diferentes tipos de componentes
export const layoutSpacing = {
  // Containers e seções
  container: {
    padding: {
      mobile: spacing[4], // 16px
      tablet: spacing[6], // 24px
      desktop: spacing[8], // 32px
    },
    margin: {
      section: spacing[12], // 48px
      block: spacing[8], // 32px
      element: spacing[4], // 16px
    },
  },

  // Cards e superfícies
  card: {
    padding: {
      compact: spacing[4], // 16px
      comfortable: spacing[6], // 24px
      spacious: spacing[8], // 32px
    },
    gap: {
      content: spacing[4], // 16px
      sections: spacing[6], // 24px
    },
  },

  // Formulários
  form: {
    fieldGap: spacing[4], // 16px
    sectionGap: spacing[8], // 32px
    labelGap: spacing[2], // 8px
    buttonGap: spacing[3], // 12px
  },

  // Navegação
  navigation: {
    itemGap: spacing[2], // 8px
    sectionGap: spacing[6], // 24px
    padding: spacing[4], // 16px
  },

  // Modais e overlays
  modal: {
    padding: spacing[6], // 24px
    margin: spacing[4], // 16px
    headerGap: spacing[4], // 16px
    footerGap: spacing[6], // 24px
  },
} as const;

// Breakpoints para espaçamentos responsivos
export const responsiveSpacing = {
  mobile: {
    container: spacing[4], // 16px
    section: spacing[8], // 32px
    element: spacing[3], // 12px
  },
  tablet: {
    container: spacing[6], // 24px
    section: spacing[12], // 48px
    element: spacing[4], // 16px
  },
  desktop: {
    container: spacing[8], // 32px
    section: spacing[16], // 64px
    element: spacing[6], // 24px
  },
} as const;

// Exportação consolidada
export const spacingTokens = {
  base: spacing,
  component: componentSpacing,
  layout: layoutSpacing,
  responsive: responsiveSpacing,
} as const;

// Tipos TypeScript
export type SpacingScale = keyof typeof spacing;
export type ComponentSpacingSize = keyof typeof componentSpacing.padding;
export type ResponsiveBreakpoint = keyof typeof responsiveSpacing;

// Utilitários para espaçamento
export const getSpacing = {
  base: (scale: SpacingScale) => spacing[scale],
  component: (
    type: keyof typeof componentSpacing,
    size: ComponentSpacingSize,
  ) => componentSpacing[type][size],
  responsive: (
    breakpoint: ResponsiveBreakpoint,
    type: keyof typeof responsiveSpacing.mobile,
  ) => responsiveSpacing[breakpoint][type],
};

// Função para gerar classes de espaçamento
export const generateSpacingClasses = (prefix: string, scale: SpacingScale) => {
  return {
    [`${prefix}-${scale}`]: spacing[scale],
  };
};
