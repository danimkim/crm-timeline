import type { Client } from './types';
import { formatCurrency, formatDate } from '@/utils/format';
import { TIER_STYLES } from './constants';

interface Props {
  client: Client;
}

const STAT_LABEL = 'text-xs text-(--text-muted) uppercase tracking-wide mb-1';

export default function TimelineHeader({ client }: Props) {
  return (
    <div className="bg-(--bg-surface) border border-(--border-subtle) shadow-sm rounded-xl p-6 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-(--text-primary) tracking-tight">
            {client.name}
          </h1>
          <span
            className={`mt-2 inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${TIER_STYLES[client.tier]}`}
          >
            {client.tier}
          </span>
        </div>
        <p className="text-sm text-(--text-muted) text-right whitespace-nowrap">
          Last interaction
          <br />
          <span className="text-(--text-secondary) font-medium">
            {formatDate(client.lastInteractionDate)}
          </span>
        </p>
      </div>

      <div className="mt-5 pt-5 border-t border-(--border-subtle) grid grid-cols-3 gap-6">
        <div>
          <p className={STAT_LABEL}>
            Preferred Brands
          </p>
          <p className="text-sm text-(--text-secondary)">
            {client.preferredBrands.join(', ')}
          </p>
        </div>
        <div>
          <p className={STAT_LABEL}>
            Lifetime Value
          </p>
          <p className="text-xl font-bold text-(--text-primary)">
            {formatCurrency(client.lifetimeValue)}
          </p>
        </div>
        <div>
          <p className={STAT_LABEL}>
            Trade-ins
          </p>
          <p className="text-xl font-bold text-(--text-primary)">
            {client.tradeInCount}
          </p>
        </div>
      </div>
    </div>
  );
}
