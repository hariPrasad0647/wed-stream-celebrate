import { WeddingEvent } from '@/types/event';

const STORAGE_KEY = 'wedding_events';

function generateSlug(coupleName: string): string {
  return coupleName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getEvents(): WeddingEvent[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getEventBySlug(slug: string): WeddingEvent | undefined {
  return getEvents().find(e => e.slug === slug);
}

export function getEventById(id: string): WeddingEvent | undefined {
  return getEvents().find(e => e.id === id);
}

function computeStatus(eventDate: string): WeddingEvent['status'] {
  const now = new Date();
  const event = new Date(eventDate);
  const diffMs = event.getTime() - now.getTime();
  if (diffMs > 0) return 'upcoming';
  // Consider "live" for 4 hours after start
  if (diffMs > -4 * 60 * 60 * 1000) return 'live';
  return 'completed';
}

export function createEvent(data: {
  couple_name: string;
  event_date: string;
  banner_image_url: string;
  youtube_url: string;
  password_protected: boolean;
  password?: string;
  left_image_url?: string;
  right_image_url?: string;
  photographer_name?: string;
  photographer_phone?: string;
}): WeddingEvent {
  const events = getEvents();
  let slug = generateSlug(data.couple_name);
  
  const existingSlugs = events.map(e => e.slug);
  let counter = 1;
  let finalSlug = slug;
  while (existingSlugs.includes(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const event: WeddingEvent = {
    id: crypto.randomUUID(),
    couple_name: data.couple_name,
    slug: finalSlug,
    event_date: data.event_date,
    banner_image_url: data.banner_image_url,
    youtube_url: data.youtube_url,
    status: computeStatus(data.event_date),
    password_protected: data.password_protected,
    password: data.password,
    left_image_url: data.left_image_url || undefined,
    right_image_url: data.right_image_url || undefined,
    photographer_name: data.photographer_name || undefined,
    photographer_phone: data.photographer_phone || undefined,
    created_at: new Date().toISOString(),
  };

  events.push(event);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  return event;
}

export function updateEvent(id: string, data: Partial<WeddingEvent>): WeddingEvent | null {
  const events = getEvents();
  const idx = events.findIndex(e => e.id === id);
  if (idx === -1) return null;

  if (data.couple_name && data.couple_name !== events[idx].couple_name) {
    data.slug = generateSlug(data.couple_name);
  }
  if (data.event_date) {
    data.status = computeStatus(data.event_date);
  }

  events[idx] = { ...events[idx], ...data };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  return events[idx];
}

export function deleteEvent(id: string): boolean {
  const events = getEvents();
  const filtered = events.filter(e => e.id !== id);
  if (filtered.length === events.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function refreshStatuses(): void {
  const events = getEvents();
  const updated = events.map(e => ({ ...e, status: computeStatus(e.event_date) }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
