// API Key (Use backend proxy in production)
const GEMINI_API_KEY = "AIzaSyCTGS3B2ZfPRlLDDV5vFp62rwgrxWRIW8I";

// Elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const photoInput = document.getElementById('photo-input');
const pdfInput = document.getElementById('pdf-input');
const micBtn = document.getElementById('mic-btn');
const calculatorSection = document.getElementById('calculator-section');
const calcInput = document.getElementById('calc-input');
const calcSubmit = document.getElementById('calc-submit');
const graphCanvas = document.getElementById('graph-canvas');
const toolsMenu = document.getElementById('toolsMenu');
const errorToast = document.getElementById('error-toast');
const errorMessageEl = document.getElementById('error-message');

let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
let recognition;

// Attachment support: pendingAttachment holds { type: 'image'|'pdf', dataUrl, name }
let pendingAttachment = null;
const attachmentPreview = document.getElementById('attachment-preview');
const uploadImageBtn = document.getElementById('upload-image-btn');
const uploadPdfBtn = document.getElementById('upload-pdf-btn');

// Ensure hidden inputs exist
const photoInputEl = document.getElementById('photo-input');
const pdfInputEl = document.getElementById('pdf-input');

uploadImageBtn?.addEventListener('click', () => photoInputEl?.click());
uploadPdfBtn?.addEventListener('click', () => pdfInputEl?.click());

function showError(message, duration = 5000) {
    if (!errorToast || !errorMessageEl) return alert(message);
    errorMessageEl.textContent = message;
    errorToast.classList.remove('hidden');
    setTimeout(() => errorToast.classList.add('hidden'), duration);
}

function saveHistory() {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function addMessage(sender, message, type = 'text', attachment = null) {
    const msg = { sender, message, type, attachment, timestamp: new Date().toISOString() };
    chatHistory.push(msg);
    saveHistory();
    renderChat();
}

function renderAttachmentPreview() {
    if (!attachmentPreview) return;
    attachmentPreview.innerHTML = '';
    if (!pendingAttachment) return;

    const container = document.createElement('div');
    container.className = 'flex items-center gap-4 bg-gray-50 p-2 rounded-lg border border-gray-200';

    if (pendingAttachment.type === 'image') {
        const img = document.createElement('img');
        img.src = pendingAttachment.url;
        img.className = 'h-20 rounded';
        container.appendChild(img);
    } else if (pendingAttachment.type === 'pdf') {
        const icon = document.createElement('div');
        icon.className = 'h-20 w-16 flex items-center justify-center bg-red-50 rounded';
        icon.innerHTML = '<i class="fas fa-file-pdf text-red-500 text-2xl"></i>';
        container.appendChild(icon);
    }

    const meta = document.createElement('div');
    meta.className = 'flex-1';
    meta.innerHTML = `<div class="font-semibold">${pendingAttachment.name}</div><div class="text-sm text-gray-500">Attached to next message</div>`;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'text-sm text-red-600 hover:underline';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
        pendingAttachment = null;
        renderAttachmentPreview();
    });

    container.appendChild(meta);
    container.appendChild(removeBtn);
    attachmentPreview.appendChild(container);
}

