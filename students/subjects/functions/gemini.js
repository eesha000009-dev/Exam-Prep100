const fetch = require('node-fetch');

// Netlify function: accepts { prompt } in POST body, responds with { text, audio?: 'data:audio/...;base64,...' }
exports.handler = async function(event, context) {
  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt' }) };

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY || process.env.ELEVENLAB_API_KEY;

    if (!GEMINI_API_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }) };

    // Call Gemini (Generative Language API)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Use minimal supported payload
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const geminiData = await geminiRes.json();

    // Extract best text answer with fallbacks
    let answerText = null;
    try {
      answerText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || geminiData?.candidates?.[0]?.content?.text || geminiData?.output?.[0]?.content?.text || null;
    } catch (e) { answerText = null; }
    if (!answerText) {
      // fallback: stringify the response for debugging
      answerText = (typeof geminiData === 'string') ? geminiData : JSON.stringify(geminiData);
    }

    // If ElevenLabs key present, request TTS and return base64 audio
    let audioDataUrl = null;
    if (ELEVEN_API_KEY) {
      try {
        // Default voice: "alloy" (if unavailable, ElevenLabs returns error). Adjust via env if you want.
        const voiceId = process.env.ELEVEN_VOICE_ID || 'alloy';
        const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`;

        const ttsRes = await fetch(ttsUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': ELEVEN_API_KEY
          },
          body: JSON.stringify({ text: answerText })
        });

        if (ttsRes.ok) {
          const arrayBuffer = await ttsRes.arrayBuffer();
          const buf = Buffer.from(arrayBuffer);
          const mime = ttsRes.headers.get('content-type') || 'audio/mpeg';
          audioDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
        } else {
          // try to include ElevenLabs error for debugging
          const errText = await ttsRes.text().catch(()=>null);
          console.warn('ElevenLabs TTS error', ttsRes.status, errText);
        }
      } catch (ttsErr) {
        console.warn('ElevenLabs TTS request failed', ttsErr);
      }
    }

    const payload = { text: answerText };
    if (audioDataUrl) payload.audio = audioDataUrl;

    return { statusCode: 200, body: JSON.stringify(payload) };
  } catch (err) {
    console.error('Function error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', details: String(err) }) };
  }
};
