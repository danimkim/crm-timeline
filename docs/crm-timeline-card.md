# CRM Client Relationship Timeline Card

## Context

Building a premium CRM "Client Relationship Timeline Card" component for the Retail Circle OS Platform. The component demonstrates an AI-native CRM experience for luxury watch retail — showing every customer touchpoint (WhatsApp, meetings, emails) in a unified timeline, alongside key client preferences and an AI-suggested next best action.

Design must follow the Retail Circle OS Platform design system: **dark OS/control-room aesthetic with cyan accent**, not a luxury editorial style.

Reference: `docs/design.md`

---

## Aesthetic Direction

**Theme:** AI-native OS dashboard — slate-950 base, slate-900 surfaces, cyan-400/sky-400 primary accent  
**Feel:** A high-performance professional tool used daily, not a bespoke luxury document  
**Typography:** Geist Sans (already in project) — no additional fonts needed  
**Motion:** Subtle fade/slide-in stagger on timeline entries (CSS-only)

---

## File Structure

```
src/
  app/
    globals.css              ← MODIFY: add keyframe animation + .timeline-entry stagger classes
    page.tsx                 ← REPLACE: render demo page with timeline card
  components/
    crm/
      ClientTimelineCard.tsx         ← card shell, receives full CRMClientProfile
      ClientHeader.tsx               ← name, tier badge, LTV, last contact
      TimelineSection.tsx            ← vertical timeline + stagger animation
      TimelineEntry.tsx              ← single interaction row
      KeyPreferencesPanel.tsx        ← brand affinities, style, budget
      NextBestActionCallout.tsx      ← AI recommendation block
      icons/
        WhatsAppIcon.tsx             ← inline SVG, currentColor
        MeetingIcon.tsx
        EmailIcon.tsx
  lib/
    crm-data.ts              ← TypeScript interfaces + mock data
```

All components are **Server Components** (no `'use client'`). Stagger animation is CSS-only via `nth-child` selectors. No new fonts need to be loaded — `layout.tsx` is unchanged.

---

## TypeScript Interfaces (`src/lib/crm-data.ts`)

```typescript
export type InteractionChannel = 'whatsapp' | 'meeting' | 'email';
export type MeetingType = 'in-person' | 'video-call' | 'phone';
export type CustomerTier = 'diamond' | 'platinum' | 'high-value' | 'repeat-buyer';

export interface TimelineEntry {
  id: string;
  channel: InteractionChannel;
  date: string;           // ISO 8601
  summary: string;
  metadata?: {
    meetingType?: MeetingType;
    location?: string;
    duration?: string;
    aiRecap?: boolean;
    attachmentCount?: number;
  };
}

export interface KeyPreferences {
  brandAffinities: string[];
  stylePreferences: string[];
  budgetRange: { min: number; max: number; currency: string; };
}

export interface NextBestAction {
  action: string;
  rationale: string;
  urgency: 'high' | 'medium' | 'low';
  suggestedChannel: InteractionChannel;
  suggestedDate?: string;
}

export interface CRMClientProfile {
  id: string;
  name: string;
  tier: CustomerTier;
  tierLabel: string;
  lastContactDate: string;
  clientSince: string;
  lifetimeValue: { amount: number; currency: string; };
  timeline: TimelineEntry[];
  preferences: KeyPreferences;
  nextBestAction: NextBestAction;
}
```

**Mock client:** James Harrington III, High-Value Collector, LTV £1,240,000. 6 timeline entries spanning March–November 2025 (2× meeting, 2× email AI-recap, 2× WhatsApp). Next best action: private first-look of arriving Patek Philippe 5726A, urgency: high.

---

## globals.css Changes

