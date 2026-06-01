import type { Client } from './types';

interface Props {
  client: Client;
}

const TIER_STYLES: Record<Client['tier'], string> = {
  'VIP':        'bg-[#8C60F7]/15 text-[#CEA7F9]',
  'High Value': 'bg-[#3B82F6]/15 text-[#93C5FD]',
  'Standard':   'bg-[var(--bg-elevated)] text-[var(--text-secondary)]',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-GB', {
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
    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm rounded-xl p-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight">
            {client.name}
          </h1>
          <span
            className={`mt-2 inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${TIER_STYLES[client.tier]}`}
          >
            {client.tier}
          </span>
        </div>
        <p className="text-sm text-[var(--text-muted)] text-right whitespace-nowrap">
          Last interaction
          <br />
          <span className="text-[var(--text-secondary)] font-medium">
            {formatDate(client.lastInteractionDate)}
          </span>
        </p>
      </div>

      <div className="mt-5 pt-5 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
            Preferred Brands
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            {client.preferredBrands.join(', ')}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
            Lifetime Value
          </p>
          <p className="text-xl font-bold text-[var(--text-primary)]">
            {formatCurrency(client.lifetimeValue)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-1">
            Trade-ins
          </p>
          <p className="text-xl font-bold text-[var(--text-primary)]">{client.tradeInCount}</p>
        </div>
      </div>
    </div>
  );
}