function renderChat() {
    if (!chatContainer) return;
    chatContainer.innerHTML = '';
    chatHistory.forEach(msg => {
        const wrapper = document.createElement('div');
        wrapper.className = 'flex';
        const bubble = document.createElement('div');
        bubble.className = 'p-4 rounded-2xl max-w-[70%] shadow';
        if (msg.sender === 'You') {
            wrapper.classList.add('justify-end');
            bubble.classList.add('bg-blue-50', 'text-blue-800');
        } else {
            wrapper.classList.add('justify-start');
            bubble.classList.add('bg-white', 'text-gray-800');
        }

        let inner = '';
        if (msg.type === 'text') inner += `<div class="whitespace-pre-wrap">${escapeHtml(msg.message)}</div>`;
        if (msg.attachment) {
            if (msg.attachment.type === 'image') {
                inner += `<div class="mt-2"><img src="${msg.attachment.dataUrl}" class="rounded-lg max-w-xs"></div>`;
            } else if (msg.attachment.type === 'pdf') {
                inner += `<div class="mt-2"><a href="${msg.attachment.dataUrl}" target="_blank" class="text-blue-600 underline">${escapeHtml(msg.attachment.name)}</a></div>`;
            }
        }

        bubble.innerHTML = inner;
        wrapper.appendChild(bubble);
        chatContainer.appendChild(wrapper);
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (window.MathJax) MathJax.Hub.Queue(["Typeset", MathJax.Hub, chatContainer]);
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// Tools menu toggle (exposed to HTML)
window.toggleToolsMenu = function () {
    if (!toolsMenu) return;
    toolsMenu.classList.toggle('hidden');
}

// Calculator modal logic
const calculatorModal = document.getElementById('calculator-modal');
const calcResult = document.getElementById('calc-result');
const closeCalculator = document.getElementById('close-calculator');

window.toggleCalculator = function () {
    if (!calculatorModal) return;
    calculatorModal.classList.remove('hidden');
    calcInput.focus();
};

closeCalculator?.addEventListener('click', () => {
    calculatorModal.classList.add('hidden');
    calcInput.value = '';
    calcResult.textContent = '';
});

// Send message handler
// Update sendBtn handler to include pendingAttachment
sendBtn?.addEventListener('click', async () => {
    const text = (userInput.value || '').trim();
    if (!text && !pendingAttachment) return showError('Enter a question or attach a file');

    // Build message content
    const payloadText = text || (pendingAttachment ? `[${pendingAttachment.type.toUpperCase()} Attachment]` : '');
    const attach = pendingAttachment ? { ...pendingAttachment } : null;

    addMessage('You', payloadText, 'text', attach);

    // Clear input and attachment preview locally (UI)
    userInput.value = '';
    pendingAttachment = null;
    renderAttachmentPreview();

    // Prepare prompt for the AI: include attachment metadata so the tutor knows a file was attached.
    let prompt = payloadText;
    let includeDataInPrompt = false;
    if (attach) {
        prompt += `\n[ATTACHMENT: ${attach.name} | type: ${attach.type} | url: ${attach.url}]`;
        if (attach.type === 'pdf' && attach.extractedText) {
            const MAX_TEXT_CHARS = 15000;
            if (attach.extractedText.length <= MAX_TEXT_CHARS) {
                prompt += `\n[PDF_TEXT_BEGIN]\n${attach.extractedText}\n[PDF_TEXT_END]`;
            } else {
                prompt += `\n[PDF_TEXT_EXCERPT]\n${attach.extractedText.slice(0, 8000)}\n[PDF_TEXT_TRUNCATED]\nPlease summarize and focus on WAEC/JAMB relevant content.`;
            }
        }
        // If the attachment is small enough, include its full Data URL so the model can reference it
        const MAX_ATTACH_LENGTH = 200000; // ~200KB base64 length threshold
        if (typeof attach.dataUrl === 'string' && attach.dataUrl.length <= MAX_ATTACH_LENGTH && attach.type === 'image') {
            includeDataInPrompt = true;
            prompt += `\n[ATTACHMENT_DATA_BEGIN]\n${attach.dataUrl}\n[ATTACHMENT_DATA_END]`;
        } else if (attach.type === 'image' && typeof attach.dataUrl === 'string') {
            prompt += `\n[Image preview length: ${attach.dataUrl.length} chars]`;
        }
    }

    // Send to AI when there is either text or an attachment
    if (text || attach) {
        // Add a temporary assistant message to indicate processing
        addMessage('Tutor', 'Processing your message and attachment...', 'text', null);
        sendBtn.disabled = true;
        try {
            const response = await getGeminiResponse(prompt);
            // Remove the temporary 'Processing' message (last tutor message)
            chatHistory = chatHistory.filter((m, i) => !(m.sender === 'Tutor' && m.message === 'Processing your message and attachment...'));
            saveHistory();
            // Add the tutor's response and (visually) include the attachment so the tutor appears to have access to it
            if (attach) {
                addMessage('Tutor', response, 'text', attach);
            } else {
                addMessage('Tutor', response, 'text', null);
            }
        } catch (e) {
            showError('Failed to get response');
            addMessage('Tutor', 'Error fetching reply', 'text', null);
        } finally {
            sendBtn.disabled = false;
        }
    }
});

// File upload server URL
const UPLOAD_SERVER = 'http://localhost:3000';

async function uploadFileToServer(file) {
    try {
        const includeFull = document.getElementById('include-full-pdf')?.checked ? 'true' : 'false';
        const form = new FormData();
        form.append('file', file);
        form.append('includeFull', includeFull);
        const res = await fetch(`${UPLOAD_SERVER}/upload`, { method: 'POST', body: form });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json(); // { url, extractedText?, jobId?, status? }

        // If server returned a jobId and status processing, poll for completion
        if (data && data.status === 'processing' && data.jobId) {
            const jobId = data.jobId;
            // poll /job/:id
            for (let attempt = 0; attempt < 60; attempt++) { // up to ~60s
                await new Promise(r => setTimeout(r, 1000));
                try {
                    const statusRes = await fetch(`${UPLOAD_SERVER}/job/${jobId}`);
                    if (!statusRes.ok) continue;
                    const statusData = await statusRes.json();
                    if (statusData.status === 'done') {
                        return { url: data.url, extractedText: statusData.result };
                    } else if (statusData.status === 'error') {
                        return { url: data.url, extractedText: null, error: statusData.error };
                    }
                } catch (e) {
                    console.warn('Job poll failed', e);
                }
            }
            // timed out
            return { url: data.url, extractedText: null, jobId };
        }

        return data;
    } catch (e) {
        console.error('Upload error', e);
        showError('File upload failed');
        return null;
    }
}

// Photo upload
photoInputEl?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Upload to server
    const result = await uploadFileToServer(file);
    if (!result) return;
    pendingAttachment = { type: 'image', url: result.url, name: file.name, dataUrl: result.url };
    renderAttachmentPreview();
});

// PDF upload
pdfInputEl?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await uploadFileToServer(file);
    if (!result) return;
    pendingAttachment = { type: 'pdf', url: result.url, name: file.name, extractedText: result.extractedText, dataUrl: result.url };
    renderAttachmentPreview();
    if (result.extractedText && result.extractedText.length > 1000) {
        showError('PDF uploaded and extracted; large file will be summarized for the AI');
    } else if (result.extractedText) {
        showError('PDF uploaded and extracted');
    }
});

