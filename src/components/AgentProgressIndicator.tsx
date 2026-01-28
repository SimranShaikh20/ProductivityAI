import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, Brain, Eye, Calendar, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentStatus } from '@/types';

interface AgentProgressIndicatorProps {
  agents: AgentStatus[];
}

const agentIcons: Record<string, React.ElementType> = {
  'Task Analyzer': Brain,
  'Context Agent': Eye,
  'Scheduler Agent': Calendar,
  'Meta-Evaluator': Shield,
};

const agentColors: Record<string, string> = {
  'Task Analyzer': 'text-primary bg-primary/10',
  'Context Agent': 'text-purple-500 bg-purple-500/10',
  'Scheduler Agent': 'text-success bg-success/10',
  'Meta-Evaluator': 'text-warning bg-warning/10',
};

export function AgentProgressIndicator({ agents }: AgentProgressIndicatorProps) {
  return (
    <div className="space-y-3">
      {agents.map((agent, index) => {
        const Icon = agentIcons[agent.name] || Brain;
        const colorClass = agentColors[agent.name] || 'text-primary bg-primary/10';
        
        return (
          <motion.div
            key={agent.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all duration-300",
              agent.status === 'running' && "border-primary/50 bg-primary/5 shadow-sm",
              agent.status === 'completed' && "border-success/50 bg-success/5",
              agent.status === 'pending' && "border-border bg-card opacity-60",
              agent.status === 'error' && "border-danger/50 bg-danger/5"
            )}
          >
            {/* Icon */}
            <div className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-lg",
              colorClass
            )}>
              <Icon className="h-5 w-5" />
              
              {/* Pulse ring for running state */}
              {agent.status === 'running' && (
                <span className="absolute inset-0 rounded-lg animate-pulse-ring bg-primary/30" />
              )}
            </div>
            
            {/* Agent name */}
            <div className="flex-1">
              <p className="font-medium text-foreground">{agent.name}</p>
              <p className="text-sm text-muted-foreground">
                {agent.status === 'pending' && 'Waiting...'}
                {agent.status === 'running' && 'Processing...'}
                {agent.status === 'completed' && 'Complete'}
                {agent.status === 'error' && 'Failed'}
              </p>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center justify-center">
              <AnimatePresence mode="wait">
                {agent.status === 'pending' && (
                  <motion.div
                    key="pending"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="h-3 w-3 rounded-full bg-border"
                  />
                )}
                
                {agent.status === 'running' && (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </motion.div>
                )}
                
                {agent.status === 'completed' && (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-success"
                  >
                    <Check className="h-4 w-4 text-success-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
