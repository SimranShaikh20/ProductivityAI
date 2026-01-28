import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'improving' | 'stable' | 'declining';
  icon?: LucideIcon;
  delay?: number;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend,
  icon: Icon,
  delay = 0 
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'improving') return TrendingUp;
    if (trend === 'declining') return TrendingDown;
    return Minus;
  };
  
  const getTrendColor = () => {
    if (trend === 'improving') return 'text-success bg-success/10';
    if (trend === 'declining') return 'text-danger bg-danger/10';
    return 'text-muted-foreground bg-muted';
  };
  
  const TrendIcon = getTrendIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/5" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.p 
              className="mt-2 text-4xl font-bold tracking-tight text-foreground"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring" }}
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            
            {trend && (
              <motion.div 
                className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                  getTrendColor()
                )}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.3 }}
              >
                <TrendIcon className="h-3 w-3" />
                <span className="capitalize">{trend}</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
