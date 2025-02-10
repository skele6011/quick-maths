import React, { useState, useEffect, useRef } from 'react';
import styles from '../style.module.css';

const Game = ({ difficulty, timeLimit, onGameEnd }) => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(timeLimit);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', isCorrect: null });
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const generateQuestion = () => {
    const operations = ['+', '-', '*', '/'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const range = { easy: 10, medium: 50, hard: 100 }[difficulty];
    let num1, num2, question, answer;

    // Question generation logic from the original code
    // ... (implement the same logic as in the original generateQuestion method)

    setQuestion(`${question} = ?`);
    setCurrentAnswer(answer);
    setAnswer('');
  };

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    if (userAnswer === currentAnswer) {
      setScore(prev => prev + 10);
      showFeedback('Correct!', true);
    } else {
      setScore(prev => Math.max(0, prev - 5));
      showFeedback(`Incorrect! The answer was ${currentAnswer}`, false);
    }
    setAnswer('');
    generateQuestion();
  };

  const showFeedback = (message, isCorrect) => {
    setFeedback({ message, isCorrect });
    setTimeout(() => setFeedback({ message: '', isCorrect: null }), 2000);
  };

  useEffect(() => {
    generateQuestion();
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onGameEnd();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div className={styles.gameScreen}>
      <h1>Quick Maths Challenge</h1>
      <div className={styles.gameContainer}>
        <div className={styles.stats}>
          <span>Score: {score}</span>
          <span>Time: {timer}s</span>
        </div>
        <div className={styles.questionContainer}>
          <p id="question">{question}</p>
          <input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            ref={inputRef}
            placeholder="Enter your answer"
          />
          <button onClick={checkAnswer}>Submit</button>
        </div>
        {feedback.message && (
          <div className={`${styles.feedback} ${feedback.isCorrect ? styles.correct : styles.incorrect}`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
