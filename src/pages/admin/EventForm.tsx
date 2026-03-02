import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save } from 'lucide-react';
import { createEvent, getEventById, updateEvent } from '@/lib/events';
import { isValidYouTubeUrl } from '@/lib/youtube';
import { toast } from 'sonner';

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    couple_name: '',
    event_date: '',
    banner_image_url: '',
    youtube_url: '',
    password_protected: false,
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const event = getEventById(id);
      if (event) {
        setForm({
          couple_name: event.couple_name,
          event_date: event.event_date.slice(0, 16),
          banner_image_url: event.banner_image_url,
          youtube_url: event.youtube_url,
          password_protected: event.password_protected,
          password: event.password || '',
        });
      }
    }
  }, [id]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.couple_name.trim()) errs.couple_name = 'Couple name is required';
    if (!form.event_date) errs.event_date = 'Event date is required';
    if (!form.youtube_url.trim()) errs.youtube_url = 'YouTube URL is required';
    else if (!isValidYouTubeUrl(form.youtube_url)) errs.youtube_url = 'Invalid YouTube URL';
    if (form.password_protected && !form.password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && id) {
      updateEvent(id, form);
      toast.success('Event updated successfully!');
    } else {
      createEvent(form);
      toast.success('Event created successfully!');
    }
    navigate('/admin');
  };

  const update = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>

        <h1 className="text-3xl font-serif font-bold text-foreground mb-8">
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="couple_name">Couple Name</Label>
            <Input
              id="couple_name"
              placeholder="e.g., Rahul Weds Anitha"
              value={form.couple_name}
              onChange={e => update('couple_name', e.target.value)}
            />
            {form.couple_name && (
              <p className="text-xs text-muted-foreground">
                Slug: <span className="font-mono text-primary">{form.couple_name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')}</span>
              </p>
            )}
            {errors.couple_name && <p className="text-xs text-destructive">{errors.couple_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Event Date & Time</Label>
            <Input
              id="event_date"
              type="datetime-local"
              value={form.event_date}
              onChange={e => update('event_date', e.target.value)}
            />
            {errors.event_date && <p className="text-xs text-destructive">{errors.event_date}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner_image_url">Banner Image URL</Label>
            <Input
              id="banner_image_url"
              placeholder="https://example.com/banner.jpg"
              value={form.banner_image_url}
              onChange={e => update('banner_image_url', e.target.value)}
            />
            {form.banner_image_url && (
              <div className="mt-2 rounded-lg overflow-hidden border border-border h-32">
                <img src={form.banner_image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube_url">YouTube Live URL</Label>
            <Input
              id="youtube_url"
              placeholder="https://youtube.com/watch?v=... or https://youtube.com/live/..."
              value={form.youtube_url}
              onChange={e => update('youtube_url', e.target.value)}
            />
            {errors.youtube_url && <p className="text-xs text-destructive">{errors.youtube_url}</p>}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <Label className="text-sm font-medium">Password Protected</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Require password to view event</p>
            </div>
            <Switch
              checked={form.password_protected}
              onCheckedChange={v => update('password_protected', v)}
            />
          </div>

          {form.password_protected && (
            <div className="space-y-2">
              <Label htmlFor="password">Event Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg">
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? 'Update Event' : 'Create Event'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