Only add the animation keyframe and stagger utility classes — no new color tokens needed (use Tailwind's built-in `slate`/`cyan` palette directly):

```css
@keyframes timeline-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.timeline-entry { animation: timeline-fade-in 0.4s ease-out both; }
.timeline-entry:nth-child(1) { animation-delay: 0.05s; }
.timeline-entry:nth-child(2) { animation-delay: 0.13s; }
.timeline-entry:nth-child(3) { animation-delay: 0.21s; }
.timeline-entry:nth-child(4) { animation-delay: 0.29s; }
.timeline-entry:nth-child(5) { animation-delay: 0.37s; }
.timeline-entry:nth-child(6) { animation-delay: 0.45s; }
```

Also update `body` to use the Geist variable instead of Arial:
```css
body { font-family: var(--font-geist-sans), sans-serif; }
```

---

## Tailwind Token Reference (from design.md)

| Role | Classes |
|---|---|
| Page background | `bg-slate-950 text-slate-50` |
| Card / panel | `bg-slate-900/90 border border-slate-800/80 rounded-xl` |
| Primary text | `text-slate-50` |
| Body text | `text-slate-300 text-sm leading-relaxed` |
| Muted / meta | `text-slate-500 text-xs` |
| Primary accent | `text-cyan-400` |
| Accent background | `bg-cyan-500/10 text-cyan-300` |
| Positive status | `bg-emerald-500/10 text-emerald-300` |
| Warning status | `bg-amber-500/10 text-amber-300` |
| Error / high urgency | `bg-rose-500/10 text-rose-300` |
| Divider | `border-t border-slate-800/80` |
| Timeline dot | `h-2 w-2 rounded-full bg-cyan-400` |

---

## Component Design Details

### ClientTimelineCard.tsx
Outer `<article>`: `bg-slate-900/90 border border-slate-800/80 rounded-xl p-6 md:p-8 shadow-sm max-w-[900px] w-full mx-auto`. Three stacked sections: `ClientHeader`, `TimelineSection`, then a `flex` row (desktop) with `KeyPreferencesPanel` (55%) + `NextBestActionCallout` (45%).

### ClientHeader.tsx
- Name: `text-slate-50 text-3xl font-semibold tracking-tight`
- Tier badge: `bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-medium rounded-md px-2 py-0.5`
- LTV value: `text-cyan-400 font-semibold` (primary highlight per design guide)
- Meta labels (Last Contact, Client Since): `text-slate-500 text-xs`
- Divider at bottom: `border-t border-slate-800/80`

### TimelineSection.tsx
- Heading "Interaction History": `text-slate-50 text-xl font-semibold` (H3 style)
- Container: `relative space-y-4 pl-8` with absolutely positioned vertical rule at `left-[15px]`: `w-px bg-slate-700/50 h-full absolute top-0`
- Each entry: `<div className="timeline-entry flex items-start gap-3">`

### TimelineEntry.tsx
- Icon circle: `relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 border border-slate-700` with icon in `text-cyan-400`
- Channel + date header: `text-slate-500 text-xs`
- Summary: `text-slate-300 text-sm leading-relaxed`
- Metadata chips: `bg-slate-900 border border-slate-800 text-slate-500 text-xs rounded px-2 py-0.5`
- AI recap badge: `bg-cyan-500/10 text-cyan-300 text-xs rounded px-2 py-0.5`

### KeyPreferencesPanel.tsx
- Section heading: `text-slate-50 text-xl font-semibold`
- Brand/style pills: `bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md px-2 py-0.5`
- Budget range value: `text-cyan-400 font-semibold`

### NextBestActionCallout.tsx
- Left accent border: `border-l-2 border-cyan-500/50 pl-4`
- Action text: `text-slate-50 font-semibold text-base` (clear, direct OS language)
- Rationale: `text-slate-300 text-sm leading-relaxed`
- Urgency indicator dot: `h-2 w-2 rounded-full` — `bg-rose-400` high / `bg-amber-400` medium / `bg-emerald-400` low
- Suggested channel: `text-slate-500 text-xs`

---

## Implementation Order

1. `src/lib/crm-data.ts` — types + mock data (no dependencies)
2. `src/app/globals.css` — add animation keyframes only
3. `src/components/crm/icons/*.tsx` — 3 SVG icon components
4. `src/components/crm/TimelineEntry.tsx`
5. `src/components/crm/TimelineSection.tsx`
6. `src/components/crm/ClientHeader.tsx`
7. `src/components/crm/KeyPreferencesPanel.tsx`
8. `src/components/crm/NextBestActionCallout.tsx`
9. `src/components/crm/ClientTimelineCard.tsx`
10. `src/app/page.tsx` — wire everything together

`layout.tsx` is **not modified** — Geist Sans is already loaded and sufficient.

---

## Verification

```bash
npm run dev
```

Open `http://localhost:3000` and verify:
- `bg-slate-950` full-page background with card centered
- Cyan accent on tier badge, LTV, timeline icons, budget, next best action border
- Timeline entries stagger in on load
- Vertical rule runs through all 6 entries
- Bottom row: preferences panel + next best action side by side
- TypeScript compiles without errors: `npm run build`
