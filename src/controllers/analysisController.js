import { z } from 'zod';
import { AnalysisService } from '../services/analysisService.js';

const analysisService = new AnalysisService();

// Validation schemas
const QuizSubmissionSchema = z.object({
  userId: z.string(),
  quizId: z.string(),
  timestamp: z.string().transform(str => new Date(str)),
  responses: z.record(z.string()),
  score: z.number(),
  totalQuestions: z.number()
});

export class AnalysisController {
  async analyzeQuiz(req, res) {
    try {
      const { currentQuiz, historicalQuizzes } = req.body;
      
      // Validate input
      const validatedCurrentQuiz = QuizSubmissionSchema.parse(currentQuiz);
      const validatedHistoricalQuizzes = z.array(QuizSubmissionSchema).parse(historicalQuizzes);

      // Perform analysis
      const analysis = analysisService.analyzePerformance(
        validatedCurrentQuiz,
        validatedHistoricalQuizzes
      );

      // Generate rank prediction
      const rankPrediction = analysisService.predictRank(
        analysis,
        validatedHistoricalQuizzes
      );

      res.json({
        analysis,
        rankPrediction
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Invalid request'
      });
    }
  }
}