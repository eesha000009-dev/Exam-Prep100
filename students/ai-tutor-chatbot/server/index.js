const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { createWorker } = require('tesseract.js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Simple in-memory job store (for demo only)
const jobs = {};
let jobCounter = 1;

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const includeFull = req.body.includeFull === 'true';
    const filePath = req.file.path;
    const url = `${req.protocol}://${req.get('host')}/uploads/${path.basename(filePath)}`;

    // If PDF or image, decide whether to process now or queue
    if (req.file.mimetype === 'application/pdf') {
      const data = fs.readFileSync(filePath);
      const pdfData = await pdfParse(data);
      const text = pdfData.text || '';

      if (!includeFull && text.length > 15000) {
        // queue background job
        const jobId = jobCounter++;
        jobs[jobId] = { status: 'processing', result: null };
        // Simulate background work
        setTimeout(() => {
          jobs[jobId] = { status: 'done', result: text };
        }, 1000);
        return res.json({ url, jobId, status: 'processing' });
      } else {
        return res.json({ url, extractedText: text });
      }
    }

    // If image, run OCR in background (could be immediate for small images)
    if (req.file.mimetype.startsWith('image/')) {
      const jobId = jobCounter++;
      jobs[jobId] = { status: 'processing', result: null };
      // Run OCR asynchronously
      (async () => {
        try {
          const worker = createWorker();
          await worker.load();
          await worker.loadLanguage('eng');
          await worker.initialize('eng');
          const { data: { text } } = await worker.recognize(filePath);
          await worker.terminate();
          jobs[jobId] = { status: 'done', result: text };
        } catch (e) {
          console.error('OCR failed', e);
          jobs[jobId] = { status: 'error', error: String(e) };
        }
      })();
      return res.json({ url, jobId, status: 'processing' });
    }

    // Default: return url only
    return res.json({ url });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Job status endpoint
app.get('/job/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!jobs[id]) return res.status(404).json({ error: 'Job not found' });
  return res.json(jobs[id]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Upload server listening on ${PORT}`));
