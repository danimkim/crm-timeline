// src/styles/design-tokens.ts

// Global design tokens for the Retail Circle–style dark luxury theme.
// These tokens are framework-agnostic and can be consumed by Tailwind, styled-components, CSS variables, etc.

export const colors = {
  background: {
    body: '#050712',
    surface: '#0B0E1A',
    elevated: '#151827',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#9CA3AF',
    muted: '#6B7280',
    inverse: '#050712',
  },
  brand: {
    primary: '#8C60F7',
    secondary: '#CEA7F9',
    accent: '#F97316',
  },
  border: {
    subtle: '#1F2933',
    strong: '#374151',
  },
  state: {
    success: '#10B981',
    warning: '#FBBF24',
    danger: '#EF4444',
    info: '#3B82F6',
  },
};

export const typography = {
  fontFamily: {
    sans: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  },
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem', // 48px
  },
  lineHeight: {
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const radius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
};

export const shadows = {
  subtle: '0 10px 25px rgba(15, 23, 42, 0.65)',
  elevated: '0 18px 45px rgba(15, 23, 42, 0.9)',
};

export const gradients = {
  brand: 'linear-gradient(135deg, #D6AEF9 0%, ##946CF5 45%, #792EFB 100%)',
};

export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '0.75rem', // 12px
  lg: '1rem', // 16px
  xl: '1.5rem', // 24px
  '2xl': '2rem', // 32px
  '3xl': '3rem', // 48px
  '4xl': '4rem', // 64px
};

// Example semantic tokens for components
export const semantic = {
  button: {
    primary: {
      background: gradients.brand,
      color: colors.text.primary,
      radius: radius.full,
      shadow: shadows.elevated,
    },
    secondary: {
      background: colors.background.surface,
      color: colors.text.secondary,
      borderColor: colors.border.subtle,
      radius: radius.full,
      shadow: shadows.subtle,
    },
  },
  card: {
    surface: {
      background: colors.background.surface,
      borderColor: colors.border.subtle,
      radius: radius['2xl'],
      shadow: shadows.subtle,
    },
  },
} as const;

export type Colors = typeof colors;
export type Typography = typeof typography;
export type Radius = typeof radius;
export type Shadows = typeof shadows;
export type Gradients = typeof gradients;
export type Spacing = typeof spacing;
export type Semantic = typeof semantic;
