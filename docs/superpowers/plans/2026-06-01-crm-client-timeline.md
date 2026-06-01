# CRM Client Timeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a read-only CRM customer relationship timeline showing all 8 interaction event types in a chronological feed under a customer summary header.

**Architecture:** Static, display-only React Server Components rendered by the Next.js 16 App Router. All data comes from a single mock module. Components are split by responsibility — types, data, header, event card, list, page — each file doing one thing.

**Tech Stack:** Next.js 16.2.6 (App Router), React 19, Tailwind CSS v4, TypeScript 5 strict, inline SVG icons (no icon library).

> **Verification note:** No test runner is installed. TypeScript compilation (`npx tsc --noEmit`) is used as the type-safety gate at each step. The final task uses the dev server for visual verification.

> **Next.js 16 breaking change:** `params` in page components is now a `Promise`. Always `await params` — do not access `.id` synchronously.

> **Tailwind v4 note:** The project uses `@import "tailwindcss"` (not the old `@tailwind` directives). Standard color utilities (e.g. `bg-indigo-50`, `text-emerald-700`) work as usual. No `tailwind.config.js` is needed.

> **Path alias:** `@/*` maps to `src/*` (configured in `tsconfig.json`).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/crm/timeline/types.ts` | Create | All shared TypeScript types |
| `src/components/crm/timeline/mockData.ts` | Create | One customer + eight events covering all event types |
| `src/components/crm/timeline/TimelineHeader.tsx` | Create | Customer summary card (name, tier badge, stats) |
| `src/components/crm/timeline/TimelineEventCard.tsx` | Create | Single event card with icon, accent color, value display |
| `src/components/crm/timeline/TimelineList.tsx` | Create | Sorted chronological feed with left-side connector line |
| `src/app/clients/[id]/timeline/page.tsx` | Create | Route page wiring header + list together |
| `src/app/globals.css` | Modify | Add stagger animation delays for events 7 and 8 |

---

### Task 1: TypeScript Types

**Files:**
- Create: `src/components/crm/timeline/types.ts`

- [ ] **Step 1: Create the types file**

```ts
export type EventType =
  | 'appointment'
  | 'message'
  | 'email'
  | 'call'
  | 'purchase'
  | 'trade_in'
  | 'quotation'
  | 'sourcing';

export type Channel =
  | 'whatsapp'
  | 'email'
  | 'phone'
  | 'in_person'
  | 'platform';

export interface TimelineEvent {
  id: string;
  type: EventType;
  date: string;               // ISO 8601
  title: string;
  body: string;
  channel?: Channel;
  handledBy: string;
  value?: number;             // GBP — for purchase, trade_in, quotation
}

