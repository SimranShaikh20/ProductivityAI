import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ReasonCardProps {
  icon: string;
  title: string;
  description: string;
  index?: number;
}

export function ReasonCard({ icon, title, description, index = 0 }: ReasonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        "hover:border-primary/30 hover:shadow-md transition-all duration-200"
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground">{title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
