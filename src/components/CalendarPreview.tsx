import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimeSlot {
  time: string;
  label?: string;
  type?: 'recommended' | 'busy' | 'free';
  duration?: number; // in 30-min blocks
}

interface CalendarPreviewProps {
  recommendedTime: string;
  duration: number; // in minutes
  taskName: string;
}

export function CalendarPreview({ recommendedTime, duration, taskName }: CalendarPreviewProps) {
  // Parse recommended time
  const [hours] = recommendedTime.split(':').map(Number);
  const startHour = Math.max(8, hours - 1);
  const endHour = Math.min(18, hours + Math.ceil(duration / 60) + 1);
  
  const durationBlocks = Math.ceil(duration / 30);

  const timeSlots: TimeSlot[] = [];
  
  for (let h = startHour; h <= endHour; h++) {
    const timeStr = `${h.toString().padStart(2, '0')}:00`;
    const halfStr = `${h.toString().padStart(2, '0')}:30`;
    
    if (h === hours) {
      timeSlots.push({ 
        time: timeStr, 
        label: taskName,
        type: 'recommended',
        duration: durationBlocks
      });
    } else if (h === 12) {
      timeSlots.push({ time: timeStr, label: 'Lunch Break', type: 'busy', duration: 2 });
    } else if (h > hours && h < hours + Math.ceil(duration / 60)) {
      // Skip hours that are part of the recommended block
      continue;
    } else {
      timeSlots.push({ time: timeStr, type: 'free' });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-border bg-card overflow-hidden"
    >
      <div className="border-b border-border bg-surface px-4 py-2">
        <p className="text-sm font-medium text-foreground">Today's Schedule</p>
      </div>
      
      <div className="p-2">
        {timeSlots.map((slot, index) => (
          <div key={slot.time} className="flex items-stretch min-h-[40px]">
            {/* Time label */}
            <div className="w-14 flex-shrink-0 pr-2 text-right">
              <span className="text-xs font-mono text-muted-foreground">{slot.time}</span>
            </div>
            
            {/* Slot visualization */}
            <div className="flex-1 relative">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
              
              {slot.type === 'recommended' && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                  className={cn(
                    "ml-2 rounded-lg bg-primary/20 border-l-4 border-primary px-3 py-2 origin-left",
                    slot.duration && slot.duration > 2 ? "min-h-[80px]" : ""
                  )}
                  style={{ 
                    height: slot.duration ? `${slot.duration * 20}px` : 'auto',
                    minHeight: '40px'
                  }}
                >
                  <p className="text-sm font-medium text-primary truncate">{slot.label}</p>
                  <p className="text-xs text-primary/70">Recommended</p>
                </motion.div>
              )}
              
              {slot.type === 'busy' && (
                <div className="ml-2 rounded-lg bg-muted/50 border-l-4 border-muted-foreground/30 px-3 py-2">
                  <p className="text-sm text-muted-foreground">{slot.label}</p>
                </div>
              )}
              
              {slot.type === 'free' && (
                <div className="ml-2 h-full min-h-[40px] flex items-center">
                  <div className="w-full h-px bg-border/50" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
