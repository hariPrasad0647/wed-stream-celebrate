import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import { getEvents, deleteEvent, refreshStatuses } from '@/lib/events';
import { WeddingEvent } from '@/types/event';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const LiveEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    refreshStatuses();
    setEvents(getEvents());
  };

  useEffect(() => { load(); }, []);

  const handleDelete = () => {
    if (deleteId) {
      deleteEvent(deleteId);
      toast.success('Event deleted');
      load();
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary fill-primary" />
            <h1 className="text-xl font-serif font-bold text-foreground">Live Events</h1>
          </div>
          <Button onClick={() => navigate('/admin/events/new')}>
            <Plus className="w-4 h-4 mr-2" /> New Event
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-serif text-muted-foreground mb-2">No events yet</h2>
            <p className="text-sm text-muted-foreground mb-6">Create your first live wedding event</p>
            <Button onClick={() => navigate('/admin/events/new')}>
              <Plus className="w-4 h-4 mr-2" /> Create Event
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={id => navigate(`/admin/events/${id}/edit`)}
                onDelete={id => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The event page will no longer be accessible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LiveEvents;
