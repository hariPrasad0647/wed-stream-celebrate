import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getEventBySlug } from '@/lib/events';
import { getEmbedUrl } from '@/lib/youtube';
import { WeddingEvent } from '@/types/event';
import CountdownTimer from '@/components/CountdownTimer';
import { format } from 'date-fns';
import { Calendar, Copy, Check, Heart, Camera, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const LiveEventPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState<WeddingEvent | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const found = getEventBySlug(slug);
    if (found) {
      setEvent(found);
      setIsLive(new Date(found.event_date).getTime() <= Date.now());
    } else {
      setNotFound(true);
    }
  }, [slug]);

  useEffect(() => {
    if (!event) return;
    const timer = setInterval(() => {
      setIsLive(new Date(event.event_date).getTime() <= Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, [event]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h1 className="text-2xl font-serif text-foreground mb-2">Event Not Found</h1>
          <p className="text-muted-foreground">This event doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const embedUrl = getEmbedUrl(event.youtube_url);
  const hasLeftImage = !!event.left_image_url;
  const hasRightImage = !!event.right_image_url;
  const hasSideImages = hasLeftImage || hasRightImage;
  const hasPhotographer = !!event.photographer_name;

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        {event.banner_image_url ? (
          <img
            src={event.banner_image_url}
            alt={event.couple_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 p-6 sm:p-10"
        >
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-primary font-sans font-medium mb-2">
              Live Wedding Ceremony
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
              {event.couple_name}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-3 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span className="font-sans text-sm">{format(new Date(event.event_date), 'PPPP · p')}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-10">
        {/* Countdown or Live badge */}
        {!isLive ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-y-4"
          >
            <p className="text-sm text-muted-foreground font-sans">Event starts in</p>
            <CountdownTimer targetDate={event.event_date} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              Live Now
            </span>
          </motion.div>
        )}

        {/* YouTube Embed with Side Images */}
        {isLive && embedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex flex-col ${hasSideImages ? 'lg:flex-row' : ''} items-center gap-4 lg:gap-6`}
          >
            {/* Left Image */}
            {hasLeftImage && (
              <div className="w-full lg:w-[22%] flex-shrink-0 order-2 lg:order-1">
                <img
                  src={event.left_image_url}
                  alt="Left side"
                  className="w-full h-auto max-h-[300px] lg:max-h-none lg:h-full object-cover rounded-xl shadow-md border border-border"
                />
              </div>
            )}

            {/* YouTube Player */}
            <div className={`w-full ${hasSideImages ? 'lg:flex-1' : 'max-w-4xl mx-auto'} order-1 lg:order-2`}>
              <div className="aspect-video rounded-xl overflow-hidden border border-border shadow-lg">
                <iframe
                  src={embedUrl}
                  title={event.couple_name}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Right Image */}
            {hasRightImage && (
              <div className="w-full lg:w-[22%] flex-shrink-0 order-3">
                <img
                  src={event.right_image_url}
                  alt="Right side"
                  className="w-full h-auto max-h-[300px] lg:max-h-none lg:h-full object-cover rounded-xl shadow-md border border-border"
                />
              </div>
            )}
          </motion.div>
        )}

        {!isLive && embedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="aspect-video rounded-xl overflow-hidden border border-border bg-card flex items-center justify-center max-w-4xl mx-auto"
          >
            <div className="text-center space-y-3 p-8">
              <Heart className="w-12 h-12 text-primary/30 mx-auto" />
              <p className="font-serif text-lg text-foreground">The stream will appear here when the event goes live</p>
              <p className="text-sm text-muted-foreground">Please check back at the scheduled time</p>
            </div>
          </motion.div>
        )}

        {/* Share */}
        <div className="flex justify-center">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card text-sm text-foreground hover:bg-muted transition-colors font-sans"
          >
            {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Share this event'}
          </button>
        </div>

        {/* Photographer Footer */}
        {hasPhotographer && (
          <div className="text-center pt-8 border-t border-border space-y-2">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Camera className="w-4 h-4 text-primary/60" />
              <p className="text-sm font-sans">
                Photography by <span className="font-medium text-foreground">{event.photographer_name}</span>
              </p>
            </div>
            {event.photographer_phone && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Phone className="w-3.5 h-3.5 text-primary/60" />
                <p className="text-sm font-sans">{event.photographer_phone}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={`text-center ${hasPhotographer ? 'pt-4' : 'pt-8 border-t border-border'}`}>
          <Heart className="w-4 h-4 text-primary/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground font-sans">
            Made with love
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveEventPage;
