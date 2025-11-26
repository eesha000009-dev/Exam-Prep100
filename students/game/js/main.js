// Game constants
const POINTS_PER_CORRECT = 100;
const TIME_PER_QUESTION = 15; // seconds
const MAX_LIVES = 3;
const POWERUP_CHANCE = 0.2; // 20% chance for powerup

// Audio file paths
const AUDIO_FILES = {
    background: 'public/sounds/background.mp3',
    success: 'public/sounds/success.mp3',
    hit: 'public/sounds/hit.mp3'
};

class GameState {
    constructor() {
        this.totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
        this.achievements = JSON.parse(localStorage.getItem('achievements')) || {};
        this.powerups = [];
        this.audioContext = null;
        this.backgroundMusic = null;
        this.audioBuffers = {}; // Initialize audioBuffers object
        this.initAudio();
        this.initLives();

        // Set up music toggle button
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => this.toggleBackgroundMusic());
        }
    }

    async initAudio() {
        try {
            // Create audio context for all audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Load all audio files
            await this.loadAudioFiles();

            // Initialize sound effects
            this.sounds = {
                correct: () => this.playSound('success'),
                incorrect: () => this.playSound('hit'),
                powerup: () => this.playSound('success'),
                click: () => this.playSound('hit')
            };

            // Initialize background music - always on by default
            const musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.1;

            // Create gain node for background music
            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = musicVolume;
            gainNode.connect(this.audioContext.destination);

            this.backgroundMusic = {
                gainNode: gainNode,
                source: null,
                paused: false, // Always start with music enabled
                volume: musicVolume
            };

            // Update music toggle button initial state
            const musicToggle = document.getElementById('music-toggle');
            if (musicToggle) {
                musicToggle.textContent = '🔊'; // Always show as on
            }

            // Resume audio context and start music on first interaction
            const resumeAudio = () => {
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                this.startBackgroundMusic(); // Always start music
                document.removeEventListener('click', resumeAudio);
            };
            document.addEventListener('click', resumeAudio);

            // Start background music if it was playing before
            if (!this.backgroundMusic.paused) {
                this.startBackgroundMusic();
            }
        } catch (error) {
            console.error('Failed to initialize audio:', error);
        }
    }

    async loadAudioFiles() {
        const loadFile = async (name, url) => {
            try {
                console.log(`Loading audio file: ${url}`);
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
                this.audioBuffers[name] = audioBuffer;
                console.log(`Successfully loaded audio file: ${name}`);
            } catch (error) {
                console.error(`Failed to load audio file ${name} (${url}):`, error);
                // Create a silent buffer as fallback
                const sampleRate = this.audioContext.sampleRate;
                const buffer = this.audioContext.createBuffer(2, sampleRate, sampleRate);
                this.audioBuffers[name] = buffer;
            }
        };

        try {
            await Promise.all([
                loadFile('background', AUDIO_FILES.background),
                loadFile('success', AUDIO_FILES.success),
                loadFile('hit', AUDIO_FILES.hit)
            ]);
        } catch (error) {
            console.error('Failed to load audio files:', error);
        }
    }

    playSound(name) {
        if (!this.audioContext || !this.audioBuffers[name]) return;

        try {
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.audioBuffers[name];
            gainNode.gain.value = 0.5; // Half volume for effects
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            source.start(0);
            source.onended = () => {
                source.disconnect();
                gainNode.disconnect();
            };
        } catch (error) {
            console.error(`Failed to play sound ${name}:`, error);
        }
    }

    startBackgroundMusic() {
        if (!this.audioContext || !this.backgroundMusic || !this.audioBuffers.background) return;
        
        // Don't start if already playing
        if (this.backgroundMusic.source) return;

        try {
            const source = this.audioContext.createBufferSource();
            source.buffer = this.audioBuffers.background;
            source.loop = true; // Enable looping
            
            source.connect(this.backgroundMusic.gainNode);
            source.start(0);
            
            this.backgroundMusic.source = source;
            this.backgroundMusic.paused = false;
            
            const musicToggle = document.getElementById('music-toggle');
            if (musicToggle) {
                musicToggle.textContent = '🔊';
            }
        } catch (error) {
            console.error('Failed to start background music:', error);
        }
    }

    stopBackgroundMusic() {
        // We'll keep the music playing - remove this method if you want to prevent stopping
        try {
            if (this.backgroundMusic && this.backgroundMusic.source) {
                this.backgroundMusic.source.stop();
                this.backgroundMusic.source.disconnect();
                this.backgroundMusic.source = null;
            }
        } catch (error) {
            console.error('Failed to stop background music:', error);
        }
    }

    toggleBackgroundMusic() {
        if (!this.backgroundMusic) return;

        // Always restart music if it's not playing
        if (!this.backgroundMusic.source) {
            this.startBackgroundMusic();
        }
        
        // Only handle volume control
        const musicToggle = document.getElementById('music-toggle');
        if (musicToggle && !musicToggle._hasVolumeControl) {
            musicToggle._hasVolumeControl = true;
            musicToggle.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const currentVolume = this.backgroundMusic.gainNode.gain.value;
                const newVolume = prompt('Enter volume (0-100):', Math.round(currentVolume * 100));
                if (newVolume !== null && !isNaN(newVolume)) {
                    const volume = Math.max(0, Math.min(1, newVolume / 100));
                    this.backgroundMusic.gainNode.gain.value = volume;
                    localStorage.setItem('musicVolume', volume);
                }
            });
        }
    }

    initLives() {
        const now = new Date();
        const lastPlayDate = localStorage.getItem('lastPlayDate');
        const storedLives = parseInt(localStorage.getItem('lives')) || MAX_LIVES;
        
        if (!lastPlayDate || new Date(lastPlayDate).getDate() !== now.getDate()) {
            this.lives = MAX_LIVES;
            localStorage.setItem('lives', this.lives.toString());
            localStorage.setItem('lastPlayDate', now.toISOString());
            this.nextLifeTime = null;
        } else {
            this.lives = storedLives;
            const nextLifeTimeStr = localStorage.getItem('nextLifeTime');
            this.nextLifeTime = nextLifeTimeStr ? new Date(nextLifeTimeStr) : null;
            
            if (this.nextLifeTime && now >= this.nextLifeTime) {
                this.addLife();
            }
        }

        if (this.lives < MAX_LIVES && !this.nextLifeTime) {
            this.startLifeRegeneration();
        }

        this.updateLivesDisplay();
    }

    updateLivesDisplay() {
        const livesContainer = document.getElementById('lives-container');
        if (!livesContainer) return;

        livesContainer.innerHTML = '';

        for (let i = 0; i < MAX_LIVES; i++) {
            const heart = document.createElement('span');
            heart.className = i < this.lives ? 'text-red-500' : 'text-gray-500 opacity-50';
            heart.textContent = i < this.lives ? '❤️' : '🖤';
            heart.style.display = 'inline-block';
            heart.style.transform = 'scale(1)';
            heart.style.transition = 'transform 0.3s ease';
            
            if (i < this.lives) {
                heart.addEventListener('mouseover', () => {
                    heart.style.transform = 'scale(1.2)';
                });
                heart.addEventListener('mouseout', () => {
                    heart.style.transform = 'scale(1)';
                });
            }
            
            livesContainer.appendChild(heart);
        }

        const timerElement = document.getElementById('life-timer');
        if (timerElement && this.nextLifeTime) {
            this.updateLifeTimer();
        }
    }

    startLifeRegeneration() {
        if (this.lives >= MAX_LIVES) return;
        
        const now = new Date();
        this.nextLifeTime = new Date(now.getTime() + (4 * 60 * 60 * 1000));
        localStorage.setItem('nextLifeTime', this.nextLifeTime.toISOString());
        
        this.updateLifeTimer();
        
        setTimeout(() => {
            this.addLife();
        }, this.nextLifeTime - now);
    }

    updateLifeTimer() {
        if (!this.nextLifeTime) return;
        
        const timerElement = document.getElementById('life-timer');
        if (!timerElement) return;
        
        const updateTimer = () => {
            const now = new Date();
            const timeLeft = this.nextLifeTime - now;
            
            if (timeLeft <= 0) {
                timerElement.textContent = '';
                return;
            }
            
            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
            timerElement.textContent = `Next life in: ${hours}h ${minutes}m`;
        };
        
        updateTimer();
        setInterval(updateTimer, 60000);
    }

    addLife() {
        if (this.lives < MAX_LIVES) {
            this.lives++;
            localStorage.setItem('lives', this.lives.toString());
            this.updateLivesDisplay();
            
            if (this.lives < MAX_LIVES) {
                this.startLifeRegeneration();
            } else {
                this.nextLifeTime = null;
                localStorage.removeItem('nextLifeTime');
            }
        }
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            localStorage.setItem('lives', this.lives.toString());
            this.updateLivesDisplay();
            
            if (this.lives === MAX_LIVES - 1) {
                this.startLifeRegeneration();
            }

            if (this.lives <= 0) {
                this.gameOver();
            }
        }
    }

    canPlay() {
        return this.lives > 0;
    }

    playSound(type) {
        if (this.sounds && this.sounds[type]) {
            this.sounds[type]();
        }
    }

    addPoints(points) {
        this.totalScore += points;
        localStorage.setItem('totalScore', this.totalScore);
        this.checkAchievements();
        this.showFloatingPoints(points);
    }

    showFloatingPoints(points) {
        const pointsDiv = document.createElement('div');
        pointsDiv.className = 'floating-points text-2xl font-bold text-green-500';
        pointsDiv.textContent = '+' + points;
        document.body.appendChild(pointsDiv);
        
        setTimeout(() => pointsDiv.remove(), 800);
    }

    checkAchievements() {
        const achievements = {
            'Beginner': { score: 1000, icon: '🌟' },
            'Intermediate': { score: 5000, icon: '🏆' },
            'Expert': { score: 10000, icon: '👑' },
            'Master': { score: 20000, icon: '🎓' }
        };

        for (const [name, data] of Object.entries(achievements)) {
            if (this.totalScore >= data.score && !this.achievements[name]) {
                this.achievements[name] = true;
                this.showAchievement(name, data.icon);
                localStorage.setItem('achievements', JSON.stringify(this.achievements));
            }
        }
    }

    showAchievement(name, icon) {
        const achievementDiv = document.createElement('div');
        achievementDiv.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg badge';
        achievementDiv.innerHTML = `
            <div class="text-2xl mb-2">${icon}</div>
            <div class="font-bold">Achievement Unlocked!</div>
            <div>${name}</div>
        `;
        document.body.appendChild(achievementDiv);
        
        setTimeout(() => achievementDiv.remove(), 3000);
    }

    gameOver() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over';
        
        const nextLifeIn = this.nextLifeTime ? this.getTimeUntilNextLife() : null;
        
        overlay.innerHTML = `
            <div class="bg-white p-8 rounded-lg text-center max-w-md">
                <h2 class="text-3xl font-bold mb-4">Out of Lives!</h2>
                <div class="text-4xl mb-6">💔</div>
                <p class="text-xl mb-4">Final Score: ${this.totalScore}</p>
                ${nextLifeIn ? `
                    <div class="mb-6">
                        <p class="text-gray-600">Next life available in:</p>
                        <p class="text-2xl font-bold text-blue-600">${nextLifeIn}</p>
                    </div>
                ` : ''}
                <div class="bg-blue-50 p-4 rounded-lg mb-6">
                    <p class="text-gray-600">💡 Lives regenerate every 4 hours, up to ${MAX_LIVES} lives per day.</p>
                </div>
                <div class="space-x-4">
                    <button onclick="location.reload()" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        Check Lives
                    </button>
                    <button onclick="location.href='index.html'" class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">
                        Main Menu
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    getTimeUntilNextLife() {
        if (!this.nextLifeTime) return null;
        
        const now = new Date();
        const timeLeft = this.nextLifeTime - now;
        
        const hours = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        
        return `${hours}h ${minutes}m`;
    }
}

// Initialize game state
document.addEventListener('DOMContentLoaded', function() {
    window.gameState = new GameState();
    
    // Update score display if it exists
    const scoreDisplay = document.getElementById('total-score');
    if (scoreDisplay) {
        scoreDisplay.textContent = window.gameState.totalScore;
    }
});
