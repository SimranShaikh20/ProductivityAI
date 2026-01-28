import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Zap, Battery, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { AgentProgressIndicator } from '@/components/AgentProgressIndicator';
import { analyzeTask } from '@/services/mockApi';
import { AgentStatus, TaskInput } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function NewTask() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [task, setTask] = useState('');
  const [deadline, setDeadline] = useState('');
  const [energyLevel, setEnergyLevel] = useState(7);
  const [calendarDensity, setCalendarDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agents, setAgents] = useState<AgentStatus[]>([
    { name: 'Task Analyzer', status: 'pending', icon: 'brain', color: 'primary' },
    { name: 'Context Agent', status: 'pending', icon: 'eye', color: 'purple' },
    { name: 'Scheduler Agent', status: 'pending', icon: 'calendar', color: 'green' },
    { name: 'Meta-Evaluator', status: 'pending', icon: 'shield', color: 'yellow' },
  ]);

  const updateAgentStatus = (index: number, status: AgentStatus['status']) => {
    setAgents(prev => prev.map((agent, i) => 
      i === index ? { ...agent, status } : agent
    ));
  };

  const simulateAgentWorkflow = async () => {
    // Task Analyzer
    updateAgentStatus(0, 'running');
    await new Promise(r => setTimeout(r, 800));
    updateAgentStatus(0, 'completed');
    
    // Context Agent
    updateAgentStatus(1, 'running');
    await new Promise(r => setTimeout(r, 600));
    updateAgentStatus(1, 'completed');
    
    // Scheduler Agent
    updateAgentStatus(2, 'running');
    await new Promise(r => setTimeout(r, 700));
    updateAgentStatus(2, 'completed');
    
    // Meta-Evaluator
    updateAgentStatus(3, 'running');
    await new Promise(r => setTimeout(r, 500));
    updateAgentStatus(3, 'completed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task.trim() || !deadline) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Reset agents
    setAgents(prev => prev.map(a => ({ ...a, status: 'pending' })));
    
    try {
      // Start agent simulation
      const workflowPromise = simulateAgentWorkflow();
      
      const input: TaskInput = {
        task,
        deadline,
        user_id: 'user_123',
        context: {
          energy_level: energyLevel,
          calendar_density: calendarDensity,
        },
      };
      
      const [result] = await Promise.all([
        analyzeTask(input),
        workflowPromise,
      ]);
      
      // Small delay before navigation for visual feedback
      await new Promise(r => setTimeout(r, 500));
      
      navigate(`/recommendation/${result.recommendation_id}`);
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Create New Task
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your task and we'll find the optimal time to work on it.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Task description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Task Description *
              </label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="e.g., Write quarterly report for the marketing team..."
                className="h-32 w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={isProcessing}
              />
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Deadline *
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Energy Level */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Current Energy Level
                </label>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-lg font-bold text-primary">
                    {energyLevel}
                  </span>
                  <span className="text-sm text-muted-foreground">/10</span>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full accent-primary"
                disabled={isProcessing}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low energy</span>
                <span>High energy</span>
              </div>
            </div>

            {/* Calendar Density */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                Calendar Density
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((density) => (
                  <button
                    key={density}
                    type="button"
                    onClick={() => setCalendarDensity(density)}
                    disabled={isProcessing}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all ${
                      calendarDensity === density
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {density}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isProcessing}
            >
              <Zap className="h-5 w-5" />
              {isProcessing ? 'Analyzing...' : 'Get Recommendation'}
            </Button>
          </motion.form>

          {/* Agent Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:pl-8"
          >
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                AI Agent Workflow
              </h2>
              <AgentProgressIndicator agents={agents} />
              
              {!isProcessing && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Fill in the form and submit to start the analysis
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
