class QuickMaths {
    constructor() {
        this.score = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.currentAnswer = null;
        this.gameStarted = false;
        this.timeLimit = 60;
        this.initElements();
        this.initEventListeners();
        this.initThemeToggle();
    }

    initElements() {
        this.questionEl = document.getElementById('question');
        this.answerEl = document.getElementById('answer');
        this.submitBtn = document.getElementById('submit');
        this.startBtn = document.getElementById('start');
        this.scoreEl = document.getElementById('score');
        this.timerEl = document.getElementById('timer');
        this.difficultyEl = document.getElementById('difficulty');
        this.feedbackEl = document.getElementById('feedback');
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.startGameBtn = document.getElementById('start-game-btn');
        this.startDifficultyEl = document.getElementById('start-difficulty');
        this.timeLimitEl = document.getElementById('time-limit');
        this.themeBtn = document.getElementById('theme-btn');
    }

    initEventListeners() {
        this.startGameBtn.addEventListener('click', () => this.startNewGame());
        this.startBtn.addEventListener('click', () => this.startGame());
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.answerEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });
    }

    initThemeToggle() {
        this.themeBtn.addEventListener('click', () => {
            const currentIcon = this.themeBtn.textContent;
            const newIcon = currentIcon === '⚙' ? '🌙' : '⚙';
            this.themeBtn.textContent = newIcon;
            
            // Toggle dark mode
            if (newIcon === '🌙') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }

            this.themeBtn.style.transform = 
                this.themeBtn.style.transform === 'rotate(180deg)' ? 
                'rotate(0deg)' : 'rotate(180deg)';
        });
    }

    startNewGame() {
        this.timeLimit = parseInt(this.timeLimitEl.value);
        this.timer = this.timeLimit;
        this.difficultyEl.value = this.startDifficultyEl.value;
        this.startScreen.classList.remove('active');
        this.gameScreen.classList.add('active');
        this.gameStarted = true;
        this.startGame();
    }

    startGame() {
        if (!this.gameStarted) return;
        this.score = 0;
        this.updateScore();
        this.startBtn.textContent = 'Reset';
        this.generateQuestion();
        this.startTimer();
        this.answerEl.focus();
    }

    generateQuestion() {
        const operations = ['+', '-', '*', '/'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        let num1, num2, question, answer;

        const difficulty = this.difficultyEl.value;
        const range = {
            easy: 10,
            medium: 50,
            hard: 100
        }[difficulty];

        switch(operation) {
            case '+':
                num1 = Math.floor(Math.random() * range);
                num2 = Math.floor(Math.random() * range);
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * range);
                num2 = Math.floor(Math.random() * num1);
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * (range/5));
                num2 = Math.floor(Math.random() * (range/5));
                question = `${num1} × ${num2}`;
                answer = num1 * num2;
                break;
            case '/':
                num2 = Math.floor(Math.random() * (range/5)) + 1;
                answer = Math.floor(Math.random() * (range/5)) + 1;
                num1 = num2 * answer;
                question = `${num1} ÷ ${num2}`;
                break;
        }

        this.questionEl.textContent = `${question} = ?`;
        this.currentAnswer = answer;
        this.answerEl.value = '';
    }

    checkAnswer() {
        const userAnswer = parseInt(this.answerEl.value);
        if (userAnswer === this.currentAnswer) {
            this.score += 10;
            this.showFeedback('Correct!', true);
        } else {
            this.score = Math.max(0, this.score - 5);
            this.showFeedback(`Incorrect! The answer was ${this.currentAnswer}`, false);
        }
        this.updateScore();
        this.generateQuestion();
        this.answerEl.focus();
    }

    showFeedback(message, isCorrect) {
        this.feedbackEl.textContent = message;
        this.feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        setTimeout(() => {
            this.feedbackEl.textContent = '';
            this.feedbackEl.className = 'feedback';
        }, 2000);
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timer = this.timeLimit;
        this.updateTimer();
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.updateTimer();
            if (this.timer <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    updateTimer() {
        this.timerEl.textContent = `Time: ${this.timer}s`;
    }

    endGame() {
        clearInterval(this.timerInterval);
        const gameOverMessage = `
            <div class="game-over">
                <h2>Time's Up!</h2>
                <p>Final Score: ${this.score}</p>
                <button onclick="location.reload()">Play Again</button>
            </div>
        `;
        this.gameScreen.innerHTML = gameOverMessage;
    }

    updateScore() {
        this.scoreEl.textContent = `Score: ${this.score}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuickMaths();
});
