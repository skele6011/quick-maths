import React, { useState } from 'react';
import styles from '../style.module.css';

const StartScreen = ({ onStartGame }) => {
  const [difficulty, setDifficulty] = useState('easy');
  const [timeLimit, setTimeLimit] = useState(60);

  const handleStart = () => {
    onStartGame({ difficulty, timeLimit: parseInt(timeLimit) });
  };

  return (
    <div className={styles.startScreen}>
      <h1 className={styles.title}>Quick Maths</h1>
      <p className={styles.subtitle}>Test your mental math skills!</p>
      <div className={styles.startOptions}>
        <select 
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy Mode</option>
          <option value="medium">Medium Mode</option>
          <option value="hard">Hard Mode</option>
        </select>
        <select 
          value={timeLimit}
          onChange={(e) => setTimeLimit(e.target.value)}
        >
          <option value="30">30 Seconds</option>
          <option value="60">1 Minute</option>
          <option value="120">2 Minutes</option>
          <option value="300">5 Minutes</option>
        </select>
        <button 
          className={styles.rainbowBtn}
          onClick={handleStart}
        >
          Start Challenge
        </button>
      </div>
    </div>
  );
};

export default StartScreen;
