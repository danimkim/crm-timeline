# Design Tokens System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing ad-hoc `design-tokens.ts` with a two-tier (primitive → semantic) token system where TypeScript is the single source of truth, a generator script writes CSS variables into `globals.css`, and dark/light theme switching works via a `data-theme` attribute.

**Architecture:** Raw color palettes, spacing, type, and other scales live in `primitives.ts` with no semantic meaning. `themes.ts` maps those primitives to intent-named tokens via a shared `Theme` interface — TypeScript enforces that both `dark` and `light` define every token. A Node script flattens the themes into `--token-*` CSS variables and writes them between marker comments in `globals.css`. Existing `var(--bg-*)` / `var(--text-*)` aliases are left intact so no components break during migration.

**Tech Stack:** Next.js 16, Tailwind v4 (CSS-first), TypeScript strict, `tsx` (script runner)

---

## File Map

| Action   | Path                                      | Responsibility                                  |
|----------|-------------------------------------------|-------------------------------------------------|
| Create   | `src/styles/tokens/primitives.ts`         | All raw scales — colors, spacing, type, etc.   |
| Create   | `src/styles/tokens/themes.ts`             | `Theme` interface + `dark` and `light` objects  |
| Create   | `src/styles/tokens/generate.ts`           | `toCssVariables()` + `generateCss()` utilities  |
| Create   | `src/styles/tokens/use-theme.ts`          | `useTheme()` React hook (`'use client'`)        |
| Create   | `src/styles/tokens/index.ts`              | Public API re-exports (no hook — see Task 4)    |
| Create   | `scripts/generate-tokens.ts`              | Node runner — reads + writes `globals.css`      |
| Modify   | `package.json`                            | Add `"tokens"` script + install `tsx`           |
| Modify   | `src/app/globals.css`                     | Add `@tokens-start`/`@tokens-end` markers       |
| Modify   | `src/app/layout.tsx`                      | Add `data-theme="dark"` to `<html>`             |
| Delete   | `src/app/styles/design-tokens.ts`         | Superseded by the new token folder              |

---

## Task 1: Create `src/styles/tokens/primitives.ts`

**Files:**
- Create: `src/styles/tokens/primitives.ts`

- [ ] **Step 1: Create the file**

```ts
// Raw design scales. No semantic meaning — just values.
// The semantic layer (themes.ts) maps these to intent.

export const primitives = {
  color: {
    // Purple-tinted dark backgrounds unique to this app
    ink: {
      950: '#050712',
      900: '#0B0E1A',
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -30`
Expected: No errors related to `primitives.ts` (build may fail on other files that aren't yet updated — that's fine at this stage).

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/primitives.ts
git commit -m "feat(tokens): add primitives scale"
```

---

## Task 2: Create `src/styles/tokens/themes.ts`

**Files:**
- Create: `src/styles/tokens/themes.ts`
- Depends on: `primitives.ts` (Task 1)

- [ ] **Step 1: Create the file**

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -30`
Expected: No errors in `themes.ts` or `primitives.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/themes.ts
git commit -m "feat(tokens): add Theme interface and dark/light theme objects"
```

---

## Task 3: Create `src/styles/tokens/generate.ts`

**Files:**
- Create: `src/styles/tokens/generate.ts`
- Depends on: `themes.ts` (Task 2)

- [ ] **Step 1: Create the file**

```ts
import type { Theme } from './themes';

type CssVarMap = Record<string, string>;

function flattenObject(obj: Record<string, unknown>, prefix: string): CssVarMap {
  const result: CssVarMap = {};
  for (const [key, value] of Object.entries(obj)) {
    const name = `${prefix}-${key}`;
    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, name));
    } else {
      result[name] = String(value);
    }
  }
  return result;
}

export function toCssVariables(theme: Theme, prefix = 'token'): CssVarMap {
  return flattenObject(theme as unknown as Record<string, unknown>, prefix);
}

function mapToCss(vars: CssVarMap, indent = '  '): string {
  return Object.entries(vars)
    .map(([key, value]) => `${indent}--${key}: ${value};`)
    .join('\n');
}

export function generateCss(input: { dark: Theme; light: Theme }): string {
  const darkVars  = toCssVariables(input.dark);
  const lightVars = toCssVariables(input.light);

  return [
    '/* @tokens-start — do not edit, generated by scripts/generate-tokens.ts */',
    ':root {',
    mapToCss(darkVars),
    '}',
    '[data-theme="light"] {',
    mapToCss(lightVars),
    '}',
    '/* @tokens-end */',
  ].join('\n');
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -30`
Expected: No errors in `generate.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/generate.ts
git commit -m "feat(tokens): add CSS variable generator"
```

---

## Task 4: Create `src/styles/tokens/use-theme.ts`

**Files:**
- Create: `src/styles/tokens/use-theme.ts`

> **Note:** This file has `'use client'` at the top. Import it directly (`@/styles/tokens/use-theme`) — do NOT re-export it through `index.ts`, as that would make the entire index module client-only and prevent server components from importing primitives/themes.

- [ ] **Step 1: Create the file**

```ts
'use client';

import { useCallback, useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'retail-circle-theme';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored === 'dark' || stored === 'light') {
      setMode(stored);
      document.documentElement.dataset.theme = stored;
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(prev => {
      const next: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { mode, toggle };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -30`
Expected: No errors in `use-theme.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/use-theme.ts
git commit -m "feat(tokens): add useTheme hook for dark/light switching"
```

---

## Task 5: Create `src/styles/tokens/index.ts`

**Files:**
- Create: `src/styles/tokens/index.ts`
- Depends on: Tasks 1–3

