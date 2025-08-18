// Content rendering functions
export function renderSection(section) {
    let html = '';
    
    switch(section.type) {
        case 'definition':
        case 'history':
            html += `<div class="content-section mb-6">
                <p class="text-gray-700">${section.content}</p>
                ${renderQuestions(section.questions)}
            </div>`;
            break;
            
        case 'branches':
            html += `<div class="content-section mb-6">
                <ul class="space-y-2">
                    ${section.content.map(branch => `
                        <li>
                            <strong class="text-gray-900">${branch.name}:</strong>
                            <span class="text-gray-700">${branch.description}</span>
                        </li>
                    `).join('')}
                </ul>
                ${renderQuestions(section.questions)}
            </div>`;
            break;
    }
    
    return html;
}

export function renderQuestions(questions) {
    if (!questions || questions.length === 0) return '';
    
    let html = '<div class="questions-section mt-4 space-y-4">';
    questions.forEach((q, idx) => {
        html += `
            <div class="question-block">
                <p class="font-medium text-gray-900 mb-2">${idx + 1}. ${q.question}</p>
                <div class="space-y-2">
                    ${q.options.map((opt, optIdx) => `
                        <label class="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-blue-400 cursor-pointer transition">
                            <input type="radio" 
                                   name="q_${idx}" 
                                   value="${String.fromCharCode(65 + optIdx)}" 
                                   class="text-blue-600">
                            <span class="text-gray-700">${opt}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="mt-4">
            <button onclick="checkQuestions(this)" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Check Answers
            </button>
            <div class="feedback mt-2"></div>
        </div>
    </div>`;
    
    return html;
}

export function renderKeyPoints(keyPoints) {
    if (!keyPoints || keyPoints.length === 0) return '';
    
    return `
        <div class="key-points space-y-4">
            ${keyPoints.map(kp => `
                <div class="key-point bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <h4 class="font-semibold text-gray-900 mb-1">${kp.title}</h4>
                    <p class="text-gray-700">${kp.content}</p>
                </div>
            `).join('')}
        </div>
    `;
}