// Calculator
calcSubmit?.addEventListener('click', () => {
    const expr = (calcInput?.value || '').trim();
    if (!expr) return showError('Enter an expression');
    try {
        // Use math.js for advanced calculations
        const result = math.evaluate(expr);
        calcResult.textContent = `Result: ${result}`;
        // Save to calc history
        try { 
            const hist = JSON.parse(localStorage.getItem('calcHistory') || '[]');
            hist.unshift({ expr, result: String(result), time: new Date().toISOString() });
            localStorage.setItem('calcHistory', JSON.stringify(hist.slice(0,50)));
            renderCalcHistory();
        } catch (e) { console.warn('Could not save calc history', e); }
    } catch (e) {
        calcResult.textContent = 'Error: Invalid expression';
        showError('Calculation failed');
    }
});

// Advanced calculator keypad logic
const calcDisplay = document.getElementById('calc-display');
const calcError = document.getElementById('calc-error');
const calcClear = document.getElementById('calc-clear');
const calcEquals = document.getElementById('calc-equals');
const calcBtns = document.querySelectorAll('.calc-btn');

let calcExpr = '';

function updateCalcDisplay() {
    calcDisplay.textContent = calcExpr || '0';
    calcError.textContent = '';
}

calcBtns.forEach(btn => {
    if (btn.id === 'calc-clear') {
        btn.addEventListener('click', () => {
            calcExpr = '';
            updateCalcDisplay();
        });
    } else if (btn.id === 'calc-equals') {
        btn.addEventListener('click', () => {
            try {
                // Replace pi and e with math.js constants
                let expr = calcExpr.replace(/π|pi/g, 'pi').replace(/e/g, 'e');
                // Replace ln( with log(
                expr = expr.replace(/ln\(/g, 'log(');
                // Replace log( with log10(
                expr = expr.replace(/log10\(/g, 'log10(');
                // Replace % with /100
                expr = expr.replace(/%/g, '/100');
                const result = math.evaluate(expr);
                calcDisplay.textContent = result;
                calcExpr = '' + result;
                calcError.textContent = '';
            } catch (e) {
                calcError.textContent = 'Invalid expression';
            }
        });

            // Calculator history rendering and interactions
            function renderCalcHistory() {
                const el = document.getElementById('calc-history');
                if (!el) return;
                const hist = JSON.parse(localStorage.getItem('calcHistory') || '[]');
                el.innerHTML = hist.map(h => `<div class="py-1 px-2 hover:bg-gray-100 cursor-pointer" data-expr="${encodeURIComponent(h.expr)}">${escapeHtml(h.expr)} = <strong>${escapeHtml(h.result)}</strong></div>`).join('');
                // attach click handlers
                el.querySelectorAll('[data-expr]').forEach(node => {
                    node.addEventListener('click', () => {
                        const e = decodeURIComponent(node.getAttribute('data-expr'));
                        calcExpr = e;
                        updateCalcDisplay();
                    });
                });
            }
            renderCalcHistory();
    } else {
        btn.addEventListener('click', () => {
            const val = btn.dataset.value;
            if (val === undefined) return;
            if (val === 'pi') {
                calcExpr += 'pi';
            } else if (val === 'e') {
                calcExpr += 'e';
            } else if (val === 'log10(') {
                calcExpr += 'log10('; 
            } else if (val === 'ln(') {
                calcExpr += 'ln('; 
            } else {
                calcExpr += val;
            }
            updateCalcDisplay();
        });
    }
});

// Reset display on modal open
window.toggleCalculator = function () {
    if (!calculatorModal) return;
    calculatorModal.classList.remove('hidden');
    calcExpr = '';
    updateCalcDisplay();
    calcInput?.focus();
};

closeCalculator?.addEventListener('click', () => {
    calculatorModal.classList.add('hidden');
    calcExpr = '';
    updateCalcDisplay();
});

// Make chat input Calculator button open modal
const chatCalcBtn = document.getElementById('chat-calc-btn');
chatCalcBtn?.addEventListener('click', () => {
    window.toggleCalculator();
});

// Speech recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRec();
    recognition.lang = 'en-US';
    recognition.onresult = (e) => { userInput.value = e.results[0][0].transcript; micBtn.classList.remove('bg-red-500'); };
    recognition.onerror = () => { showError('Speech recognition failed'); micBtn.classList.remove('bg-red-500'); };

    micBtn?.addEventListener('click', () => {
        try {
            recognition.start();
            micBtn.classList.add('bg-red-500');
        } catch (e) {
            showError('Speech recognition not available');
        }
    });
} else {
    if (micBtn) micBtn.style.display = 'none';
}

// Gemini API call (same as before)
async function getGeminiResponse(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: `WAEC/JAMB tutor: ${prompt}` }] }] })
        });
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    } catch (e) {
        console.error(e);
        throw e;
    }
}

// PDF text extraction helper using PDF.js
async function extractTextFromPdfDataUrl(dataUrl) {
    // dataUrl: 'data:application/pdf;base64,....'
    try {
        const base64 = dataUrl.split(',')[1];
        const raw = atob(base64);
        const uint8 = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) uint8[i] = raw.charCodeAt(i);
        const loadingTask = pdfjsLib.getDocument({ data: uint8 });
        const pdf = await loadingTask.promise;
        let fullText = '';
        for (let p = 1; p <= pdf.numPages; p++) {
            const page = await pdf.getPage(p);
            const txt = await page.getTextContent();
            const pageText = txt.items.map(i => i.str).join(' ');
            fullText += `\n\n--- Page ${p} ---\n${pageText}`;
        }
        return fullText;
    } catch (e) {
        console.error('PDF extraction failed', e);
        return '';
    }
}

// Initialize render
renderAttachmentPreview();
renderChat();
