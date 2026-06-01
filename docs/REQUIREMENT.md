# CRM Client Timeline — Requirements

## Context

**Retail Circle OS** is an agentic commerce platform for the luxury watch ecosystem.

**Seller** = the OS platform user (retailer, dealer, expert, concierge, etc.)
**Customer** = the individual client or collector they serve

This feature — **Every Customer Interaction in Context** — consolidates all touchpoints between a seller and a customer into one unified, chronological relationship timeline per customer. Instead of interactions being scattered across WhatsApp, email, and spreadsheets, the CRM surfaces a single view so the seller always knows the full context of any relationship.

---

## Overview

A read-only timeline component for a single customer's relationship history. Displays all interaction types in one chronological feed — from first inquiry to latest purchase or trade-in — alongside a customer summary header.

**Stack:** Next.js App Router, Tailwind CSS, TypeScript, mock data for prototype.

---

## Goals

- Give sellers a complete picture of a customer before and during any interaction
- Surface signal (preferences, open opportunities, past deals) at a glance
- Unified feed across all channel and event types — no context switching
- **Viewer first** in this prototype — no compose or send actions yet
- Architecture must support future write/action surface without a rebuild

## Non-Goals (prototype)

- No real API or database integration — mock data only
- No compose, send, or log actions
- No authentication or multi-user logic
- No real-time updates
- No mobile responsiveness (desktop-first)

---

## Event Types

These are the interaction categories that appear in the timeline:

| Type | Description | Example |
|---|---|---|
| `appointment` | Client requested or attended a meeting / showroom visit | "Booked viewing for Nautilus 5711" |
| `message` | Inbound or outbound message via WhatsApp, SMS, or chat | "Asked about Royal Oak availability" |
| `email` | Email exchange via connected inbox | "Sent condition report + photos" |
| `call` | Phone or video call, logged by seller | "15-min call — discussed trade-in options" |
| `purchase` | Completed watch purchase by the customer | "Bought Rolex Daytona 116500LN — $42,500" |
| `trade_in` | Customer traded in or part-exchanged a watch | "Traded: Omega Speedmaster (est. $6,200)" |
| `quotation` | Formal quote or sourcing request sent to customer | "Quoted Patek 5726A — $68,000" |
| `sourcing` | Seller initiated a search / sourcing request on behalf of customer | "Sourcing vintage Heuer Carrera ref. 2447" |

---

## File Structure

```
app/
  clients/
    [id]/
      timeline/
        page.tsx

components/
  crm/
    timeline/
      TimelineHeader.tsx
      TimelineList.tsx
      TimelineEventCard.tsx
      types.ts
      mockData.ts
```

---

## Components

### `TimelineHeader`

A summary card at the top of the page representing the customer.

**Props:**
```ts
client: Client
```

**Displays:**
- Full name
- Tier badge (`VIP` / `High Value` / `Standard`)
- Preferred brands / references (e.g. "Rolex, Patek Philippe, AP")
- Total lifetime purchase value (USD)
- Total number of trade-ins
- Last interaction date

---

### `TimelineList`

A scrollable, vertically stacked chronological feed of all events.

**Props:**
```ts
events: TimelineEvent[]
```

**Behavior:**
- Sorted newest → oldest
- Visual connector line between cards (left-side vertical line)
- Each event rendered via `TimelineEventCard`

---

### `TimelineEventCard`

Renders a single event. Visual treatment varies by type.

**Props:**
```ts
event: TimelineEvent
```

**Type → visual mapping:**

| Type | Icon | Accent Color |
|---|---|---|
| `appointment` | Calendar | Indigo |
| `message` | Chat bubble | Emerald |
| `email` | Envelope | Sky |
| `call` | Phone | Violet |
| `purchase` | Shopping bag | Amber |
| `trade_in` | Arrows (swap) | Orange |
| `quotation` | Document | Blue |
| `sourcing` | Magnifying glass | Teal |

**Displays per event:**
- Type icon + label
- Date and time (e.g. "May 28, 2025 · 2:30 PM")
- Title / summary (short, 1 line)
- Body (1–3 sentences of context)
- Channel badge where applicable (e.g. "via WhatsApp", "via Email", "In-person")
- Handled by (seller rep name)
- For `purchase` and `trade_in`: show monetary value prominently

---

## Types (`types.ts`)

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
  value?: number;             // USD — for purchase, trade_in, quotation
}

export interface Client {
  id: string;
  name: string;
  tier: 'VIP' | 'High Value' | 'Standard';
  preferredBrands: string[];
  lifetimeValue: number;      // USD total purchases
  tradeInCount: number;
  lastInteractionDate: string; // ISO 8601
}
```

> **Scalability note:** When write/action surface is added, extend `TimelineEvent` with optional `attachments`, `outcome`, `followUpDate`, and `status` fields. Add an `actions` prop to `TimelineEventCard` for contextual CTAs (e.g. "Send follow-up", "Log outcome", "Create quotation").

---

## Mock Data (`mockData.ts`)

**One customer, eight events spanning ~4 months, covering all event types.**

### Customer: James Whitfield
- Tier: VIP
- Preferred brands: Rolex, Patek Philippe, Audemars Piguet
- Lifetime value: $384,500
- Trade-in count: 2
- Last interaction: most recent event date

### Events (newest → oldest):

1. **`appointment`** — In-person showroom visit. Discussed upcoming Patek Philippe Nautilus 5711 allocation. Client expressed strong intent. `channel: in_person`. Handled by: Sarah K.

2. **`sourcing`** — Seller initiated sourcing for a vintage Audemars Piguet Royal Oak Jumbo ref. 5402 on client's behalf. `channel: platform`. Handled by: Sarah K.

3. **`quotation`** — Formal quote sent for Patek Philippe 5726A Annual Calendar. Value: $68,000. `channel: email`. Handled by: Sarah K.

4. **`message`** — Client confirmed interest in the 5726A via WhatsApp, asked about payment structure. `channel: whatsapp`. Handled by: Sarah K.

5. **`purchase`** — Client purchased Rolex Daytona 116500LN. Value: $42,500. `channel: in_person`. Handled by: Sarah K.

6. **`trade_in`** — Client traded in Omega Speedmaster Moonwatch. Agreed value: $6,200, applied toward Daytona purchase. `channel: in_person`. Handled by: Sarah K.

7. **`call`** — 20-minute call. Client mentioned interest in expanding into vintage pieces, specifically pre-'85 Heuer. `channel: phone`. Handled by: Marcus T.

8. **`email`** — Initial outreach confirming client's attendance at private watch showcase event. `channel: email`. Handled by: Marcus T.

---

## Page Route (`app/clients/[id]/timeline/page.tsx`)

- Accepts `params.id` — always renders mock data in prototype phase
- Layout: single column, `max-w-3xl`, centered, comfortable vertical padding
- Renders `TimelineHeader` above `TimelineList`

---

## Styling

- Tailwind CSS throughout
- Tone: clean, minimal, premium — no loud colors
- Font: Inter or system default
- Page background: `gray-50`
- Cards: white, `border border-gray-100`, subtle shadow (`shadow-sm`)
- Monetary values: display in bold, slightly larger than body text
- Channel badges: small pill, muted color (e.g. `bg-gray-100 text-gray-500`)
