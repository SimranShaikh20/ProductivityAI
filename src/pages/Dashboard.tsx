import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  CheckCircle2, 
  Target, 
  Sparkles,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { MetricCard } from '@/components/MetricCard';
import { RecommendationCard } from '@/components/RecommendationCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getMetrics, getRecommendations, submitFeedback } from '@/services/mockApi';
import { UserMetrics, Recommendation } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsData, recsData] = await Promise.all([
          getMetrics('user_123'),
          getRecommendations('user_123'),
        ]);
        setMetrics(metricsData);
        setRecommendations(recsData);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  const handleAccept = async (id: string) => {
    await submitFeedback(id, true, false);
    setRecommendations(prev => 
      prev.map(r => r.id === id ? { ...r, accepted: true } : r)
    );
    toast({ title: 'Recommendation accepted!' });
  };

  const handleReject = async (id: string) => {
    await submitFeedback(id, false, false);
    setRecommendations(prev => 
      prev.map(r => r.id === id ? { ...r, accepted: false } : r)
    );
    toast({ title: 'Recommendation rejected' });
  };

  const handleComplete = async (id: string) => {
    await submitFeedback(id, true, true);
    setRecommendations(prev => 
      prev.map(r => r.id === id ? { ...r, completed: true } : r)
    );
    toast({ title: 'Task completed! 🎉' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" message="Loading dashboard..." />
        </div>
      </div>
    );
  }

  const chartData = metrics?.recent_scores.map((score, index) => ({
    name: `Day ${index + 1}`,
    confidence: Math.round(score * 100),
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 py-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track your productivity improvements over time
            </p>
          </motion.div>
          
          <Link to="/new-task">
            <Button variant="hero">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>

        {/* Metrics Grid */}
        {metrics && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Recommendations"
              value={metrics.total_recommendations}
              icon={BarChart3}
              delay={0}
            />
            <MetricCard
              title="Acceptance Rate"
              value={`${Math.round(metrics.acceptance_rate * 100)}%`}
              icon={Target}
              trend={metrics.trend}
              delay={0.1}
            />
            <MetricCard
              title="Completion Rate"
              value={`${Math.round(metrics.completion_rate * 100)}%`}
              icon={CheckCircle2}
              delay={0.2}
            />
            <MetricCard
              title="Avg. Confidence"
              value={`${Math.round(metrics.avg_confidence * 100)}%`}
              icon={Sparkles}
              delay={0.3}
            />
          </div>
        )}

        {/* Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-foreground">
              Confidence Trend
            </h2>
            <p className="text-sm text-muted-foreground">
              AI confidence scores over your recent recommendations
            </p>
            
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(220, 13%, 91%)"
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[60, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(220, 13%, 91%)',
                      borderRadius: '0.75rem',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{ color: 'hsl(222, 47%, 11%)' }}
                    formatter={(value: number) => [`${value}%`, 'Confidence']}
                  />
                  <Area
                    type="monotone"
                    dataKey="confidence"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    fill="url(#confidenceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Recent Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Recent Recommendations
            </h2>
          </div>
          
          <div className="mt-4 space-y-4">
            {recommendations.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-8 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  No recommendations yet
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Create your first task to get AI-powered scheduling suggestions.
                </p>
                <Link to="/new-task">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                </Link>
              </div>
            ) : (
              recommendations.slice(0, 5).map((rec) => (
                <Link key={rec.id} to={`/recommendation/${rec.id}`}>
                  <RecommendationCard
                    recommendation={rec}
                    compact
                    showActions={false}
                    onAccept={() => handleAccept(rec.id)}
                    onReject={() => handleReject(rec.id)}
                    onComplete={() => handleComplete(rec.id)}
                  />
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
