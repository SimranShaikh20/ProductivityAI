export interface Recommendation {
  id: string;
  user_id: string;
  task: string;
  deadline: string;
  recommended_time: string;
  duration: number;
  confidence: number;
  reasoning: string;
  alternatives: string[];
  warnings: string[];
  accepted?: boolean;
  completed?: boolean;
  timestamp: string;
}

export interface UserMetrics {
  total_recommendations: number;
  acceptance_rate: number;
  completion_rate: number;
  avg_confidence: number;
  trend: 'improving' | 'stable' | 'declining';
  recent_scores: number[];
}

export interface TaskInput {
  task: string;
  deadline: string;
  user_id: string;
  context: {
    energy_level: number;
    calendar_density: 'low' | 'medium' | 'high';
  };
}

export interface AgentStatus {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  icon: string;
  color: string;
}

export interface AnalyzeResponse {
  recommendation_id: string;
  recommended_time: string;
  duration: number;
  confidence: number;
  reasoning: string;
  alternatives: string[];
  warnings: string[];
}

export interface FeedbackRequest {
  recommendation_id: string;
  accepted: boolean;
  completed: boolean;
}
