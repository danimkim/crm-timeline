# Retail Circle OS Platform – Design Reference

This document summarises the visual style of the Retail Circle OS Platform page so you can generate components that feel native to the product.

---

## 1. Brand Mood & Principles

Retail Circle positions itself as an **AI-native operating system for luxury watch businesses**. The visual language needs to balance:

- **Luxury** (trust, high value, precision)
- **OS / tooling** (clarity, structure, information density)
- **AI / modern tech** (neon accents, motion, sense of intelligence)

In practice this means:

- Dark, understated surfaces
- Clear hierarchy and readable typography
- Selective but confident use of vibrant accent colours
- Subtle motion and depth instead of loud gradients everywhere

---

## 2. Color System (By Role)

### 2.1 Background & Surfaces

- **App background:** Very dark neutral (near-black) to create a “control room / OS” feel.
- **Surfaces:** Slightly lighter dark tones for cards and panels, with soft borders or subtle elevation.
- **Section separation:** Use small shifts in background tone rather than heavy dividers.

Intent: The UI should feel like a cohesive dark OS where cards float above a stable base, not like isolated boxes on a flat black canvas.

### 2.2 Primary & Accent

- **Primary color:** A cool, vivid tone (cyan/teal or blue-violet) used for:
  - Primary buttons
  - Key links and interactive text
  - Important numeric highlights (e.g. portfolio value, status)
- **Gradients (optional):** Soft diagonal or horizontal gradients that blend two neighbouring cool tones for hero CTAs or important badges.

- **Accent / Status colours:**
  - Positive / “healthy”: soft green or mint
  - Warning / risk: amber / orange
  - Error / failure: red

These status colours should be used sparingly — mostly for badges, dots, small icons, and short labels.

### 2.3 Typography Colours

- **Primary text:** Very light neutral on dark background, high contrast but not pure white everywhere.
- **Secondary text:** Softer grey for descriptions, helper copy, and long paragraphs.
- **Muted / meta:** Even dimmer grey for timestamps, labels, supporting metrics.

The goal is clear hierarchy through contrast, not by changing font families or sizes too aggressively.

---

## 3. Typography & Tone

- **Font style:** Modern, geometric or humanist sans-serif (Inter / SF Pro / similar).
- **Headlines:** Short, direct, “system-level” language:
  - “OS Platform”
  - “Power Your Store with One Unified System”
  - “CRM — Remember Everything, Act Smarter”
- **Body copy:**
  - Concrete and benefits-oriented, not poetic.
  - Often broken into bullets for scannability.
  - Uses bold and italics occasionally to emphasise key phrases.

Hierarchy guideline:

- H1: Page title or main OS module name.
- H2: Major capability (CRM, Part-Exchange, Courier Tracking).
- H3: Sub-feature within a capability.
- Body: Plain, legible, relatively compact line length.

---

## 4. Layout & Structure

- **Grid:** A centered content column with max-width for readability, usually split into 2–3 columns on desktop and 1 column on mobile.
- **Sections:** Each core feature (CRM, Admin, Notifications, Part-Exchange, Invoicing & Payments, Insurance, Courier Tracking) reads like its own module card/section with:
  - Title
  - Short descriptive sentence
  - Bullets or small paragraphs
- **Cards & Panels:**
  - Rounded corners
  - Slight background lift relative to the page
  - Thin, subtle borders
  - Consistent padding and spacing

Overall, layouts should look like a collection of OS modules sitting in one unified system, not like separate marketing pages stitched together.

---

## 5. Component Style Patterns

### 5.1 CTAs & Buttons

- **Primary button:**
  - Filled with the primary colour or a subtle primary gradient
  - Medium radius (rounded but not pill)
  - Bold, high-contrast text
- **Secondary / Ghost button:**
  - Transparent or surface-matched background
  - Primary-colour border and text
  - Used for less critical actions like “Talk to sales”, “Learn more”

Buttons should feel consistent across all modules: same sizing, radius, typography, and hover behaviour.

### 5.2 Cards & Modules

Common shared traits:

- Dark surface background
- Soft border or light shadow
- Clear title and supporting copy
- Optional icon or small illustration that hints at function (CRM, courier, payments, etc.)
- Consistent padding (same top/bottom/side padding across modules)

### 5.3 Lists, Timelines, and Badges

- OS Platform content often describes:
  - Relationship timelines
  - Notifications
  - Shipment tracking
  - CRM events

Visual patterns:

- Vertical timelines with dots or icons on a line
- List items with:
  - Left-aligned icon
  - Title + description
  - Right-aligned status or CTA
- Badges for types and statuses (e.g. “High-value client”, “Delayed”, “Paid”)

These should be compact and readable, fitting into an information-dense OS dashboard.

---

## 6. Motion & Interaction

Motion should be:

- Subtle and purposeful:
  - Fade/slide-in for cards on first appearance
  - Soft hover elevation for interactive cards
  - Smooth colour transitions on buttons
- Avoid:
  - Overly bouncy animations
  - Large-scale parallax or distracting movement

The experience should feel like a calm, high-performance dashboard used daily by professionals.

---

## 7. Tailwind Token Suggestions (English)

Below are suggested Tailwind token combinations to approximate the design system:

### 7.1 Layout & Background

- Page background:
  `class="bg-slate-950 text-slate-50"`
- Section background (subtle contrast):
  `class="bg-slate-900/80"`
- Card / panel:
  `class="bg-slate-900/90 border border-slate-800/80 rounded-xl shadow-sm"`

### 7.2 Typography

- Headline (H1 / H2 style):
  `class="text-slate-50 text-3xl md:text-4xl font-semibold tracking-tight"`
- Section title (H3):
  `class="text-slate-50 text-xl font-semibold"`
- Body text:
  `class="text-slate-300 text-sm md:text-base leading-relaxed"`
- Muted / meta text (timestamps, labels):
  `class="text-slate-500 text-xs md:text-sm"`

### 7.3 Primary & Accent Colours

- Primary text / highlight:
  `class="text-cyan-400"` or `class="text-sky-400"`
- Primary background (buttons, pills):
  `class="bg-cyan-500 hover:bg-cyan-400 text-slate-950"`
- Gradient CTA:
  `class="bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 text-slate-950"`

- Positive status:
  `class="text-emerald-400"` or `class="bg-emerald-500/10 text-emerald-300"`
- Warning status:
  `class="text-amber-400"` or `class="bg-amber-500/10 text-amber-300"`
- Error status:
  `class="text-rose-400"` or `class="bg-rose-500/10 text-rose-300"`

### 7.4 Buttons

- Primary button:
  `class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium transition-colors"`
- Secondary / ghost button:
  `class="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-cyan-500/70 text-cyan-300 hover:bg-cyan-500/10 font-medium transition-colors"`

### 7.5 Cards, Borders, and Dividers

- Standard card:
  `class="bg-slate-900/90 border border-slate-800/80 rounded-xl p-4 md:p-6 shadow-sm"`
- Soft divider line:
  `class="border-t border-slate-800/80"`

### 7.6 Timeline / List Items

- Timeline container:
  `class="space-y-4"`
- Timeline item:
  `class="flex items-start gap-3"`
- Timeline dot:
  `class="mt-1 h-2 w-2 rounded-full bg-cyan-400"`
- List item container:
  `class="flex items-center justify-between gap-3 rounded-lg bg-slate-900/80 border border-slate-800/80 px-3 py-2 hover:border-slate-700 transition-colors"`

These tokens should give Claude enough structure to generate components that visually align with the Retail Circle OS Platform style.