export interface Client {
  id: string;
  name: string;
  tier: 'VIP' | 'High Value' | 'Standard';
  preferredBrands: string[];
  lifetimeValue: number;      // GBP total purchases
  tradeInCount: number;
  lastInteractionDate: string; // ISO 8601
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run from the project root:
```bash
npx tsc --noEmit
```
Expected: no output (no errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/crm/timeline/types.ts
git commit -m "feat: add CRM timeline TypeScript types"
```

---

### Task 2: Mock Data

**Files:**
- Create: `src/components/crm/timeline/mockData.ts`
- Depends on: `types.ts`

The mock has one customer (James Whitfield, VIP) and eight events spanning Feb–May 2026, one per event type, listed newest-first.

- [ ] **Step 1: Create the mock data file**

```ts
import type { Client, TimelineEvent } from './types';

export const mockClient: Client = {
  id: 'james-whitfield',
  name: 'James Whitfield',
  tier: 'VIP',
  preferredBrands: ['Rolex', 'Patek Philippe', 'Audemars Piguet'],
  lifetimeValue: 384500,
  tradeInCount: 2,
  lastInteractionDate: '2026-05-28T10:00:00',
};

export const mockEvents: TimelineEvent[] = [
  {
    id: 'evt-1',
    type: 'appointment',
    date: '2026-05-28T10:00:00',
    title: 'In-person showroom visit — Nautilus 5711 allocation',
    body: 'Client attended a private viewing session. Discussed upcoming Patek Philippe Nautilus 5711 allocation. Client expressed strong intent to acquire and asked to be first on the list.',
    channel: 'in_person',
    handledBy: 'Sarah K.',
  },
  {
    id: 'evt-2',
    type: 'sourcing',
    date: '2026-05-10T15:20:00',
    title: 'Sourcing: Audemars Piguet Royal Oak Jumbo ref. 5402',
    body: 'Seller initiated a sourcing request on behalf of the client for a vintage Audemars Piguet Royal Oak Jumbo ref. 5402 (pre-1985). Client is open to grey-market sources.',
    channel: 'platform',
    handledBy: 'Sarah K.',
  },
  {
    id: 'evt-3',
    type: 'quotation',
    date: '2026-04-22T11:30:00',
    title: 'Quotation: Patek Philippe 5726A Annual Calendar',
    body: 'Formal quote sent for Patek Philippe 5726A Annual Calendar in stainless steel. Client had expressed interest after viewing the piece at Geneva Watch Days.',
    channel: 'email',
    handledBy: 'Sarah K.',
    value: 68000,
  },
  {
    id: 'evt-4',
    type: 'message',
    date: '2026-04-15T09:45:00',
    title: 'Client confirmed interest in the 5726A',
    body: 'Client replied via WhatsApp confirming strong interest in the Patek 5726A quotation. Asked about payment structure and whether part-exchange is possible.',
    channel: 'whatsapp',
    handledBy: 'Sarah K.',
  },
  {
    id: 'evt-5',
    type: 'purchase',
    date: '2026-03-18T14:00:00',
    title: 'Purchase: Rolex Daytona 116500LN',
    body: 'Client completed the purchase of a Rolex Daytona ref. 116500LN. Partial trade-in credit applied from Speedmaster. Full handover completed in-store.',
    channel: 'in_person',
    handledBy: 'Sarah K.',
    value: 42500,
  },
  {
    id: 'evt-6',
    type: 'trade_in',
    date: '2026-03-18T13:30:00',
    title: 'Trade-in: Omega Speedmaster Moonwatch',
    body: 'Client traded in an Omega Speedmaster Professional Moonwatch in excellent condition. Agreed value of £6,200 applied as part-exchange credit toward the Daytona purchase.',
    channel: 'in_person',
    handledBy: 'Sarah K.',
    value: 6200,
  },
  {
    id: 'evt-7',
    type: 'call',
    date: '2026-02-28T16:15:00',
    title: '20-min call — vintage interest and upcoming sourcing',
    body: 'Client mentioned interest in expanding into vintage pieces, specifically pre-1985 Heuer Carrera references. Expressed curiosity about ref. 2447. Follow-up sourcing agreed.',
    channel: 'phone',
    handledBy: 'Marcus T.',
  },
  {
    id: 'evt-8',
    type: 'email',
    date: '2026-02-10T09:00:00',
    title: 'Invite confirmed: Private Watch Showcase',
    body: "Initial outreach sent confirming client's attendance at a private watch showcase event. Client replied promptly with acceptance and a +1 guest request.",
    channel: 'email',
    handledBy: 'Marcus T.',
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/crm/timeline/mockData.ts
git commit -m "feat: add CRM timeline mock data (James Whitfield, 8 events)"
```

---

### Task 3: TimelineHeader Component

**Files:**
- Create: `src/components/crm/timeline/TimelineHeader.tsx`
- Depends on: `types.ts`

Displays: customer name, tier badge, preferred brands, lifetime value, trade-in count, last interaction date.

- [ ] **Step 1: Create the component**

```tsx
import type { Client } from './types';

interface Props {
  client: Client;
}

const TIER_STYLES: Record<Client['tier'], string> = {
  'VIP':        'bg-amber-100 text-amber-800',
  'High Value': 'bg-blue-100 text-blue-800',
  'Standard':   'bg-gray-100 text-gray-700',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoString));
}

export default function TimelineHeader({ client }: Props) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {client.name}
          </h1>
          <span
            className={`mt-2 inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${TIER_STYLES[client.tier]}`}
          >
            {client.tier}
          </span>
        </div>
        <p className="text-sm text-gray-400 text-right whitespace-nowrap">
          Last interaction
          <br />
          <span className="text-gray-600 font-medium">
            {formatDate(client.lastInteractionDate)}
          </span>
        </p>
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Preferred Brands
          </p>
          <p className="text-sm text-gray-700">
            {client.preferredBrands.join(', ')}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Lifetime Value
          </p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(client.lifetimeValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            Trade-ins
          </p>
          <p className="text-xl font-bold text-gray-900">{client.tradeInCount}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/crm/timeline/TimelineHeader.tsx
git commit -m "feat: add TimelineHeader component"
```

---

### Task 4: TimelineEventCard Component

**Files:**
- Create: `src/components/crm/timeline/TimelineEventCard.tsx`
- Depends on: `types.ts`

Renders a single event with type-specific icon + accent color, date/time, title, body, channel badge, monetary value (for purchase/trade_in/quotation), and handled-by line.

- [ ] **Step 1: Create the component**

```tsx
import type { EventType, Channel, TimelineEvent } from './types';

interface Props {
  event: TimelineEvent;
}

const EVENT_CONFIG: Record<EventType, { label: string; bg: string; text: string }> = {
  appointment: { label: 'Appointment', bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  message:     { label: 'Message',     bg: 'bg-emerald-50', text: 'text-emerald-700' },
  email:       { label: 'Email',       bg: 'bg-sky-50',     text: 'text-sky-700' },
  call:        { label: 'Call',        bg: 'bg-violet-50',  text: 'text-violet-700' },
  purchase:    { label: 'Purchase',    bg: 'bg-amber-50',   text: 'text-amber-700' },
  trade_in:    { label: 'Trade-in',    bg: 'bg-orange-50',  text: 'text-orange-700' },
  quotation:   { label: 'Quotation',   bg: 'bg-blue-50',    text: 'text-blue-700' },
  sourcing:    { label: 'Sourcing',    bg: 'bg-teal-50',    text: 'text-teal-700' },
};

const CHANNEL_LABEL: Record<Channel, string> = {
  whatsapp:  'via WhatsApp',
  email:     'via Email',
  phone:     'via Phone',
  in_person: 'In-person',
  platform:  'Platform',
};

function formatEventDate(isoString: string): string {
  const date = new Date(isoString);
  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  }).format(date);
  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(date);
  return `${datePart} · ${timePart}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'GBP', maximumFractionDigits: 0,
  }).format(value);
}

function EventIcon({ type }: { type: EventType }) {
  const cls = 'w-5 h-5';
  switch (type) {
    case 'appointment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
      );
    case 'message':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
        </svg>
      );
    case 'email':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
      );
    case 'call':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
        </svg>
      );
    case 'purchase':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      );
    case 'trade_in':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      );
    case 'quotation':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      );
    case 'sourcing':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={cls}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      );
  }
}

export default function TimelineEventCard({ event }: Props) {
  const config = EVENT_CONFIG[event.type];
  const showValue =
    (event.type === 'purchase' || event.type === 'trade_in' || event.type === 'quotation') &&
    event.value != null;

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg ${config.bg} ${config.text}`}
        >
          <EventIcon type={event.type} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold uppercase tracking-wide ${config.text}`}>
              {config.label}
            </span>
            {event.channel && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {CHANNEL_LABEL[event.channel]}
              </span>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-0.5">{formatEventDate(event.date)}</p>

          <h3 className="mt-2 text-sm font-semibold text-gray-900 leading-snug">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 leading-relaxed">{event.body}</p>

          {showValue && (
            <p className="mt-3 text-base font-bold text-gray-900">
              {formatCurrency(event.value!)}
            </p>
          )}

          <p className="mt-3 text-xs text-gray-400">
            Handled by{' '}
            <span className="text-gray-600">{event.handledBy}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/crm/timeline/TimelineEventCard.tsx
git commit -m "feat: add TimelineEventCard with 8 type variants and icon/color mapping"
```

---

### Task 5: TimelineList Component + Animation Fix

**Files:**
- Create: `src/components/crm/timeline/TimelineList.tsx`
- Modify: `src/app/globals.css`
- Depends on: `types.ts`, `TimelineEventCard.tsx`

The existing `globals.css` only defines stagger delays for `:nth-child(1)` through `:nth-child(6)`. We have 8 events, so add delays for 7 and 8.

- [ ] **Step 1: Add animation delays for items 7 and 8 in `src/app/globals.css`**

Append these two lines at the end of the animation block (after the existing `:nth-child(6)` line):

```css
.timeline-entry:nth-child(7) { animation-delay: 0.53s; }
.timeline-entry:nth-child(8) { animation-delay: 0.61s; }
```

The full animation section in `globals.css` should now read:

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
.timeline-entry:nth-child(7) { animation-delay: 0.53s; }
.timeline-entry:nth-child(8) { animation-delay: 0.61s; }
```

- [ ] **Step 2: Create the TimelineList component**

The vertical connector line is a single 1px `div` that spans the full height of the list container. Dots (`w-3 h-3`, `left-0`) and the line (`left-[5px]`, centering within the dot) both live in each `li`'s left gutter. The line at `left-[5px]` in the outer `div` (which is `relative`) shares the same x-coordinate as the dots because `li` elements don't add horizontal offset.

```tsx
import type { TimelineEvent } from './types';
import TimelineEventCard from './TimelineEventCard';

interface Props {
  events: TimelineEvent[];
}

export default function TimelineList({ events }: Props) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative">
      {/* Connector line running behind the dots */}
      <div
        className="absolute left-[5px] top-0 bottom-0 w-px bg-gray-200"
        aria-hidden="true"
      />
      <ul className="space-y-4">
        {sorted.map((event) => (
          <li key={event.id} className="relative timeline-entry pl-8">
            {/* Dot sitting on the connector line */}
            <div
              className="absolute left-0 top-[18px] w-3 h-3 rounded-full bg-white border-2 border-gray-300"
              aria-hidden="true"
            />
            <TimelineEventCard event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/crm/timeline/TimelineList.tsx src/app/globals.css
git commit -m "feat: add TimelineList with connector line and stagger animation"
```

---

### Task 6: Page Route

**Files:**
- Create: `src/app/clients/[id]/timeline/page.tsx`
- Depends on: all four components and `mockData.ts`

The page ignores the `id` param (prototype always renders mock data). It still `await`s `params` because in Next.js 16 `params` is a `Promise` — skipping the await causes a TypeScript error.

- [ ] **Step 1: Create the directory**

```bash
mkdir -p "src/app/clients/[id]/timeline"
```

- [ ] **Step 2: Create the page file**

```tsx
import { mockClient, mockEvents } from '@/components/crm/timeline/mockData';
import TimelineHeader from '@/components/crm/timeline/TimelineHeader';
import TimelineList from '@/components/crm/timeline/TimelineList';

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params; // required in Next.js 16 — params is a Promise

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <TimelineHeader client={mockClient} />
        <TimelineList events={mockEvents} />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "src/app/clients/[id]/timeline/page.tsx"
git commit -m "feat: add CRM timeline page route (/clients/[id]/timeline)"
```

---

### Task 7: Visual QA

No code changes — visual verification only.

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```
Expected: server starts and prints `Ready on http://localhost:3000`.

- [ ] **Step 2: Open the page in a browser**

Navigate to: `http://localhost:3000/clients/james-whitfield/timeline`

- [ ] **Step 3: Run through this checklist**

| Check | Expected |
|---|---|
| Page background | Light gray (`gray-50`) |
| Customer name | "James Whitfield" — 2xl semibold |
| Tier badge | "VIP" — amber pill |
| Preferred brands | "Rolex, Patek Philippe, Audemars Piguet" |
| Lifetime value | "£384,500" — bold, xl |
| Trade-ins | "2" |
| Last interaction | "May 28, 2026" |
| Event count | 8 cards in the list |
| Order | Appointment (May 28) at top, Email (Feb 10) at bottom |
| Connector line | Faint gray vertical line on the left |
| Dots | Small circles sitting on the line, one per card |
| Animation | Cards stagger-fade in on load |
| Appointment | Indigo icon, "In-person" badge |
| Sourcing | Teal magnifying-glass icon, "Platform" badge |
| Quotation | Blue document icon, "£68,000" bold value |
| Message | Emerald chat icon, "via WhatsApp" badge |
| Purchase | Amber bag icon, "£42,500" bold value |
| Trade-in | Orange arrows icon, "£6,200" bold value |
| Call | Violet phone icon, "via Phone" badge |
| Email (oldest) | Sky envelope icon, "via Email" badge |
| No console errors | Browser devtools console is clean |

- [ ] **Step 4: Commit any visual fixes, then final commit**

```bash
git add -p
git commit -m "feat: CRM client timeline — complete prototype"
```
