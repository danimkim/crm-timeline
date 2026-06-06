import { primitives } from './primitives';

const { color } = primitives;

export interface Theme {
  background: {
    page:     string;
    surface:  string;
    elevated: string;
    overlay:  string;
  };
  text: {
    primary:   string;
    secondary: string;
    muted:     string;
    inverse:   string;
    onBrand:   string;
  };
  brand: {
    primary:   string;
    secondary: string;
    accent:    string;
    gradient:  string;
  };
  border: {
    subtle: string;
    strong: string;
    focus:  string;
  };
  state: {
    success: { bg: string; text: string; border: string };
    warning: { bg: string; text: string; border: string };
    danger:  { bg: string; text: string; border: string };
    info:    { bg: string; text: string; border: string };
  };
  shadow: {
    subtle:   string;
    elevated: string;
  };
}

const dark: Theme = {
  background: {
    page:     color.ink[800],
    surface:  color.ink[700],
    elevated: color.ink[850],
    overlay:  'rgba(0, 0, 0, 0.7)',
  },
  text: {
    primary:   color.neutral[50],
    secondary: color.neutral[400],
    muted:     color.neutral[500],
    inverse:   color.ink[950],
    onBrand:   color.neutral[0],
  },
  brand: {
    primary:   color.purple[500],
    secondary: color.purple[350],
    accent:    color.orange[500],
    gradient:  `linear-gradient(135deg, ${color.purple[300]} 0%, ${color.purple[450]} 45%, ${color.purple[600]} 100%)`,
  },
  border: {
    subtle: color.ink[600],
    strong: color.neutral[700],
    focus:  color.purple[500],
  },
  state: {
    success: { bg: 'rgba(16, 185, 129, 0.1)',  text: color.emerald[500], border: 'rgba(16, 185, 129, 0.2)' },
    warning: { bg: 'rgba(251, 191, 36, 0.1)',  text: color.amber[400],   border: 'rgba(251, 191, 36, 0.2)' },
    danger:  { bg: 'rgba(239, 68, 68, 0.1)',   text: color.red[500],     border: 'rgba(239, 68, 68, 0.2)'  },
    info:    { bg: 'rgba(59, 130, 246, 0.1)',   text: color.blue[500],    border: 'rgba(59, 130, 246, 0.2)' },
  },
  shadow: {
    subtle:   primitives.shadow.sm,
    elevated: primitives.shadow.md,
  },
};

const light: Theme = {
  background: {
    page:     color.neutral[0],
    surface:  color.neutral[50],
    elevated: color.neutral[100],
    overlay:  'rgba(0, 0, 0, 0.5)',
  },
  text: {
    primary:   color.neutral[900],
    secondary: color.neutral[600],
    muted:     color.neutral[500],
    inverse:   color.neutral[0],
    onBrand:   color.neutral[0],
  },
  brand: {
    primary:   color.purple[700],
    secondary: color.purple[500],
    accent:    color.orange[600],
    gradient:  `linear-gradient(135deg, ${color.purple[300]} 0%, ${color.purple[450]} 45%, ${color.purple[600]} 100%)`,
  },
  border: {
    subtle: color.neutral[200],
    strong: color.neutral[300],
    focus:  color.purple[700],
  },
  state: {
    success: { bg: 'rgba(16, 185, 129, 0.1)',  text: color.emerald[600], border: 'rgba(16, 185, 129, 0.3)' },
    warning: { bg: 'rgba(245, 158, 11, 0.1)',  text: color.amber[600],   border: 'rgba(245, 158, 11, 0.3)' },
    danger:  { bg: 'rgba(239, 68, 68, 0.1)',   text: color.red[600],     border: 'rgba(239, 68, 68, 0.3)'  },
    info:    { bg: 'rgba(59, 130, 246, 0.1)',   text: color.blue[600],    border: 'rgba(59, 130, 246, 0.3)' },
  },
  shadow: {
    subtle:   '0 4px 12px rgba(0, 0, 0, 0.08)',
    elevated: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
};

export const themes = { dark, light } as const;
