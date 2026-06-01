# CRM Client Timeline

A unified relationship timeline for luxury watch dealers. Built as part of **Retail Circle OS**, an agentic commerce platform for the watch industry.

---

## The Problem

Seller–client relationships in the luxury watch world live across WhatsApp threads, email inboxes, call logs, and spreadsheets. Before any conversation, a seller has to mentally reconstruct the full history of that relationship from scattered sources.

This feature consolidates every touchpoint — messages, calls, purchases, trade-ins, sourcing requests — into a single chronological feed per client. The seller always has full context, before they say hello.

---

## What's Built

A read-only CRM timeline for a single client, rendered as a scrollable feed of interaction cards. Scoped to viewer-only for this MVP — compose and action surfaces are intentionally deferred, but the architecture is designed to support them without a rebuild.

### Event Types

| Type          | Description                                      |
| ------------- | ------------------------------------------------ |
| `appointment` | Showroom visits and scheduled meetings           |
| `message`     | Inbound/outbound WhatsApp, SMS, or chat          |
| `email`       | Email exchanges via connected inbox              |
| `call`        | Phone or video calls logged by the seller        |
| `purchase`    | Completed watch purchases with transaction value |
| `trade_in`    | Part-exchanges, with agreed value                |
| `quotation`   | Formal quotes or sourcing proposals              |
| `sourcing`    | Active searches initiated on the client's behalf |

Each card shows the event type, timestamp, summary, channel (e.g. "via WhatsApp", "In-person"), the handling seller, and — for financial events — the monetary value.

### Client Header

Above the feed, a summary header surfaces key client signals at a glance: tier (`VIP` / `High Value` / `Standard`), preferred brands, lifetime purchase value, trade-in history, and last interaction date.

---

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4**
- Mock data — no backend in this prototype

---

## Preview

Navigate to `/clients/[id]/timeline` to view the timeline. The prototype renders a fixed mock client — **James Whitfield**, VIP tier, ￡384,500 lifetime value — across all 8 event types.

---

## Project Structure

```
src/
├── app/
│   └── clients/[id]/timeline/
│       └── page.tsx           # Route entry point
├── components/
│   └── crm/timeline/
│       ├── TimelineHeader.tsx # Client summary card
│       ├── TimelineList.tsx   # Scrollable event feed
│       ├── TimelineEventCard.tsx # Individual event card
│       └── types.ts           # Shared TypeScript types
├── data/
│   └── timeline.ts            # Mock client + event data
└── utils/
    └── format.ts              # Date and currency formatting
```
