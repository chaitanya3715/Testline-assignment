export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  correctOptionId: string;
}

export interface QuizSubmission {
  userId: string;
  quizId: string;
  timestamp: Date;
  responses: Map<string, string>; // questionId -> selectedOptionId
  score: number;
  totalQuestions: number;
}

export interface PerformanceAnalysis {
  weakTopics: string[];
  improvementTrends: {
    topic: string;
    trend: 'improving' | 'declining' | 'stable';
    percentage: number;
  }[];
  overallAccuracy: number;
  topicWiseAccuracy: Map<string, number>;
}

export interface RankPrediction {
  predictedRank: number;
  confidenceScore: number;
  recommendedColleges?: string[];
}