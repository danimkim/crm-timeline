import type { EventType, Channel, Client } from './types';

export const EVENT_CONFIG: Record<
  EventType,
  { label: string; bg: string; text: string }
> = {
  appointment: {
    label: 'Appointment',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
  },
  message: {
    label: 'Message',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  email: { label: 'Email', bg: 'bg-sky-500/10', text: 'text-sky-400' },
  call: { label: 'Call', bg: 'bg-violet-500/10', text: 'text-violet-400' },
  purchase: {
    label: 'Purchase',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  trade_in: {
    label: 'Trade-in',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
  },
  quotation: {
    label: 'Quotation',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  sourcing: { label: 'Sourcing', bg: 'bg-teal-500/10', text: 'text-teal-400' },
};

export const CHANNEL_LABEL: Record<Channel, string> = {
  whatsapp: 'via WhatsApp',
  email: 'via Email',
  phone: 'via Phone',
  in_person: 'In-person',
  platform: 'Platform',
};

export const TIER_STYLES: Record<Client['tier'], string> = {
  VIP: 'bg-[--color-brand-primary]/15 text-[--color-brand-secondary]',
  'High Value': 'bg-[--color-state-info]/15 text-[--color-state-info-text]',
  Standard: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]',
};
