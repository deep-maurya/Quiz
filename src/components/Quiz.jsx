import React, { useEffect, useState } from 'react';
import Question from './Question';
import Review from './Review';

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: 2,
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    answer: 2,
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe", "Pb"],
    answer: 0,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"],
    answer: 1,
  },
  {
    question: "What is the boiling point of water?",
    options: ["50°C", "75°C", "100°C", "120°C"],
    answer: 2,
  },
  {
    question: "What is the capital of Japan?",
    options: ["Tokyo", "Kyoto", "Osaka", "Hiroshima"],
    answer: 0,
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: 2,
  },
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"],
    answer: 2,
  },
  {
    question: "What is the longest river in the world?",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    answer: 1,
  },
  {
    question: "What is the most widely spoken language in the world?",
    options: ["English", "Mandarin", "Spanish", "Hindi"],
    answer: 1,
  },
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [alertCount, setAlertCount] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleAnswerSelect = (optionIndex) => {
    setUserAnswers([...userAnswers, optionIndex]);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsQuizComplete(true);
    // Logic to save user answers
  };

  const handleAlert = () => {
    setAlertCount(prev => prev + 1);
    if (alertCount >= 2) {
      handleSubmit();
    }
  };

  return (
    <div>
      {!isQuizComplete ? (
        <div>
          <h2>Timer: {timer} seconds</h2>
          <h2>{currentQuestion + 1}/{questions.length}</h2>
          <Question
            question={questions[currentQuestion]}
            onAnswerSelect={handleAnswerSelect}
            onAlert={handleAlert}
          />
        </div>
      ) : (
        <Review userAnswers={userAnswers} questions={questions} />
      )}
    </div>
  );
};

export default Quiz;
