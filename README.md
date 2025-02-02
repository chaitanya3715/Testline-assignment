dclone the project 
git clone project url 

then write 
npm cd backend
npm install

npm start

open postman :
go to api point as 
http://localhost:3000/api/analysis/analyze

enter json data in raw as:
{
  "currentQuiz": {
    "userId": "user123",
    "quizId": "quiz123",
    "timestamp": "2024-02-25T12:00:00Z",
    "responses": {
      "1": "2",
      "2": "1",
      "3": "4"
    },
    "score": 8,
    "totalQuestions": 10
  },
  "historicalQuizzes": [
    {
      "userId": "user123",
      "quizId": "quiz122",
      "timestamp": "2024-02-24T12:00:00Z",
      "responses": {
        "1": "2",
        "2": "1",
        "3": "4"
      },
      "score": 7,
      "totalQuestions": 10
    }
  ]
}


