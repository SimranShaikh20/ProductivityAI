import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const dimensions = {
    sm: { container: 'w-10 h-10', icon: 'h-5 w-5', ring: 40 },
    md: { container: 'w-16 h-16', icon: 'h-8 w-8', ring: 64 },
    lg: { container: 'w-24 h-24', icon: 'h-12 w-12', ring: 96 },
  };
  
  const { container, icon, ring } = dimensions[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={cn("relative", container)}>
        {/* Rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Pulsing brain icon */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Brain className={cn(icon, "text-primary")} />
        </motion.div>
        
        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/20"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
      
      {message && (
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
