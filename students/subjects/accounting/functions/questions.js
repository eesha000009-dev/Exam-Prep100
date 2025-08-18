const encouragingMessages = {
    success: [
        "Bravo! You're absolutely crushing it! 🌟",
        "Excellent work! Keep that momentum going! 🚀",
        "Awesome! You're mastering this topic! 💫",
        "Outstanding! You're making great progress! ⭐",
        "Fantastic job! Your hard work is paying off! 🏆"
    ],
    partial: [
        "Good effort! Review the ones you missed and try again! 💪",
        "Almost there! A few more to perfect! 🎯",
        "Nice work! Let's aim for all correct next time! 🌟",
        "Getting better! Keep pushing forward! 🚀"
    ],
    needsWork: [
        "Keep going! Mistakes are stepping stones to success. 🌱",
        "Don't give up! Review and try again - you've got this! 💪",
        "Learning takes time. Take a breath and give it another shot! 🌟",
        "Every attempt makes you stronger. Keep pushing forward! 🚀",
        "You're on the right path - review and try once more! 💫"
    ]
};

export function checkQuestions(button) {
    const questionBlock = button.closest('.question-block');
    const questions = questionBlock.querySelectorAll('input[type="radio"]');
    const feedbackDiv = questionBlock.querySelector('.feedback');
    
    let correct = 0;
    let total = 0;
    let checked = 0;
    
    // Group radio buttons by question
    const questionGroups = {};
    questions.forEach(q => {
        const name = q.getAttribute('name');
        if (!questionGroups[name]) {
            questionGroups[name] = [];
            total++;
        }
        questionGroups[name].push(q);
        if (q.checked) checked++;
    });
    
    // If not all questions answered
    if (checked < total) {
        feedbackDiv.innerHTML = `
            <div class="text-yellow-600 font-medium mt-2">
                Please answer all questions before checking!
            </div>`;
        return;
    }
    
    // Check answers
    Object.values(questionGroups).forEach(group => {
        const selectedAnswer = group.find(radio => radio.checked);
        if (selectedAnswer && selectedAnswer.value === group[0].dataset.correct) {
            correct++;
        }
    });
    
    // Calculate percentage and show feedback
    const percentage = (correct / total) * 100;
    let messageType;
    if (percentage === 100) messageType = 'success';
    else if (percentage >= 60) messageType = 'partial';
    else messageType = 'needsWork';
    
    const messages = encouragingMessages[messageType];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    feedbackDiv.innerHTML = `
        <div class="p-4 rounded-lg mt-4 ${
            messageType === 'success' ? 'bg-green-100 text-green-700' :
            messageType === 'partial' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
        }">
            <p class="font-medium">${randomMessage}</p>
            <p class="text-sm mt-2">You got ${correct} out of ${total} correct.</p>
        </div>
    `;
    
    // Update progress if needed
    if (percentage === 100) {
        updateTopicProgress();
    }
}
