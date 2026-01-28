import { motion } from 'framer-motion';
import { Check, X, RefreshCw, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onAccept: () => void;
  onReject: () => void;
  onRetry?: () => void;
  onExplain?: () => void;
  disabled?: boolean;
}

export function QuickActions({ 
  onAccept, 
  onReject, 
  onRetry, 
  onExplain,
  disabled = false 
}: QuickActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-3"
    >
      {/* Primary actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button
          variant="success"
          size="lg"
          className="w-full"
          onClick={onAccept}
          disabled={disabled}
        >
          <Check className="h-5 w-5" />
          Accept & Add to Calendar
          <Calendar className="h-4 w-4 ml-1 opacity-70" />
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="w-full border-danger/30 text-danger hover:bg-danger/10 hover:text-danger"
          onClick={onReject}
          disabled={disabled}
        >
          <X className="h-5 w-5" />
          This won't work
        </Button>
      </div>
      
      {/* Secondary actions */}
      <div className="flex gap-2">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={onRetry}
            disabled={disabled}
          >
            <RefreshCw className="h-4 w-4" />
            Try different time
          </Button>
        )}
        
        {onExplain && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={onExplain}
            disabled={disabled}
          >
            <MessageCircle className="h-4 w-4" />
            Tell me why
          </Button>
        )}
      </div>
    </motion.div>
  );
}
