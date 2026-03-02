import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <Heart className="w-10 h-10 text-primary fill-primary/20 mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
          Wedding Live Events
        </h1>
        <p className="text-muted-foreground font-sans mb-8 leading-relaxed">
          Stream your special moments live. Create beautiful, shareable event pages for your clients in seconds.
        </p>
        <Button size="lg" onClick={() => navigate('/admin')}>
          Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Index;
