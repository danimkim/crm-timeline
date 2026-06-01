// tailwind.config.js
import {
  colors,
  typography,
  radius,
  gradients,
  shadows,
} from './src/app/styles/design-tokens.ts';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: colors.background.body,
          soft: colors.background.surface,
          elevated: colors.background.elevated,
        },
        text: {
          primary: colors.text.primary,
          secondary: colors.text.secondary,
          muted: colors.text.muted,
          inverse: colors.text.inverse,
        },
        brand: {
          primary: colors.brand.primary,
          secondary: colors.brand.secondary,
          accent: colors.brand.accent,
        },
        border: {
          subtle: colors.border.subtle,
          strong: colors.border.strong,
        },
        state: {
          success: colors.state.success,
          warning: colors.state.warning,
          danger: colors.state.danger,
          info: colors.state.info,
        },
      },
      fontFamily: {
        sans: typography.fontFamily.sans,
      },
      borderRadius: {
        sm: radius.sm,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
        '2xl': radius['2xl'],
        full: radius.full,
      },
      boxShadow: {
        subtle: shadows.subtle,
        elevated: shadows.elevated,
      },
      backgroundImage: {
        'gradient-brand': gradients.brand,
      },
    },
  },
  plugins: [],
};

export default config;
