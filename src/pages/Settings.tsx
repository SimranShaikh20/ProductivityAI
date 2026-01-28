import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Clock, TestTube, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  
  const [googleKey, setGoogleKey] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [opikKey, setOpikKey] = useState('');
  const [opikWorkspace, setOpikWorkspace] = useState('');
  const [showKeys, setShowKeys] = useState(false);
  
  const [preferredStart, setPreferredStart] = useState('09:00');
  const [preferredEnd, setPreferredEnd] = useState('18:00');
  const [defaultCategories, setDefaultCategories] = useState(['work', 'personal', 'urgent']);
  
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    // Simulate API test
    await new Promise(r => setTimeout(r, 1500));
    
    // For demo, succeed if any key is filled
    if (googleKey || groqKey) {
      setTestResult('success');
      toast({
        title: 'Connection successful',
        description: 'All API connections are working properly.',
      });
    } else {
      setTestResult('error');
      toast({
        title: 'Connection failed',
        description: 'Please enter valid API keys.',
        variant: 'destructive',
      });
    }
    
    setTesting(false);
  };

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated.',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-3xl px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure your API keys and preferences
          </p>
        </motion.div>

        <div className="mt-8 space-y-8">
          {/* API Keys Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">API Configuration</h2>
                  <p className="text-sm text-muted-foreground">Connect your LLM providers</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeys(!showKeys)}
              >
                {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showKeys ? 'Hide' : 'Show'}
              </Button>
            </div>

            <div className="space-y-4">
              {/* Google API Key */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Google API Key (Gemini)
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={googleKey}
                  onChange={(e) => setGoogleKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Groq API Key */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Groq API Key
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Opik API Key */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Opik API Key
                </label>
                <input
                  type={showKeys ? 'text' : 'password'}
                  value={opikKey}
                  onChange={(e) => setOpikKey(e.target.value)}
                  placeholder="opik_..."
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Opik Workspace */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Opik Workspace
                </label>
                <input
                  type="text"
                  value={opikWorkspace}
                  onChange={(e) => setOpikWorkspace(e.target.value)}
                  placeholder="your-workspace"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Test Connection Button */}
              <div className="flex items-center gap-4 pt-2">
                <Button
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing}
                >
                  <TestTube className="h-4 w-4" />
                  {testing ? 'Testing...' : 'Test Connection'}
                </Button>
                
                {testResult === 'success' && (
                  <div className="flex items-center gap-2 text-success">
                    <Check className="h-4 w-4" />
                    <span className="text-sm font-medium">All connections working</span>
                  </div>
                )}
                
                {testResult === 'error' && (
                  <div className="flex items-center gap-2 text-danger">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Connection failed</span>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Preferences Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Default Preferences</h2>
                <p className="text-sm text-muted-foreground">Set your work schedule defaults</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Work Hours */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Preferred Start Time
                  </label>
                  <input
                    type="time"
                    value={preferredStart}
                    onChange={(e) => setPreferredStart(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Preferred End Time
                  </label>
                  <input
                    type="time"
                    value={preferredEnd}
                    onChange={(e) => setPreferredEnd(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Task Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {defaultCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                    >
                      {cat}
                      <button
                        onClick={() => setDefaultCategories(prev => prev.filter(c => c !== cat))}
                        className="ml-1 hover:text-danger"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={() => {
                      const newCat = prompt('Enter new category:');
                      if (newCat) setDefaultCategories(prev => [...prev, newCat]);
                    }}
                    className="rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground hover:border-primary hover:text-primary"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <Button variant="hero" size="lg" onClick={handleSave}>
              Save Settings
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
