// Raw design scales. No semantic meaning — just values.
// The semantic layer (themes.ts) maps these to intent.

export const primitives = {
  color: {
    // Purple-tinted dark backgrounds unique to this app
    ink: {
      950: '#050712',
      900: '#0b0e1a',
      850: '#151827',
      800: '#252532',
      700: '#303040',
      600: '#3a3a48',
    },
    neutral: {
      0:   '#ffffff',
      50:  '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    purple: {
      100: '#f5f0ff',
      200: '#ede9fe',
      300: '#d6aef9',
      350: '#cea7f9',
      400: '#a78bfa',
      450: '#946cf5',
      500: '#8c60f7',
      600: '#792efb',
      700: '#6d28d9',
    },
    orange: {
      500: '#f97316',
      600: '#ea580c',
    },
    emerald: {
      500: '#10b981',
      600: '#059669',
    },
    amber: {
      400: '#fbbf24',
      600: '#d97706',
    },
    red: {
      500: '#ef4444',
      600: '#dc2626',
    },
    blue: {
      500: '#3b82f6',
      600: '#2563eb',
    },
  },

  space: {
    1:  '0.25rem',
    2:  '0.5rem',
    3:  '0.75rem',
    4:  '1rem',
    6:  '1.5rem',
    8:  '2rem',
    12: '3rem',
    16: '4rem',
  },

  fontSize: {
    xs:   '0.75rem',
    sm:   '0.875rem',
    base: '1rem',
    lg:   '1.125rem',
    xl:   '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },

  lineHeight: {
    snug:    '1.35',
    normal:  '1.5',
    relaxed: '1.7',
  },

  fontFamily: {
    // fallback stacks for non-CSS contexts (canvas, charts); layout.tsx loads Geist via Next.js font
    sans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"Geist Mono", ui-monospace, monospace',
  },

  fontWeight: {
    normal:   '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
  },

  radius: {
    sm:   '0.375rem',
    md:   '0.5rem',
    lg:   '0.75rem',
    xl:   '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  shadow: {
    sm: '0 10px 25px rgba(15, 23, 42, 0.65)',
    md: '0 18px 45px rgba(15, 23, 42, 0.9)',
  },

  zIndex: {
    base:     '0',
    raised:   '10',
    dropdown: '100',
    sticky:   '200',
    overlay:  '300',
    modal:    '400',
    toast:    '500',
  },

  transition: {
    duration: {
      fast:   '150ms',
      normal: '250ms',
      slow:   '400ms',
    },
    easing: {
      ease:   'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },
} as const;

export type Primitives = typeof primitives;
