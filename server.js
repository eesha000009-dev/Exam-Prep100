const express = require('express');
const path = require('path');
const app = express();

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Parse JSON bodies
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Handle both /students/student-dashboard and /students/student-dashboard.html
app.get(['/students/student-dashboard', '/students/student-dashboard.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'students', 'student-dashboard.html'));
});

app.get('/students/news-feed', (req, res) => {
  res.sendFile(path.join(__dirname, 'students', 'news-feed-gemini.html'));
});

// Serve repository root static files (so root index.html and other top-level static
// assets are available). This allows the main landing page (index.html) to be
// served directly from the repo root.
app.use(express.static(path.join(__dirname)));

// Special handling for root: if an index.html exists at repo root serve it,
// otherwise fall back to redirecting to the student dashboard.
const fs = require('fs');
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.redirect('/students/student-dashboard');
});

// Health check endpoint used by Render and uptime monitoring.
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Serve static directories
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/students', express.static(path.join(__dirname, 'students')));

// Note: news API removed during cleanup.

// Custom 404 handler
app.use((req, res) => {
  console.log('404 for:', req.url);
  res.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Page Not Found</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
          h1 { color: #2563eb; }
        </style>
      </head>
      <body>
        <h1>Page Not Found</h1>
        <p>The requested page could not be found.</p>
        <p><a href="/students/student-dashboard">Return to Dashboard</a></p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('- /students/student-dashboard');
  console.log('- /students/news-feed');
});
