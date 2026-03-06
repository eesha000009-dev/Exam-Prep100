const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
// multer for handling multipart/form-data (file uploads)
let multer;
try { multer = require('multer'); } catch (e) { console.warn('multer not installed; upload endpoints will fail until multer is added to dependencies'); }

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir); } catch (err) { console.warn('Could not create uploads directory:', err.message); }
}

const storage = multer ? multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) { const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,'_'); cb(null, safe); }
}) : null;
const upload = multer ? multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }) : null;

// AI tutor endpoint
router.post('/cortex-ai/chat', async (req, res) => {
  try {
    const { message, subject, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const prompt = `You are an expert tutor specializing in ${subject || 'all subjects'}. 
    The student's question is: "${message}"
    ${context ? `Previous context: ${context}` : ''}
    
    Provide a detailed, educational response that helps the student understand the concept thoroughly. 
    Include examples and explanations where appropriate.`;

    const geminiResponse = await getGeminiResponse(prompt);
    res.json({ response: geminiResponse });
  } catch (err) {
    console.error('AI Error:', err);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// News API endpoint
router.get('/news', async (req, res) => {
  try {
    const news = [
      {
        title: 'Educational Technology Updates',
        description: 'Latest advancements in educational technology and their impact on learning.',
        source: 'EduTech Weekly',
        publishedAt: new Date().toLocaleDateString(),
        url: '#'
      },
      {
        title: 'Study Tips for Success',
        description: 'Expert advice on effective study techniques and time management.',
        source: 'Learning Hub',
        publishedAt: new Date().toLocaleDateString(),
        url: '#'
      }
    ];
    res.json({ news });
  } catch (error) {
    console.error('News API Error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// Upload endpoints: photos, videos, quizzes
// POST /api/uploads/photo - field name: file
router.post('/uploads/photo', upload ? upload.single('file') : (req,res)=>res.status(500).json({ error: 'multer not configured' }), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    return res.json({ ok: true, url, filename: req.file.filename });
  } catch (err) { console.error('Photo upload error', err); res.status(500).json({ error: 'Upload failed' }); }
});

// POST /api/uploads/video - field name: file
router.post('/uploads/video', upload ? upload.single('file') : (req,res)=>res.status(500).json({ error: 'multer not configured' }), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/${req.file.filename}`;
    return res.json({ ok: true, url, filename: req.file.filename });
  } catch (err) { console.error('Video upload error', err); res.status(500).json({ error: 'Upload failed' }); }
});

// POST /api/uploads/quiz - accept JSON body describing quiz or optional file
router.post('/uploads/quiz', async (req, res) => {
  try {
    // Accept either JSON quiz in body or a small file via multipart (not handled here)
    const quiz = req.body;
    if (!quiz || Object.keys(quiz).length === 0) return res.status(400).json({ error: 'Quiz payload required' });
    const id = 'quiz-' + Date.now();
    const target = path.join(uploadsDir, id + '.json');
    fs.writeFileSync(target, JSON.stringify(quiz, null, 2));
    const url = `/uploads/${id}.json`;
    res.json({ ok: true, url, id });
  } catch (err) { console.error('Quiz save error', err); res.status(500).json({ error: 'Failed to save quiz' }); }
});

// Helper function for Gemini API
async function getGeminiResponse(prompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to get Gemini response');
  }

  return data;
}

module.exports = router;

