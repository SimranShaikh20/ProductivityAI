import { motion } from 'framer-motion';

interface BreakdownItem {
  label: string;
  value: number;
}

interface ConfidenceBreakdownProps {
  items: BreakdownItem[];
}

export function ConfidenceBreakdown({ items }: ConfidenceBreakdownProps) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-1"
        >
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-mono font-medium text-foreground">{item.value}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.value}%` }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1, ease: "easeOut" }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
