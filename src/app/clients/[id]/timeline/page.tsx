import {mockClient, mockEvents } from '@/data/timeline'
import TimelineHeader from '@/components/crm/timeline/TimelineHeader';
import TimelineList from '@/components/crm/timeline/TimelineList';

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params; // required in Next.js 16 — params is a Promise

  return (
    <main className="min-h-screen bg-[var(--bg-body)] py-12">
      <div className="max-w-3xl mx-auto px-6">
        <TimelineHeader client={mockClient} />
        <TimelineList events={mockEvents} />
      </div>
    </main>
  );
}
