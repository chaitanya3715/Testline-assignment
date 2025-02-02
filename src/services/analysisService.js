export class AnalysisService {
  constructor() {
    this.NEET_TOTAL_SEATS = 1000000; // Example total seats
  }

  analyzePerformance(currentQuiz, historicalQuizzes) {
    const allQuizzes = [currentQuiz, ...historicalQuizzes];
    
    // Calculate topic-wise accuracy
    const topicAccuracy = new Map();
    const weakTopics = [];
    
    // Calculate topic-wise performance
    const topicPerformance = this.calculateTopicPerformance(allQuizzes);
    
    // Identify weak topics (topics with accuracy below 60%)
    for (const [topic, accuracy] of topicPerformance) {
      if (accuracy < 0.6) {
        weakTopics.push(topic);
      }
      topicAccuracy.set(topic, accuracy);
    }
    
    // Calculate overall accuracy
    const overallAccuracy = currentQuiz.score / currentQuiz.totalQuestions;

    // Calculate improvement trends
    const improvementTrends = this.calculateImprovementTrends(allQuizzes);

    return {
      weakTopics,
      improvementTrends,
      overallAccuracy,
      topicWiseAccuracy: Object.fromEntries(topicAccuracy)
    };
  }

  calculateTopicPerformance(quizzes) {
    const topicPerformance = new Map();
    const topicAttempts = new Map();

    quizzes.forEach(quiz => {
      Object.entries(quiz.responses).forEach(([questionId, response]) => {
        // In a real implementation, you would look up the question's topic and correct answer
        const topic = this.getQuestionTopic(questionId);
        const isCorrect = this.isAnswerCorrect(questionId, response);

        topicPerformance.set(
          topic,
          (topicPerformance.get(topic) || 0) + (isCorrect ? 1 : 0)
        );
        topicAttempts.set(
          topic,
          (topicAttempts.get(topic) || 0) + 1
        );
      });
    });

    // Calculate accuracy for each topic
    const topicAccuracy = new Map();
    for (const [topic, correct] of topicPerformance) {
      const attempts = topicAttempts.get(topic);
      topicAccuracy.set(topic, correct / attempts);
    }

    return topicAccuracy;
  }

  calculateImprovementTrends(quizzes) {
    const trends = [];
    const topics = new Set();

    // Get all unique topics
    quizzes.forEach(quiz => {
      Object.keys(quiz.responses).forEach(questionId => {
        topics.add(this.getQuestionTopic(questionId));
      });
    });

    // Calculate trend for each topic
    topics.forEach(topic => {
      const topicScores = quizzes.map(quiz => {
        const topicQuestions = Object.keys(quiz.responses)
          .filter(qId => this.getQuestionTopic(qId) === topic);
        
        const correctAnswers = topicQuestions
          .filter(qId => this.isAnswerCorrect(qId, quiz.responses[qId]))
          .length;

        return correctAnswers / topicQuestions.length;
      });

      const trend = this.calculateTrend(topicScores);
      trends.push({
        topic,
        trend,
        percentage: Math.abs(this.calculateTrendPercentage(topicScores))
      });
    });

    return trends;
  }

  calculateTrend(scores) {
    if (scores.length < 2) return 'stable';
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg - firstAvg > 0.1) return 'improving';
    if (firstAvg - secondAvg > 0.1) return 'declining';
    return 'stable';
  }

  calculateTrendPercentage(scores) {
    if (scores.length < 2) return 0;
    const first = scores[0];
    const last = scores[scores.length - 1];
    return ((last - first) / first) * 100;
  }

  predictRank(currentPerformance, historicalData) {
    // Calculate weighted score based on recent performance
    const recentPerformanceWeight = 0.7;
    const historicalPerformanceWeight = 0.3;

    const historicalAverage = historicalData.reduce(
      (acc, quiz) => acc + (quiz.score / quiz.totalQuestions),
      0
    ) / historicalData.length;

    const weightedScore = (
      currentPerformance.overallAccuracy * recentPerformanceWeight +
      historicalAverage * historicalPerformanceWeight
    );

    // Predict percentile based on weighted score
    const predictedPercentile = weightedScore * 100;
    
    // Calculate predicted rank
    const predictedRank = Math.round(
      (1 - predictedPercentile / 100) * this.NEET_TOTAL_SEATS
    );

    // Calculate confidence score based on consistency
    const confidenceScore = this.calculateConfidenceScore(
      currentPerformance.overallAccuracy,
      historicalAverage
    );

    return {
      predictedRank,
      confidenceScore,
      recommendedColleges: this.getRecommendedColleges(predictedRank)
    };
  }

  calculateConfidenceScore(currentAccuracy, historicalAverage) {
    // Calculate consistency between current and historical performance
    const performanceDifference = Math.abs(currentAccuracy - historicalAverage);
    const baseConfidence = 0.8;
    
    // Reduce confidence if performance is inconsistent
    return Math.max(0.3, baseConfidence - performanceDifference);
  }

  getRecommendedColleges(predictedRank) {
    // Mock college recommendations based on rank ranges
    if (predictedRank <= 1000) {
      return ['AIIMS Delhi', 'JIPMER Puducherry', 'MAMC Delhi'];
    } else if (predictedRank <= 5000) {
      return ['GMC Mumbai', 'MMC Chennai', 'BMC Bangalore'];
    } else if (predictedRank <= 10000) {
      return ['GMC Kozhikode', 'GMCH Chandigarh', 'GMC Nagpur'];
    }
    return ['State Medical Colleges based on your region'];
  }

  // Mock methods for demonstration - in real implementation, these would query a database
  getQuestionTopic(questionId) {
    // Mock topics for demonstration
    const topics = ['Physics', 'Chemistry', 'Biology'];
    return topics[parseInt(questionId) % 3];
  }

  isAnswerCorrect(questionId, response) {
    // Mock correct answer check - in real implementation, this would check against actual correct answers
    return parseInt(questionId) % 2 === parseInt(response) % 2;
  }
}