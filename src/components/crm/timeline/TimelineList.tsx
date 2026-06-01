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
        className="absolute left-[5px] top-0 bottom-0 w-px bg-[var(--border-subtle)]"
        aria-hidden="true"
      />
      <ul className="space-y-4">
        {sorted.map((event) => (
          <li key={event.id} className="relative timeline-entry pl-8">
            {/* Dot sitting on the connector line */}
            <div
              className="absolute left-0 top-[18px] w-3 h-3 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--border-strong)]"
              aria-hidden="true"
            />
            <TimelineEventCard event={event} />
          </li>
        ))}
      </ul>
    </div>
  );
}
