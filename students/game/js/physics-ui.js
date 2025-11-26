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
                const topic = button.dataset.topic;
                const topicName = button.textContent.trim();
                this.showModeSelection(topic, topicName);
            });
        });

        // Mode selection buttons
        document.getElementById('solo-btn').addEventListener('click', () => {
            this.startMode('solo');
        });

        document.getElementById('multiplayer-btn').addEventListener('click', () => {
            this.startMode('multiplayer');
        });

        document.getElementById('progress-btn').addEventListener('click', () => {
            this.startMode('progress');
        });
    }

    showModeSelection(topic, topicName) {
        this.currentTopic = topic;

        // Hide topic menu and show mode menu
        document.getElementById('topic-menu').classList.add('hidden');
        document.getElementById('mode-menu').classList.remove('hidden');

        // Update the title
        const titleElement = document.getElementById('selected-topic-title');
        titleElement.textContent = topicName;
    }

    startMode(mode) {
        console.log(`Starting ${this.currentTopic} in ${mode} mode`);
        
        // Initialize the physics simulation for solo or multiplayer
        if ((mode === 'solo' || mode === 'multiplayer') && !window.physicsGame) {
            window.physicsGame = new PhysicsGame();
        }

        // Hide menus and show appropriate UI
        document.getElementById('mode-menu').classList.add('hidden');
        
        if (mode === 'progress') {
            this.showProgressUI();
        } else {
            document.getElementById('game-ui').classList.remove('hidden');
            if (window.physicsGame) {
                window.physicsGame.startTopic(this.currentTopic, mode);
            }
        }
    }

    showProgressUI() {
        console.log(`Showing progress for ${this.currentTopic}`);
        // Implement progress tracking UI here
    }
}

// Initialize UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameUI = new PhysicsGameUI();
});