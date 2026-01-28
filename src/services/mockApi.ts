import { Recommendation, UserMetrics, TaskInput, AnalyzeResponse } from '@/types';

// Simulated delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock recommendations storage
let mockRecommendations: Recommendation[] = [
  {
    id: 'rec_001',
    user_id: 'user_123',
    task: 'Prepare quarterly report presentation',
    deadline: '2026-02-01',
    recommended_time: '09:30',
    duration: 90,
    confidence: 0.89,
    reasoning: 'Morning slots align with peak cognitive performance for analytical tasks. Low calendar density allows deep focus.',
    alternatives: ['14:00', '10:30'],
    warnings: [],
    accepted: true,
    completed: true,
    timestamp: '2026-01-25T08:00:00Z'
  },
  {
    id: 'rec_002',
    user_id: 'user_123',
    task: 'Review team code submissions',
    deadline: '2026-01-28',
    recommended_time: '14:30',
    duration: 60,
    confidence: 0.82,
    reasoning: 'Post-lunch review tasks benefit from structured approach. Energy level supports focused code review.',
    alternatives: ['11:00', '16:00'],
    warnings: [],
    accepted: true,
    completed: false,
    timestamp: '2026-01-26T10:00:00Z'
  },
  {
    id: 'rec_003',
    user_id: 'user_123',
    task: 'Draft project proposal',
    deadline: '2026-02-05',
    recommended_time: '10:00',
    duration: 120,
    confidence: 0.91,
    reasoning: 'Creative writing tasks perform best in morning hours with high energy. Extended time block available.',
    alternatives: ['09:00', '15:00'],
    warnings: [],
    accepted: false,
    completed: false,
    timestamp: '2026-01-27T09:00:00Z'
  },
  {
    id: 'rec_004',
    user_id: 'user_123',
    task: 'Team standup preparation',
    deadline: '2026-01-28',
    recommended_time: '08:30',
    duration: 30,
    confidence: 0.95,
    reasoning: 'Quick prep task scheduled before standup. High confidence due to routine nature.',
    alternatives: ['08:00'],
    warnings: [],
    accepted: true,
    completed: true,
    timestamp: '2026-01-27T16:00:00Z'
  },
  {
    id: 'rec_005',
    user_id: 'user_123',
    task: 'Research competitor features',
    deadline: '2026-02-10',
    recommended_time: '15:00',
    duration: 75,
    confidence: 0.78,
    reasoning: 'Exploratory research works well in afternoon. Moderate energy sufficient for discovery-focused work.',
    alternatives: ['10:00', '13:30'],
    warnings: ['Calendar has 2 meetings nearby'],
    accepted: true,
    completed: true,
    timestamp: '2026-01-24T11:00:00Z'
  }
];

export async function analyzeTask(input: TaskInput): Promise<AnalyzeResponse> {
  // Simulate agent processing time
  await delay(500);
  
  const confidenceBase = 0.75;
  const energyBonus = (input.context.energy_level - 5) * 0.02;
  const densityPenalty = input.context.calendar_density === 'high' ? -0.1 : input.context.calendar_density === 'medium' ? -0.05 : 0;
  const confidence = Math.min(0.98, Math.max(0.6, confidenceBase + energyBonus + densityPenalty + Math.random() * 0.1));
  
  const morningSlots = ['08:30', '09:00', '09:30', '10:00', '10:30', '11:00'];
  const afternoonSlots = ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
  
  const isHighEnergy = input.context.energy_level >= 7;
  const slots = isHighEnergy ? morningSlots : afternoonSlots;
  const mainSlot = slots[Math.floor(Math.random() * slots.length)];
  const altSlots = slots.filter(s => s !== mainSlot).slice(0, 2);
  
  const durations = [30, 45, 60, 90, 120];
  const duration = durations[Math.floor(Math.random() * durations.length)];
  
  const reasonings = [
    `${isHighEnergy ? 'High' : 'Moderate'} energy level suggests ${isHighEnergy ? 'morning' : 'afternoon'} scheduling for optimal focus.`,
    `Calendar density is ${input.context.calendar_density}, allowing for ${input.context.calendar_density === 'low' ? 'uninterrupted deep work' : 'focused work sessions'}.`,
    `Task complexity analysis indicates ${duration}-minute block is appropriate for completion.`
  ];
  
  const warnings: string[] = [];
  if (input.context.calendar_density === 'high') {
    warnings.push('High calendar density may require schedule adjustments');
  }
  
  const recommendation: Recommendation = {
    id: `rec_${Date.now()}`,
    user_id: input.user_id,
    task: input.task,
    deadline: input.deadline,
    recommended_time: mainSlot,
    duration,
    confidence,
    reasoning: reasonings.join(' '),
    alternatives: altSlots,
    warnings,
    timestamp: new Date().toISOString()
  };
  
  mockRecommendations.unshift(recommendation);
  
  return {
    recommendation_id: recommendation.id,
    recommended_time: mainSlot,
    duration,
    confidence,
    reasoning: recommendation.reasoning,
    alternatives: altSlots,
    warnings
  };
}

export async function submitFeedback(recommendationId: string, accepted: boolean, completed: boolean): Promise<{ status: string; updated: boolean }> {
  await delay(300);
  
  const rec = mockRecommendations.find(r => r.id === recommendationId);
  if (rec) {
    rec.accepted = accepted;
    rec.completed = completed;
  }
  
  return { status: 'success', updated: true };
}

export async function getMetrics(userId: string): Promise<UserMetrics> {
  await delay(200);
  
  const userRecs = mockRecommendations.filter(r => r.user_id === userId);
  const total = userRecs.length;
  const accepted = userRecs.filter(r => r.accepted).length;
  const completed = userRecs.filter(r => r.completed).length;
  const avgConfidence = userRecs.reduce((sum, r) => sum + r.confidence, 0) / total;
  
  const recentScores = userRecs.slice(0, 5).map(r => r.confidence);
  
  const trend = recentScores.length >= 2 && recentScores[0] > recentScores[recentScores.length - 1] 
    ? 'improving' 
    : recentScores.length >= 2 && recentScores[0] < recentScores[recentScores.length - 1]
    ? 'declining'
    : 'stable';
  
  return {
    total_recommendations: total,
    acceptance_rate: total > 0 ? accepted / total : 0,
    completion_rate: accepted > 0 ? completed / accepted : 0,
    avg_confidence: avgConfidence || 0,
    trend,
    recent_scores: recentScores.reverse()
  };
}

export async function getRecommendations(userId: string): Promise<Recommendation[]> {
  await delay(200);
  return mockRecommendations.filter(r => r.user_id === userId);
}

export async function getRecommendation(id: string): Promise<Recommendation | null> {
  await delay(100);
  return mockRecommendations.find(r => r.id === id) || null;
}
