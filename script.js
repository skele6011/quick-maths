let score = 0;
let timeLeft = 60;
let questionCount = 0;
let timer;
let correctAnswers = 0;
let startTime;

const operations = ['+', '-', '*', '/', 'x'];

let currentQuestionData = {};

function generateQuestion() {
    let operation = operations[Math.floor(Math.random() * operations.length)];
    let a = Math.floor(Math.random() * 12) + 1;
    let b = Math.floor(Math.random() * 12) + 1;
    let question, answer;

    if (operation === 'x') {
        // Solve for x question
        answer = Math.floor(Math.random() * 12) + 1;
        let result = a * answer;
        question = `${a}x = ${result}`;
    } else {
        if (operation === '/') {
            // Ensure clean division
            b = Math.floor(Math.random() * 12) + 1;
            a = b * (Math.floor(Math.random() * 12) + 1);
            answer = a / b;
        } else {
            question = `${a} ${operation} ${b}`;
            answer = eval(`${a} ${operation} ${b}`);
        }
    }

    return { question, answer };
}

// Wrap initialization in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        start: document.getElementById('start'),
        submit: document.getElementById('submit'),
        playAgain: document.getElementById('play-again'),
        answer: document.getElementById('answer'),
        question: document.getElementById('question'),
        score: document.getElementById('score'),
        timer: document.getElementById('timer'),
        questionCount: document.getElementById('question-count'),
        gameArea: document.getElementById('game-area'),
        results: document.getElementById('results'),
        finalScore: document.getElementById('final-score'),
        accuracy: document.getElementById('accuracy')
    };

    // Verify all elements exist
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Missing element: ${key}`);
            return; // Prevent game from starting if elements are missing
        }
    }

    // Add event listeners using verified elements
    elements.start.addEventListener('click', () => startGame(elements));
    elements.submit.addEventListener('click', () => checkAnswer(elements));
    elements.playAgain.addEventListener('click', () => resetGame(elements));

    // Keyboard controls
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && !elements.start.disabled) {
            event.preventDefault();
            startGame(elements);
        }
        
        if (event.code === 'Enter' && !elements.answer.disabled) {
            event.preventDefault();
            checkAnswer(elements);
        }
    });

    // Show history on button click
    document.getElementById('history').addEventListener('click', () => {
        const historyArea = document.getElementById('history-area');
        historyArea.classList.toggle('hidden');
        showHistory();
    });
});

// Update all functions to use elements object
function startGame(elements) {
    resetGame(elements);
    elements.start.disabled = true;
    elements.answer.disabled = false;
    startTime = Date.now();
    nextQuestion(elements);
    timer = setInterval(() => updateTimer(elements), 1000);
    elements.answer.focus();
}

function updateTimer(elements) {
    timeLeft--;
    elements.timer.textContent = timeLeft;
    if (timeLeft <= 0) endGame(elements);
}

function checkAnswer(elements) {
    const userAnswer = parseFloat(elements.answer.value);
    const currentQuestion = elements.question.dataset.answer;
    currentQuestionData.userAnswer = userAnswer;
    currentQuestionData.correctAnswer = parseFloat(currentQuestion);

    if (Math.abs(userAnswer - currentQuestion) < 0.1) {
        correctAnswers++;
    }
    
    questionCount++;
    const timeTaken = (Date.now() - startTime) / 1000;
    score = Math.round((timeTaken * correctAnswers) / questionCount);
    
    elements.score.textContent = score;
    elements.questionCount.textContent = questionCount;
    
    nextQuestion(elements);
}

function nextQuestion(elements) {
    let success = false;
    for (let i = 0; i < 3; i++) {
        try {
            const { question, answer } = generateQuestion();
            if (question && answer != null) {
                elements.question.textContent = question;
                elements.question.dataset.answer = answer;
                elements.answer.value = '';
                elements.answer.focus();
                success = true;
                break;
            }
        } catch (error) {
            console.error('Error generating question:', error);
        }
    }
    if (!success) {
        console.error('Failed to generate a valid question after multiple attempts.');
        endGame(elements);
    }
    currentQuestionData = { question, answer };
}

function endGame(elements) {
    clearInterval(timer);
    const timeTaken = (Date.now() - startTime) / 1000;
    score = Math.round((timeTaken * correctAnswers) / questionCount);
    
    elements.gameArea.classList.add('hidden');
    elements.results.classList.remove('hidden');
    elements.finalScore.textContent = score;
    elements.accuracy.textContent = 
        Math.round((correctAnswers / questionCount) * 100) || 0;

    storeGameData({
        timestamp: Date.now(),
        score,
        correctAnswers,
        questionCount,
        questions: retrieveSessionData() // just an example aggregator
    });
}

function resetGame(elements) {
    score = 0;
    timeLeft = 60;
    questionCount = 0;
    correctAnswers = 0;
    elements.score.textContent = '0';
    elements.timer.textContent = '60';
    elements.questionCount.textContent = '0';
    elements.gameArea.classList.remove('hidden');
    elements.results.classList.add('hidden');
    elements.start.disabled = false;
    elements.answer.disabled = true;
}

function retrieveSessionData() {
    // Return minimal info about the last question
    return { ...currentQuestionData };
}

function showHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    const data = getGameHistory() || [];
    data.forEach((session, index) => {
        const li = document.createElement('li');
        li.textContent = `Game #${index + 1} - Score: ${session.score}`;
        li.addEventListener('click', () => {
            alert(JSON.stringify(session, null, 2));
        });
        historyList.appendChild(li);
    });
}
