// Physics Game UI Handler
class PhysicsGameUI {
    constructor() {
        this.currentTopic = null;
        this.currentExperiment = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Topic selection buttons
        document.querySelectorAll('.topic-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const topic = e.target.dataset.topic;
                const color = e.target.dataset.color;
                const experimentName = e.target.textContent.trim();
                this.showModeSelection(topic, color, experimentName);
            });
        });

        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showTopicSelection();
        });

        // Mode selection buttons
        document.getElementById('solo-btn').addEventListener('click', () => {
            this.startExperiment('solo');
        });

        document.getElementById('multiplayer-btn').addEventListener('click', () => {
            this.startExperiment('multiplayer');
        });

        document.getElementById('progress-btn').addEventListener('click', () => {
            this.showProgress();
        });
    }

    showModeSelection(topic, color, experimentName) {
        this.currentTopic = topic;
        this.currentExperiment = experimentName;
    {
        question: "What is the unit of force in the SI system?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correct: 0,
        points: 100
    },
    {
        question: "What is the speed of light in vacuum?",
        options: [
            "299,792,458 meters per second",
            "300,000,000 meters per second",
            "3,000,000 meters per second",
            "30,000 meters per second"
        ],
        correct: 0,
        points: 150
    }
];

class PhysicsQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.timer = null;
        this.timeLeft = TIME_PER_QUESTION;
        this.streak = 0;
        this.doublePointsActive = false;

        this.quizContainer = document.getElementById('quiz-container');
        this.submitButton = document.getElementById('submit-quiz');
        this.nextButton = document.getElementById('next-question');
        this.resultDiv = document.getElementById('result');
        
        this.setupQuiz();
    }

    setupQuiz() {
        this.createProgressBar();
        this.createScoreDisplay();
        this.setupEventListeners();
        this.displayQuestion();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar mb-4';
        progressBar.innerHTML = `<div class="progress-fill" style="width: 0%"></div>`;
        this.quizContainer.parentElement.insertBefore(progressBar, this.quizContainer);
        this.progressBar = progressBar.querySelector('.progress-fill');
    }

    createScoreDisplay() {
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'text-xl font-bold mb-4';
        scoreDisplay.innerHTML = `Score: <span class="text-blue-600">0</span>`;
        this.quizContainer.parentElement.insertBefore(scoreDisplay, this.quizContainer);
        this.scoreDisplay = scoreDisplay.querySelector('span');
    }

    setupEventListeners() {
        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
    }

    startTimer() {
        this.timeLeft = TIME_PER_QUESTION;
        this.updateTimerDisplay();
        
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeUp();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerBar = document.querySelector('.timer-bar');
        if (!timerBar) {
            const timerBarContainer = document.createElement('div');
            timerBarContainer.className = 'w-full h-1 bg-gray-200 mb-4';
            timerBarContainer.innerHTML = '<div class="timer-bar"></div>';
            this.quizContainer.parentElement.insertBefore(timerBarContainer, this.quizContainer);
        }
    }

    handleTimeUp() {
        gameState.loseLife();
        this.streak = 0;
        this.showResult(false);
    }

    displayQuestion() {
        const question = physicsQuestions[this.currentQuestion];
        let html = `
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-4">${question.question}</h3>
                <div class="space-y-2">
        `;

        question.options.forEach((option, index) => {
            html += `
                <div class="quiz-option flex items-center p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <input type="radio" name="answer" value="${index}" id="option${index}" class="mr-2">
                    <label for="option${index}" class="w-full cursor-pointer">${option}</label>
                </div>
            `;
        });

        html += '</div></div>';
        this.quizContainer.innerHTML = html;
        this.submitButton.classList.remove('hidden');
        this.nextButton.classList.add('hidden');
        
        this.updateProgressBar();
        this.startTimer();
    }

    updateProgressBar() {
        const progress = (this.currentQuestion / physicsQuestions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    checkAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            alert('Please select an answer!');
            return;
        }

        clearInterval(this.timer);
        const answer = parseInt(selectedAnswer.value);
        const question = physicsQuestions[this.currentQuestion];
        const isCorrect = answer === question.correct;

        this.showResult(isCorrect);
        gameState.addPowerup(); // Chance to get a powerup after answering
    }

    showResult(isCorrect) {
        if (isCorrect) {
            this.streak++;
            let points = physicsQuestions[this.currentQuestion].points;
            
            // Apply streak bonus
            if (this.streak >= 3) points *= 1.5;
            if (this.doublePointsActive) points *= 2;
            
            this.score += points;
            gameState.addPoints(points);
            this.scoreDisplay.textContent = this.score;
            this.resultDiv.textContent = `Correct! ${this.streak >= 3 ? '🔥 Streak Bonus!' : ''}`;
            this.resultDiv.className = 'mt-6 text-lg font-semibold text-green-600 score-popup';
            gameState.playSound('correct');
        } else {
            this.streak = 0;
            this.resultDiv.textContent = 'Incorrect. The correct answer was: ' + 
                physicsQuestions[this.currentQuestion].options[physicsQuestions[this.currentQuestion].correct];
            this.resultDiv.className = 'mt-6 text-lg font-semibold text-red-600 score-popup';
            gameState.loseLife();
            gameState.playSound('incorrect');
        }

        this.resultDiv.classList.remove('hidden');
        this.submitButton.classList.add('hidden');
        
        if (this.currentQuestion < physicsQuestions.length - 1) {
            this.nextButton.classList.remove('hidden');
        } else {
            this.finishQuiz();
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        this.resultDiv.classList.add('hidden');
        this.displayQuestion();
    }

    finishQuiz() {
        clearInterval(this.timer);
        this.resultDiv.textContent = `Quiz completed! Final Score: ${this.score}`;
        this.resultDiv.className = 'mt-6 text-lg font-semibold text-blue-600';
        
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Play Again';
        restartButton.className = 'mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700';
        restartButton.onclick = () => location.reload();
        this.resultDiv.appendChild(restartButton);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new PhysicsQuiz();
});