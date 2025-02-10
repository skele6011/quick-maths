import React, { useState } from 'react';
import styles from './style.module.css';
import Game from './components/Game';
import StartScreen from './components/StartScreen';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [gameConfig, setGameConfig] = useState({
    difficulty: 'easy',
    timeLimit: 60
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light');
  };

  const handleStartGame = (config) => {
    setGameConfig(config);
    setGameStarted(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.themeToggle}>
        <button 
          className={styles.themeBtn}
          onClick={toggleTheme}
        >
          {theme === 'light' ? '⚙' : '🌙'}
        </button>
      </div>
      
      {!gameStarted ? (
        <StartScreen onStartGame={handleStartGame} />
      ) : (
        <Game 
          difficulty={gameConfig.difficulty}
          timeLimit={gameConfig.timeLimit}
          onGameEnd={() => setGameStarted(false)}
        />
      )}
    </div>
  );
};

export default App;
