import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimeSlotCardProps {
  time: string;
  confidence: number;
  reason: string;
  onClick?: () => void;
  index?: number;
}

export function TimeSlotCard({ time, confidence, reason, onClick, index = 0 }: TimeSlotCardProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.1 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 w-full rounded-xl border border-border bg-card p-4 text-left",
        "hover:border-primary/30 hover:bg-accent/5 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/20"
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-lg font-bold text-foreground">{time}</span>
          <span className={cn("font-mono text-sm font-medium", getConfidenceColor(confidence))}>
            {confidence}%
          </span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{reason}</p>
      </div>

      <div className="h-8 w-8 rounded-full border-2 border-border flex items-center justify-center">
        <div 
          className="h-4 w-4 rounded-full bg-secondary"
          style={{
            background: `conic-gradient(hsl(var(--primary)) ${confidence}%, hsl(var(--secondary)) 0%)`
          }}
        />
      </div>
    </motion.button>
  );
}
