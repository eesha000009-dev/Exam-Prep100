// Progress tracking functions
let progress = {
    divisions: {},
    topics: {},
    subtopics: {}
};

// Load progress from localStorage
export function loadProgress() {
    const savedProgress = localStorage.getItem('accountingProgress');
    if (savedProgress) {
        progress = JSON.parse(savedProgress);
    }
}

// Save progress to localStorage
export function saveProgress() {
    localStorage.setItem('accountingProgress', JSON.stringify(progress));
}

// Update progress for a division
export function updateDivisionProgress(divisionId) {
    const division = progress.divisions[divisionId] || { completed: 0, total: 0 };
    const topics = Object.keys(progress.topics).filter(t => t.startsWith(divisionId));
    
    division.total = topics.length;
    division.completed = topics.filter(t => progress.topics[t].completed).length;
    division.percentage = Math.round((division.completed / division.total) * 100);
    
    progress.divisions[divisionId] = division;
    saveProgress();
    
    // Update UI
    updateProgressUI();
}

// Update progress for a topic
export function updateTopicProgress(topicId) {
    const topic = progress.topics[topicId] || { completed: 0, total: 0 };
    const subtopics = Object.keys(progress.subtopics).filter(s => s.startsWith(topicId));
    
    topic.total = subtopics.length;
    topic.completed = subtopics.filter(s => progress.subtopics[s].completed).length;
    topic.percentage = Math.round((topic.completed / topic.total) * 100);
    
    progress.topics[topicId] = topic;
    saveProgress();
    
    // Update division progress
    const divisionId = topicId.split('/')[0];
    updateDivisionProgress(divisionId);
}

// Mark a subtopic as complete
export function completeSubtopic(subtopicId) {
    progress.subtopics[subtopicId] = {
        completed: true,
        completedAt: new Date().toISOString()
    };
    
    saveProgress();
    
    // Update topic progress
    const topicId = subtopicId.split('/').slice(0, -1).join('/');
    updateTopicProgress(topicId);
}

// Update progress display in the UI
export function updateProgressUI() {
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const completedSections = document.getElementById('completedSections');
    
    if (!progressBar || !progressPercent || !completedSections) return;
    
    const currentTopic = getCurrentTopic(); // You'll need to implement this
    if (!currentTopic) return;
    
    const topicProgress = progress.topics[currentTopic] || { completed: 0, total: 0, percentage: 0 };
    
    progressBar.style.width = `${topicProgress.percentage}%`;
    progressPercent.textContent = `${topicProgress.percentage}%`;
    completedSections.textContent = `${topicProgress.completed}/${topicProgress.total}`;
    
    // Update checkmarks in sidebar
    updateSidebarCheckmarks();
}

// Initialize progress tracking
export function initializeProgress() {
    loadProgress();
    updateProgressUI();
}
