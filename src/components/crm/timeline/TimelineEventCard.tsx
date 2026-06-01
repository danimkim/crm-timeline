import type { EventType, Channel, TimelineEvent } from './types';
import { formatCurrency, formatEventDate } from '@/utils/format';

interface Props {
  event: TimelineEvent;
}

const EVENT_CONFIG: Record<EventType, { label: string; bg: string; text: string }> = {
  appointment: { label: 'Appointment', bg: 'bg-indigo-500/10',  text: 'text-indigo-400' },
  message:     { label: 'Message',     bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  email:       { label: 'Email',       bg: 'bg-sky-500/10',     text: 'text-sky-400' },
  call:        { label: 'Call',        bg: 'bg-violet-500/10',  text: 'text-violet-400' },
  purchase:    { label: 'Purchase',    bg: 'bg-amber-500/10',   text: 'text-amber-400' },
  trade_in:    { label: 'Trade-in',    bg: 'bg-orange-500/10',  text: 'text-orange-400' },
  quotation:   { label: 'Quotation',   bg: 'bg-blue-500/10',    text: 'text-blue-400' },
  sourcing:    { label: 'Sourcing',    bg: 'bg-teal-500/10',    text: 'text-teal-400' },
};

const CHANNEL_LABEL: Record<Channel, string> = {
  whatsapp:  'via WhatsApp',
  email:     'via Email',
  phone:     'via Phone',
  in_person: 'In-person',
  platform:  'Platform',
};

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
    <div className="bg-(--bg-surface) border border-(--border-subtle) shadow-sm rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div
          className={`shrink-0 flex items-center justify-center w-9 h-9 rounded-lg ${config.bg} ${config.text}`}
        >
          <EventIcon type={event.type} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold uppercase tracking-wide ${config.text}`}>
              {config.label}
            </span>
            {event.channel && (
              <span className="text-xs bg-(--bg-elevated) text-(--text-muted) px-2 py-0.5 rounded-full">
                {CHANNEL_LABEL[event.channel]}
              </span>
            )}
          </div>

          <p className="text-xs text-(--text-muted) mt-0.5">{formatEventDate(event.date)}</p>

          <h3 className="mt-2 text-sm font-semibold text-(--text-primary) leading-snug">
            {event.title}
          </h3>
          <p className="mt-1 text-sm text-(--text-secondary) leading-relaxed">{event.body}</p>

          {showValue && (
            <p className="mt-3 text-base font-bold text-(--text-primary)">
              {formatCurrency(event.value!)}
            </p>
          )}

          <p className="mt-3 text-xs text-(--text-muted)">
            Handled by{' '}
            <span className="text-(--text-secondary)">{event.handledBy}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
