import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ConfidenceScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function ConfidenceScore({ 
  score, 
  size = 'md', 
  showLabel = true,
  animated = true 
}: ConfidenceScoreProps) {
  const percentage = Math.round(score * 100);
  
  const dimensions = {
    sm: { width: 60, strokeWidth: 4, fontSize: 'text-sm' },
    md: { width: 100, strokeWidth: 6, fontSize: 'text-2xl' },
    lg: { width: 140, strokeWidth: 8, fontSize: 'text-4xl' },
  };
  
  const { width, strokeWidth, fontSize } = dimensions[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score * circumference);
  
  const getColor = () => {
    if (score >= 0.8) return 'text-success stroke-success';
    if (score >= 0.6) return 'text-warning stroke-warning';
    return 'text-danger stroke-danger';
  };
  
  const getLabel = () => {
    if (score >= 0.9) return 'Excellent';
    if (score >= 0.8) return 'Very High';
    if (score >= 0.7) return 'High';
    if (score >= 0.6) return 'Good';
    return 'Needs Review';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height: width }}>
        {/* Background circle */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={width}
          height={width}
        >
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border"
          />
        </svg>
        
        {/* Progress circle */}
        <motion.svg
          className={cn("absolute inset-0 -rotate-90", getColor())}
          width={width}
          height={width}
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 1 } : undefined}
        >
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.svg>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span 
            className={cn("font-bold", fontSize, getColor().split(' ')[0])}
            initial={animated ? { scale: 0.5, opacity: 0 } : undefined}
            animate={animated ? { scale: 1, opacity: 1 } : undefined}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      
      {showLabel && (
        <motion.span 
          className="text-sm font-medium text-muted-foreground"
          initial={animated ? { opacity: 0, y: 5 } : undefined}
          animate={animated ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.8 }}
        >
          {getLabel()} Confidence
        </motion.span>
      )}
    </div>
  );
}
