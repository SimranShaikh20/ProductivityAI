import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { ConfidenceScore } from '@/components/ConfidenceScore';
import { ConfidenceBreakdown } from '@/components/ConfidenceBreakdown';
import { ReasonCard } from '@/components/ReasonCard';
import { TimeSlotCard } from '@/components/TimeSlotCard';
import { CalendarPreview } from '@/components/CalendarPreview';
import { QuickActions } from '@/components/QuickActions';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { getRecommendation, submitFeedback } from '@/services/mockApi';
import { Recommendation } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function RecommendationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reasoningOpen, setReasoningOpen] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (!id) return;
      
      try {
        const data = await getRecommendation(id);
        setRecommendation(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load recommendation.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendation();
  }, [id, toast]);

  const handleFeedback = async (accepted: boolean) => {
    if (!recommendation) return;
    
    setSubmitting(true);
    try {
      await submitFeedback(recommendation.id, accepted, false);
      setRecommendation({ ...recommendation, accepted, completed: false });
      
      toast({
        title: accepted ? 'Added to your calendar! 📅' : 'Got it, noted',
        description: accepted 
          ? 'We\'ll remind you when it\'s time to start.'
          : 'We\'ll use this feedback to improve.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!recommendation) return;
    
    setSubmitting(true);
    try {
      await submitFeedback(recommendation.id, true, true);
      setRecommendation({ ...recommendation, completed: true });
      
      toast({
        title: 'Task completed! 🎉',
        description: 'Great job! This helps improve future recommendations.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark as complete.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  // Generate mock breakdown data based on confidence
  const getBreakdownItems = (confidence: number) => [
    { label: 'Context Match', value: Math.min(100, Math.round(confidence + Math.random() * 10 - 5)) },
    { label: 'Feasibility', value: Math.min(100, Math.round(confidence + Math.random() * 15)) },
    { label: 'Your History', value: Math.max(50, Math.round(confidence - Math.random() * 10)) },
  ];

  // Generate reasoning cards based on recommendation
  const getReasoningCards = (rec: Recommendation) => {
    const cards = [
      {
        icon: '⚡',
        title: 'High Energy Period',
        description: `Your energy peaks around ${rec.recommended_time.split(':')[0]}:00 based on past tasks`,
      },
      {
        icon: '📅',
        title: 'Calendar Clear',
        description: `No conflicts for ${formatDuration(rec.duration)} after this time`,
      },
      {
        icon: '✅',
        title: 'Similar Success',
        description: 'You completed 4/5 similar tasks in morning slots',
      },
    ];
    
    if (rec.warnings.length > 0) {
      cards.push({
        icon: '⚠️',
        title: 'Heads Up',
        description: rec.warnings[0],
      });
    }
    
    return cards;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" message="Loading recommendation..." />
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-2xl px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground">Recommendation not found</h1>
          <p className="mt-2 text-muted-foreground">
            The recommendation you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/new-task')} className="mt-6">
            Create New Task
          </Button>
        </div>
      </div>
    );
  }

  const breakdownItems = getBreakdownItems(recommendation.confidence);
  const reasoningCards = getReasoningCards(recommendation);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-5xl px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Status badge */}
        {recommendation.accepted !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
              recommendation.completed 
                ? 'bg-success/10 text-success' 
                : recommendation.accepted 
                ? 'bg-primary/10 text-primary' 
                : 'bg-danger/10 text-danger'
            }`}
          >
            {recommendation.completed ? '✓ Task Completed' : recommendation.accepted ? '📅 Scheduled' : 'Rejected'}
          </motion.div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h1 className="text-2xl font-bold text-foreground">
                {recommendation.task}
              </h1>
              <p className="mt-2 text-muted-foreground">
                Due: {recommendation.deadline}
              </p>
            </motion.div>

            {/* Recommended time - Hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8"
            >
              <p className="text-sm font-medium text-primary mb-3">
                Recommended Time Slot
              </p>
              <div className="flex items-baseline gap-4">
                <Clock className="h-10 w-10 text-primary" />
                <span className="font-mono text-6xl font-bold text-foreground">
                  {recommendation.recommended_time}
                </span>
              </div>
              <p className="mt-3 text-lg text-muted-foreground">
                Duration: {formatDuration(recommendation.duration)}
              </p>
            </motion.div>

            {/* Why this time? - Reasoning section */}
            <Collapsible open={reasoningOpen} onOpenChange={setReasoningOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    Why this time? 🤔
                  </h2>
                  {reasoningOpen ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {reasoningCards.map((card, index) => (
                    <ReasonCard
                      key={card.title}
                      icon={card.icon}
                      title={card.title}
                      description={card.description}
                      index={index}
                    />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Alternative times */}
            {recommendation.alternatives.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Alternative Times
                </h2>
                <div className="space-y-2">
                  {recommendation.alternatives.map((alt, index) => (
                    <TimeSlotCard
                      key={alt}
                      time={alt}
                      confidence={Math.max(50, recommendation.confidence - 10 - index * 5)}
                      reason={index === 0 ? 'Post-lunch recovery period' : 'Late afternoon focus time'}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Preview */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Schedule Preview
              </h2>
              <CalendarPreview
                recommendedTime={recommendation.recommended_time}
                duration={recommendation.duration}
                taskName={recommendation.task}
              />
            </div>
          </div>

          {/* Right column - Confidence & Actions */}
          <div className="space-y-6">
            {/* Confidence display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="text-center mb-6">
                <ConfidenceScore 
                  score={recommendation.confidence} 
                  size="lg" 
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Confidence Level
                </p>
              </div>
              
              <div className="border-t border-border pt-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Score Breakdown
                </p>
                <ConfidenceBreakdown items={breakdownItems} />
              </div>
            </motion.div>

            {/* Quick Actions */}
            {recommendation.accepted === undefined && (
              <QuickActions
                onAccept={() => handleFeedback(true)}
                onReject={() => handleFeedback(false)}
                onRetry={() => navigate('/new-task')}
                onExplain={() => setReasoningOpen(true)}
                disabled={submitting}
              />
            )}

            {/* Post-acceptance actions */}
            {recommendation.accepted && !recommendation.completed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <Button
                  variant="success"
                  size="lg"
                  className="w-full"
                  onClick={handleComplete}
                  disabled={submitting}
                >
                  <Check className="h-5 w-5" />
                  Mark as Completed
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/new-task')}
                >
                  Create Another Task
                </Button>
              </motion.div>
            )}

            {/* Completed state */}
            {recommendation.completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-xl bg-success/10 border border-success/20 p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
                  <Check className="h-6 w-6 text-success" />
                </div>
                <p className="font-semibold text-success">Task Completed!</p>
                <p className="text-sm text-success/80 mt-1">
                  Your feedback improves future suggestions.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  View Dashboard
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
