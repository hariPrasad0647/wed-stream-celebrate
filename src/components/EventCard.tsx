import { WeddingEvent } from '@/types/event';
import { format } from 'date-fns';
import { Calendar, ExternalLink, Pencil, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { toast } from 'sonner';

interface EventCardProps {
  event: WeddingEvent;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusColors: Record<WeddingEvent['status'], string> = {
  upcoming: 'bg-accent/20 text-accent-foreground border-accent/30',
  live: 'bg-destructive/10 text-destructive border-destructive/30',
  completed: 'bg-muted text-muted-foreground border-border',
};

const EventCard = ({ event, onEdit, onDelete }: EventCardProps) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/live/${event.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {event.banner_image_url && (
        <div className="h-36 overflow-hidden">
          <img
            src={event.banner_image_url}
            alt={event.couple_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg font-semibold text-foreground leading-tight">
            {event.couple_name}
          </h3>
          <Badge variant="outline" className={statusColors[event.status]}>
            {event.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(event.event_date), 'PPp')}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted rounded-md px-2 py-1.5">
          <span className="truncate flex-1">{shareUrl}</span>
          <button onClick={handleCopy} className="ml-1 flex-shrink-0 hover:text-primary transition-colors">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(event.id)}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open(`/live/${event.slug}`, '_blank')}>
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => onDelete(event.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
