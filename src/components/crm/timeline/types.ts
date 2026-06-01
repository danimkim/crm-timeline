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
