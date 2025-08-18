const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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
