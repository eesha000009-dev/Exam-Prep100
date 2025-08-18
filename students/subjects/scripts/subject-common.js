// Toolbar functionality
function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `
        <div class="relative group">
            <button id="toolbarBtn" class="toolbar-btn" title="Learning Tools" aria-label="Toggle Learning Tools">
                <i class="fas fa-toolbox text-4xl"></i>
            </button>
            <div id="toolbarMenu" class="toolbar-menu hidden">
                <a href="#" onclick="openTool('ai-tutor')" class="toolbar-item">
                    <i class="fas fa-robot text-purple-500"></i>
                    <span>AI Tutor</span>
                </a>
                <a href="#" onclick="openTool('smart-notes')" class="toolbar-item">
                    <i class="fas fa-sticky-note text-yellow-500"></i>
                    <span>Smart Notes</span>
                </a>
                <a href="#" onclick="openTool('formula')" class="toolbar-item">
                    <i class="fas fa-superscript text-teal-500"></i>
                    <span>Formula Tool</span>
                </a>
                <a href="#" onclick="openTool('dictionary')" class="toolbar-item">
                    <i class="fas fa-book-reader text-amber-500"></i>
                    <span>Dictionary</span>
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(toolbar);

    // Toggle menu
    const toolbarBtn = document.getElementById('toolbarBtn');
    const toolbarMenu = document.getElementById('toolbarMenu');

    toolbarBtn.addEventListener('click', () => {
        toolbarMenu.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!toolbar.contains(e.target)) {
            toolbarMenu.classList.add('hidden');
        }
    });
}

// Modal functionality
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <h3 class="text-xl font-semibold mb-4">${title}</h3>
        <div class="modal-content">
            ${content}
        </div>
        <div class="mt-6 flex justify-end gap-3">
            <button onclick="closeModal()" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Close</button>
            <button onclick="startLesson()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Start Learning</button>
        </div>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay hidden';
    overlay.onclick = closeModal;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
}

function showModal(title, content) {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.modal-overlay');
    if (modal && overlay) {
        modal.querySelector('h3').textContent = title;
        modal.querySelector('.modal-content').innerHTML = content;
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    }
}

function closeModal() {
    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.modal-overlay');
    if (modal && overlay) {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }
}

// Tool functions
function openTool(toolName) {
    switch(toolName) {
        case 'ai-tutor':
            window.location.href = '../ai-tutor-chatbot.html';
            break;
        case 'smart-notes':
            window.location.href = '../smart-note.html';
            break;
        case 'formula':
            // Handle formula tool
            break;
        case 'dictionary':
            // Handle dictionary
            break;
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    createToolbar();
});
