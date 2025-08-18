// Navigation state management
let currentDivision = '';
let currentTopic = '';
let currentSubtopic = '';

// Initialize navigation from URL parameters
export function initializeNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    currentDivision = urlParams.get('division') || 'fundamentals';
    currentTopic = urlParams.get('topic') || 'nature-significance';
    currentSubtopic = urlParams.get('subtopic') || 'development';
    
    updateNavigationState();
}

// Update navigation state and URL
export function navigate(division, topic, subtopic) {
    currentDivision = division;
    currentTopic = topic;
    currentSubtopic = subtopic;
    
    const url = new URL(window.location);
    url.searchParams.set('division', division);
    url.searchParams.set('topic', topic);
    url.searchParams.set('subtopic', subtopic);
    window.history.pushState({}, '', url);
    
    updateNavigationState();
}

// Handle browser back/forward
window.onpopstate = function(event) {
    initializeNavigation();
};

// Update navigation UI elements
function updateNavigationState() {
    // Update sidebar active states
    document.querySelectorAll('.subtopic-nav').forEach(el => {
        el.classList.toggle('active', 
            el.dataset.subtopic === currentSubtopic);
    });
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Load content
    loadContent();
}

// Update previous/next navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevTopicBtn');
    const nextBtn = document.getElementById('nextTopicBtn');
    
    if (!prevBtn || !nextBtn) return;
    
    // Get current topic's subtopics
    const subtopics = getCurrentTopicSubtopics();
    const currentIndex = subtopics.indexOf(currentSubtopic);
    
    // Update previous button
    if (currentIndex > 0) {
        prevBtn.onclick = () => navigate(currentDivision, currentTopic, subtopics[currentIndex - 1]);
        prevBtn.disabled = false;
    } else {
        prevBtn.disabled = true;
    }
    
    // Update next button
    if (currentIndex < subtopics.length - 1) {
        nextBtn.onclick = () => navigate(currentDivision, currentTopic, subtopics[currentIndex + 1]);
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

// Get current topic's subtopics array
function getCurrentTopicSubtopics() {
    // This should be implemented based on your topic data structure
    return [];
}

// Load content for current navigation state
async function loadContent() {
    try {
        // Import content dynamically
        const module = await import(`../content/topics/${currentDivision}/${currentTopic}/content.js`);
        const content = module.default;
        
        // Render content
        renderContent(content[currentSubtopic]);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Export current state getters
export function getCurrentDivision() {
    return currentDivision;
}

export function getCurrentTopic() {
    return currentTopic;
}

export function getCurrentSubtopic() {
    return currentSubtopic;
}
