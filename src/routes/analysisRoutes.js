import { Router } from 'express';
import { AnalysisController } from '../controllers/analysisController.js';

const router = Router();
const controller = new AnalysisController();

router.post('/analyze', controller.analyzeQuiz.bind(controller));

export default router;