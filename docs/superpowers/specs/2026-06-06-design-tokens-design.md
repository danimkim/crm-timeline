# Design Tokens System

**Date:** 2026-06-06
**Status:** Approved

## Overview

Replace the existing `src/app/styles/design-tokens.ts` with a structured, two-tier token system. TypeScript is the single source of truth for all token values. A generator script writes CSS variables into `globals.css`, which Tailwind v4 consumes. Dark and light themes are both statically emitted; switching is handled via a `data-theme` attribute on `<html>` — no runtime JS cost for the default theme.

## Problem with current state

- `design-tokens.ts` and `globals.css` have drifted (e.g. `surface` is `#0B0E1A` in TS, `#303040` in CSS).
- The TS file is documentation-only — Tailwind reads CSS, not TS.
- No light mode support.
- Missing token categories: z-index, transitions, state sub-tokens (bg/text/border per state).
- No type enforcement that dark and light themes define the same tokens.

## Architecture

### Two-tier model

```
Primitives  →  raw scales, no semantic meaning  (color.purple[500], space[4])
Semantic    →  intent-named, maps primitives     (background.surface, text.primary)
```

Semantic tokens reference primitives — no raw hex strings in the semantic layer.

### File structure

```
src/styles/tokens/
  primitives.ts    raw scales
  themes.ts        semantic mapping — dark & light, both typed as Theme
  generate.ts      toCssVariables() + generateCss() utilities
  use-theme.ts     'use client' React hook — reads/writes data-theme + localStorage
  index.ts         public API + TypeScript types

scripts/
  generate-tokens.ts   Node runner — writes globals.css between marker comments
```

The old `src/app/styles/design-tokens.ts` is deleted once migration is complete.

## Primitives

Theme-agnostic raw values. Named by scale position, not intent.

### `color`

Full named palettes with stops. Palettes needed:

| Palette   | Usage                                  |
|-----------|----------------------------------------|
| `purple`  | brand primary                          |
| `violet`  | brand secondary / event badge          |
| `neutral` | backgrounds, text, borders             |
| `amber`   | warning state / purchase badge         |
| `emerald` | success state / message badge          |
| `sky`     | info state / email badge               |
| `blue`    | info state / quotation badge           |
| `orange`  | accent / trade-in badge                |
| `teal`    | sourcing badge                         |
| `indigo`  | appointment badge                      |

Stops: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. Only the stops actually referenced in themes need to be defined.

### `space`

Numeric scale (key = multiplier of 4px base unit):

```
1=4px, 2=8px, 3=12px, 4=16px, 6=24px, 8=32px, 12=48px, 16=64px
```

### `fontSize`

```
xs=0.75rem, sm=0.875rem, base=1rem, lg=1.125rem, xl=1.25rem,
2xl=1.5rem, 3xl=1.875rem, 4xl=2.25rem, 5xl=3rem
```

### `lineHeight`

```
snug=1.35, normal=1.5, relaxed=1.7
```

### `fontFamily`

```
sans: "Inter", system-ui, ...
mono: "Geist Mono", monospace
```

### `fontWeight`

```
normal=400, medium=500, semibold=600, bold=700
```

### `radius`

```
sm=0.375rem, md=0.5rem, lg=0.75rem, xl=1rem, 2xl=1.5rem, full=9999px
```

### `shadow`

```
sm:  0 10px 25px rgba(15, 23, 42, 0.65)
md:  0 18px 45px rgba(15, 23, 42, 0.9)
```

### `zIndex`

```
base=0, raised=10, dropdown=100, sticky=200, overlay=300, modal=400, toast=500
```

### `transition`

```
duration: { fast=150ms, normal=250ms, slow=400ms }
easing:   { ease="cubic-bezier(0.4,0,0.2,1)", spring="cubic-bezier(0.34,1.56,0.64,1)" }
```

## Semantic layer (`Theme` interface)

Both `dark` and `light` must satisfy the same `Theme` interface. TypeScript will error if either theme is missing a token.

```ts
interface Theme {
  background: {
    page:     string  // outermost page bg
    surface:  string  // card / panel bg
    elevated: string  // elevated surface (popover, tooltip)
    overlay:  string  // modal backdrop
  }
  text: {
    primary:  string
    secondary: string
    muted:    string
    inverse:  string  // text on brand-colored bg
    onBrand:  string  // text placed directly on brand gradient
  }
  brand: {
    primary:  string
    secondary: string
    accent:   string
    gradient: string  // CSS gradient string
  }
  border: {
    subtle: string
    strong: string
    focus:  string  // keyboard focus ring
  }
  state: {
    success: { bg: string; text: string; border: string }
    warning: { bg: string; text: string; border: string }
    danger:  { bg: string; text: string; border: string }
    info:    { bg: string; text: string; border: string }
  }
  shadow: {
    subtle:   string
    elevated: string
  }
}
```

## CSS generator

### `toCssVariables(theme: Theme, prefix = 'token')`

Flattens the nested theme object into a `Record<string, string>` using dash-joined key paths:

```
background.surface  →  --token-background-surface
state.success.bg    →  --token-state-success-bg
```

### `generateCss(themes: { dark: Theme; light: Theme })`

Returns a CSS string:

```css
/* @tokens-start — do not edit, generated by scripts/generate-tokens.ts */
:root {
  --token-background-page: #252532;
  /* ... all dark tokens ... */
}
[data-theme="light"] {
  --token-background-page: #ffffff;
  /* ... all light tokens ... */
}
/* @tokens-end */
```

### Script: `scripts/generate-tokens.ts`

- Reads `src/app/globals.css`
- Replaces content between `/* @tokens-start */` and `/* @tokens-end */` markers
- Writes file back
- Added to `package.json` as `"tokens": "npx tsx scripts/generate-tokens.ts"`

## Theme switching

- `layout.tsx`: `<html data-theme="dark">` as the static default
- `useTheme()` hook (exported from `src/styles/tokens/index.ts`):
  - Reads `document.documentElement.dataset.theme`
  - Toggles between `"dark"` and `"light"`
  - Persists selection to `localStorage`

## Migration path

The existing `:root` alias block in `globals.css` (e.g. `--bg-surface`, `--text-primary`) is kept outside the `@tokens-start`/`@tokens-end` markers and remains valid during migration. Components can be updated to use `var(--token-*)` names incrementally. Aliases are removed once all consumers are migrated.

## Public API (`index.ts` exports)

```ts
export { primitives } from './primitives'
export { themes }     from './themes'
export type { Theme } from './themes'
export { generateCss, toCssVariables } from './generate'
export { useTheme }   from './use-theme'
```

## Out of scope

- Component-level tokens (third tier) — not needed at prototype stage
- W3C Design Token Community Group metadata (`$type`, `$description`)
- Figma token sync
- Per-client white-labeling
