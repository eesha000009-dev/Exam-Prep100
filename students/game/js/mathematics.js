// Mathematics Quiz Implementation
const mathQuestions = [
    {
        question: "What is the value of π (pi) to two decimal places?",
        options: ["3.14", "3.12", "3.16", "3.18"],
        correct: 0
    },
    {
        question: "What is the square root of 144?",
        options: ["12", "14", "16", "10"],
        correct: 0
    },
    {
        question: "Solve for x: 2x + 5 = 15",
        options: ["5", "10", "7", "8"],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;

document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz-container');
    const submitButton = document.getElementById('submit-quiz');
    const nextButton = document.getElementById('next-question');
    const resultDiv = document.getElementById('result');

    function displayQuestion() {
        const question = mathQuestions[currentQuestion];
        let html = `
            <div class="mb-6">
                <h3 class="text-xl font-semibold mb-4">${question.question}</h3>
                <div class="space-y-2">
        `;

        question.options.forEach((option, index) => {
            html += `
                <div class="quiz-option flex items-center p-3 rounded-lg">
                    <input type="radio" name="answer" value="${index}" id="option${index}" class="mr-3">
                    <label for="option${index}" class="w-full cursor-pointer">${option}</label>
                </div>
            `;
        });

        html += '</div></div>';
        quizContainer.innerHTML = html;
        submitButton.classList.remove('hidden');
        nextButton.classList.add('hidden');
    }

    function checkAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            alert('Please select an answer!');
            return;
        }

        const answer = parseInt(selectedAnswer.value);
        const question = mathQuestions[currentQuestion];

        if (answer === question.correct) {
            score++;
            resultDiv.textContent = 'Correct!';
            resultDiv.className = 'mt-6 text-lg font-semibold text-green-500 score-popup';
            try { gameState.addPoints(POINTS_PER_CORRECT); gameState.playSound('correct'); } catch(e) {}
        } else {
            resultDiv.textContent = 'Incorrect. The correct answer was: ' + question.options[question.correct];
            resultDiv.className = 'mt-6 text-lg font-semibold text-red-400 score-popup';
            try { gameState.loseLife(); gameState.playSound('incorrect'); } catch(e) {}
        }

        resultDiv.classList.remove('hidden');
        submitButton.classList.add('hidden');
        
        if (currentQuestion < mathQuestions.length - 1) {
            nextButton.classList.remove('hidden');
        } else {
            resultDiv.textContent = `Quiz completed! Your score: ${score}/${mathQuestions.length}`;
        }
    }

    submitButton.addEventListener('click', checkAnswer);
    
    nextButton.addEventListener('click', () => {
        currentQuestion++;
        resultDiv.classList.add('hidden');
        displayQuestion();
    });

    displayQuestion();
});