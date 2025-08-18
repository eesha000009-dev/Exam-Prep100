const { onRequest } = require('@vercel/node');
const axios = require('axios');

module.exports = onRequest(async (req, res) => {
  // Set comprehensive CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const apiKey = '18f88d2eb2fa4217b469ed7183e327df'; // Using the provided API key directly
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'education OR exam OR waec OR jamb OR study tips',
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 5,
        apiKey
      }
    });
    const news = response.data.articles.map(article => ({
      title: article.title,
      url: article.url
    }));
    res.json({ news });
  } catch (err) {
    console.error('NewsAPI Error:', err.message);
    if (err.response) {
      console.error('Response Status:', err.response.status);
      console.error('Response Data:', err.response.data);
      // Send the actual error status code
      res.status(err.response.status).json({ 
        news: [], 
        error: `NewsAPI Error: ${err.response.status} - ${err.response.data?.message || err.message}` 
      });
    } else {
      res.status(500).json({ news: [], error: 'Internal server error: ' + err.message });
    }
  }
});