- [ ] **Step 1: Create the file**

```ts
export { primitives }              from './primitives';
export type { Primitives }         from './primitives';
export { themes }                  from './themes';
export type { Theme }              from './themes';
export { generateCss, toCssVariables } from './generate';
// useTheme is intentionally excluded — import it directly from
// '@/styles/tokens/use-theme' in client components.
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -30`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/index.ts
git commit -m "feat(tokens): add public API index"
```

---

## Task 6: Create generator script and add npm script

**Files:**
- Create: `scripts/generate-tokens.ts`
- Modify: `package.json`

- [ ] **Step 1: Install tsx**

```bash
npm install --save-dev tsx
```

Expected: `tsx` added to `devDependencies` in `package.json`.

- [ ] **Step 2: Create `scripts/generate-tokens.ts`**

```ts
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { themes } from '../src/styles/tokens/themes';
import { generateCss } from '../src/styles/tokens/generate';

const CSS_PATH    = resolve(process.cwd(), 'src/app/globals.css');
const START_MARKER = '/* @tokens-start';
const END_MARKER   = '/* @tokens-end */';

const current   = readFileSync(CSS_PATH, 'utf8');
const generated = generateCss(themes);

const startIdx = current.indexOf(START_MARKER);
const endIdx   = current.indexOf(END_MARKER);

let updated: string;
if (startIdx !== -1 && endIdx !== -1) {
  updated =
    current.slice(0, startIdx) +
    generated +
    current.slice(endIdx + END_MARKER.length);
} else {
  throw new Error(
    'Token markers not found in globals.css.\n' +
    'Add "/* @tokens-start */" and "/* @tokens-end */" to globals.css first.',
  );
}

writeFileSync(CSS_PATH, updated, 'utf8');
console.log('Design tokens written to globals.css');
```

- [ ] **Step 3: Add `tokens` script to `package.json`**

In `package.json`, update the `"scripts"` block:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "tokens": "tsx scripts/generate-tokens.ts"
},
```

- [ ] **Step 4: Commit**

```bash
git add scripts/generate-tokens.ts package.json package-lock.json
git commit -m "feat(tokens): add generator script and npm tokens command"
```

---

## Task 7: Add markers to `globals.css` and run the generator

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Insert marker block into `globals.css`**

Add the following block after the closing `}` of the `@theme { }` block and before the existing `:root { }` aliases (around line 54). The exact insertion point is after line 53 (`}`) and before line 55 (`/* Aliases...`):

```css
/* @tokens-start — do not edit, generated by scripts/generate-tokens.ts */
/* @tokens-end */
```

The full file after this edit should look like:

```css
@import 'tailwindcss';

@theme {
  /* ... existing @theme content unchanged ... */
}

/* @tokens-start — do not edit, generated by scripts/generate-tokens.ts */
/* @tokens-end */

/* Aliases so existing components using var(--bg-surface) etc. keep working */
:root {
  --bg-body: var(--color-background);
  /* ... rest of aliases unchanged ... */
}

body { ... }
```

- [ ] **Step 2: Run the generator**

```bash
npm run tokens
```

Expected output:
```
Design tokens written to globals.css
```

- [ ] **Step 3: Verify the generated block in `globals.css`**

Open `src/app/globals.css` and confirm the `@tokens-start`/`@tokens-end` block now contains `:root { --token-background-page: #252532; ... }` and `[data-theme="light"] { --token-background-page: #ffffff; ... }`.

- [ ] **Step 4: Verify the dev server renders correctly**

```bash
npm run dev
```

Open `http://localhost:3000` and confirm the page renders with the dark theme unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(tokens): generate CSS variables from TypeScript source of truth"
```

---

## Task 8: Update `layout.tsx` to set default theme

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add `data-theme="dark"` to the `<html>` element**

In `src/app/layout.tsx`, change line 26 from:

```tsx
<html
  lang="en"
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
```

to:

```tsx
<html
  lang="en"
  data-theme="dark"
  className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
>
```

- [ ] **Step 2: Verify dev server**

```bash
npm run dev
```

Open `http://localhost:3000`, inspect the `<html>` element in DevTools and confirm `data-theme="dark"` is present.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(tokens): set data-theme on html element for theme switching"
```

---

## Task 9: Remove old `design-tokens.ts`

**Files:**
- Delete: `src/app/styles/design-tokens.ts`

- [ ] **Step 1: Check for any remaining imports of the old file**

```bash
grep -r "design-tokens" src/ --include="*.ts" --include="*.tsx"
```

Expected: no results. If any imports are found, update them to use `@/styles/tokens` instead before deleting.

- [ ] **Step 2: Delete the file**

```bash
rm src/app/styles/design-tokens.ts
```

- [ ] **Step 3: Remove empty styles directory if applicable**

```bash
rmdir src/app/styles 2>/dev/null || true
```

- [ ] **Step 4: Verify build**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore(tokens): remove old design-tokens.ts"
```

---

## Task 10: Final verification

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [ ] **Step 2: Confirm token variables are accessible in the browser**

Start the dev server (`npm run dev`), open DevTools Console and run:

```js
getComputedStyle(document.documentElement).getPropertyValue('--token-background-surface').trim()
```

Expected: `#303040` (the dark theme surface value).

- [ ] **Step 3: Confirm light theme switching works**

In DevTools Console:

```js
document.documentElement.dataset.theme = 'light'
getComputedStyle(document.documentElement).getPropertyValue('--token-background-surface').trim()
```

Expected: `#f9fafb` (the light theme surface value).

Reset: `document.documentElement.dataset.theme = 'dark'`
