import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  LineChart, 
  Shield, 
  ArrowRight,
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';

const features = [
  {
    icon: Brain,
    title: 'Multi-Agent Intelligence',
    description: 'Four specialized AI agents work together to analyze your tasks, understand your context, and create optimal schedules.',
    color: 'text-primary bg-primary/10',
  },
  {
    icon: Shield,
    title: 'Self-Evaluating Quality',
    description: 'Every recommendation passes through a meta-evaluator. Only high-confidence suggestions reach you.',
    color: 'text-success bg-success/10',
  },
  {
    icon: LineChart,
    title: 'Continuous Learning',
    description: 'The system learns from your feedback, improving its recommendations over time with visible metrics.',
    color: 'text-warning bg-warning/10',
  },
];

const steps = [
  { icon: Clock, label: 'Enter your task & deadline' },
  { icon: Brain, label: 'AI agents analyze & plan' },
  { icon: CheckCircle2, label: 'Get optimal time slot' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-success/5 blur-3xl" />
          </div>
          
          <div className="container px-4 py-24 md:py-32">
            <div className="mx-auto max-w-3xl text-center">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
              >
                <Sparkles className="h-4 w-4" />
                Self-Improving AI Productivity Agent
              </motion.div>
              
              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold tracking-tight text-foreground md:text-6xl"
              >
                Schedule smarter with{' '}
                <span className="text-primary">AI that learns</span>
              </motion.h1>
              
              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-muted-foreground md:text-xl"
              >
                Our multi-agent system analyzes your tasks, understands your energy levels, 
                and recommends the perfect time to work — then improves based on your feedback.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link to="/new-task">
                  <Button variant="hero" size="xl">
                    <Zap className="h-5 w-5" />
                    Try Demo
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg">
                    View Dashboard
                  </Button>
                </Link>
              </motion.div>
              
              {/* Quick steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-16 flex flex-wrap items-center justify-center gap-6"
              >
                {steps.map((step, index) => (
                  <div key={step.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <step.icon className="h-4 w-4 text-primary" />
                    </div>
                    <span>{step.label}</span>
                    {index < steps.length - 1 && (
                      <ArrowRight className="ml-2 h-4 w-4 text-border" />
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="border-t border-border/50 bg-surface py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Intelligent productivity, reimagined
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Built with cutting-edge AI architecture for reliable, improving recommendations.
              </p>
            </div>
            
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Architecture Preview */}
        <section className="py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  How it works
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  A transparent, observable AI workflow you can trust
                </p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-lg"
              >
                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { name: 'Task Analyzer', desc: 'Estimates time & difficulty', color: 'bg-primary' },
                    { name: 'Context Agent', desc: 'Checks energy & calendar', color: 'bg-purple-500' },
                    { name: 'Scheduler', desc: 'Finds optimal time slot', color: 'bg-success' },
                    { name: 'Meta-Evaluator', desc: 'Quality gate (>70%)', color: 'bg-warning' },
                  ].map((agent, index) => (
                    <div key={agent.name} className="relative">
                      <div className="rounded-xl border border-border bg-surface p-4 text-center">
                        <div className={`mx-auto mb-3 h-3 w-3 rounded-full ${agent.color}`} />
                        <p className="font-medium text-foreground">{agent.name}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{agent.desc}</p>
                      </div>
                      {index < 3 && (
                        <div className="absolute -right-2 top-1/2 hidden h-0.5 w-4 bg-border md:block" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-surface p-3">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">
                    Only recommendations with &gt;70% confidence are shown to you
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="border-t border-border/50 bg-surface py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Ready to boost your productivity?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Try the demo and see how AI-powered scheduling can transform your workflow.
              </p>
              <div className="mt-8">
                <Link to="/new-task">
                  <Button variant="hero" size="xl">
                    <Zap className="h-5 w-5" />
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="font-semibold">ProductivityAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with LangGraph • Opik Observability • Gemini + Groq
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
