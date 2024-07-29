import React from 'react';

const Review = ({ userAnswers, questions }) => {
  return (
    <div>
      <h2>Review Your Answers</h2>
      {questions.map((question, index) => (
        <div key={index}>
          <h3>{question.question}</h3>
          <p>Your answer: {question.options[userAnswers[index]]}</p>
          <p>Correct answer: {question.options[question.answer]}</p>
        </div>
      ))}
    </div>
  );
};

export default Review;
