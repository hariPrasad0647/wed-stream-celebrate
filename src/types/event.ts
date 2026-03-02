export interface WeddingEvent {
  id: string;
  couple_name: string;
  slug: string;
  event_date: string;
  banner_image_url: string;
  youtube_url: string;
  status: 'upcoming' | 'live' | 'completed';
  password_protected: boolean;
  password?: string;
  created_at: string;
}

export type EventFormData = Omit<WeddingEvent, 'id' | 'slug' | 'created_at' | 'status'>;
