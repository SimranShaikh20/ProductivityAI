import { motion } from 'framer-motion';
import { Clock, Calendar, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfidenceScore } from '@/components/ConfidenceScore';
import { Recommendation } from '@/types';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAccept?: () => void;
  onReject?: () => void;
  onComplete?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function RecommendationCard({
  recommendation,
  onAccept,
  onReject,
  onComplete,
  showActions = true,
  compact = false,
}: RecommendationCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm",
        compact ? "p-4" : "p-6"
      )}
    >
      {/* Status badge */}
      {recommendation.accepted !== undefined && (
        <div className={cn(
          "absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium",
          recommendation.completed 
            ? "bg-success/10 text-success" 
            : recommendation.accepted 
            ? "bg-primary/10 text-primary" 
            : "bg-danger/10 text-danger"
        )}>
          {recommendation.completed ? 'Completed' : recommendation.accepted ? 'Accepted' : 'Rejected'}
        </div>
      )}

      <div className={cn("flex gap-6", compact ? "flex-col" : "flex-col lg:flex-row lg:items-start")}>
        {/* Main content */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className={cn(
              "font-semibold text-foreground",
              compact ? "text-base" : "text-xl"
            )}>
              {recommendation.task}
            </h3>
            
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="font-mono font-medium text-foreground">
                  {recommendation.recommended_time}
                </span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <span>{formatDuration(recommendation.duration)}</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Due {recommendation.deadline}</span>
              </div>
            </div>
          </div>

          {/* Reasoning */}
          {!compact && (
            <div className="rounded-xl bg-surface p-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {recommendation.reasoning}
              </p>
            </div>
          )}

          {/* Alternatives */}
          {!compact && recommendation.alternatives.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">
                Alternative times:
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendation.alternatives.map((alt) => (
                  <span
                    key={alt}
                    className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-mono font-medium text-secondary-foreground"
                  >
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {recommendation.warnings.length > 0 && (
            <div className="flex items-start gap-2 rounded-xl bg-warning/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
              <div className="text-sm text-warning">
                {recommendation.warnings.map((warning, i) => (
                  <p key={i}>{warning}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confidence score */}
        <div className="flex flex-col items-center gap-4">
          <ConfidenceScore 
            score={recommendation.confidence} 
            size={compact ? 'sm' : 'md'} 
            animated={!compact}
          />
          
          {/* Actions */}
          {showActions && !recommendation.accepted && (
            <div className="flex gap-2">
              <Button
                variant="success"
                size={compact ? "sm" : "default"}
                onClick={onAccept}
              >
                <Check className="h-4 w-4" />
                Accept
              </Button>
              <Button
                variant="outline"
                size={compact ? "sm" : "default"}
                onClick={onReject}
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
          
          {showActions && recommendation.accepted && !recommendation.completed && (
            <Button
              variant="success"
              size={compact ? "sm" : "default"}
              onClick={onComplete}
            >
              <Check className="h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
