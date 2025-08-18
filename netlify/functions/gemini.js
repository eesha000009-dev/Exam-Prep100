// Runtime-safe fetch: use global fetch if available, otherwise require node-fetch
let fetchFn;
try {
  fetchFn = globalThis.fetch || (require('node-fetch'));
  if (fetchFn && fetchFn.default) fetchFn = fetchFn.default;
} catch (e) {
  fetchFn = globalThis.fetch;
}

// Netlify function: accepts { prompt } in POST body, responds with { text, audio?: 'data:audio/...;base64,...' }
exports.handler = async function(event, context) {
  try {
  const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt' }) };

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY || process.env.ELEVENLAB_API_KEY;

    if (!GEMINI_API_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }) };

    // Helper: fetch with timeout
    const fetchWithTimeout = async (url, opts = {}, ms = 10000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);
      try {
        const res = await fetchFn(url, { ...opts, signal: controller.signal });
        return res;
      } finally { clearTimeout(id); }
    };

    // Call Gemini (Generative Language API) with a timeout
    let geminiData = null;
    try {
      const geminiRes = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }, 10000);

      // If response is JSON, parse; otherwise capture text
      const ct = geminiRes.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        geminiData = await geminiRes.json();
      } else {
        const txt = await geminiRes.text().catch(()=>null);
        geminiData = txt || null;
      }
    } catch (gErr) {
      console.warn('Gemini request failed or timed out', gErr && gErr.name ? gErr.name : gErr);
      // Return an error response quickly so the client doesn't hang
      return { statusCode: 502, body: JSON.stringify({ error: 'Gemini request failed or timed out' }) };
    }

    // Extract best text answer with fallbacks
    let answerText = null;
    try {
      if (typeof geminiData === 'string') answerText = geminiData;
      else answerText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || geminiData?.candidates?.[0]?.content?.text || geminiData?.output?.[0]?.content?.text || null;
    } catch (e) { answerText = null; }
    if (!answerText) answerText = (typeof geminiData === 'string') ? geminiData : JSON.stringify(geminiData || {});

    // If ElevenLabs key present, request TTS and return base64 audio
    let audioDataUrl = null;
    if (ELEVEN_API_KEY) {
      try {
        // Default voice from env or fallback
        let voiceId = process.env.ELEVEN_VOICE_ID || 'alloy';
        const ttsAttempt = async (id) => {
          const ttsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id)}`;
          const resp = await fetchFn(ttsUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'xi-api-key': ELEVEN_API_KEY },
            body: JSON.stringify({ text: answerText })
          });
          return resp;
        };

        // try TTS but with a shorter timeout to avoid function timeouts
        let ttsRes = null;
        try { ttsRes = await fetchWithTimeout(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'xi-api-key': ELEVEN_API_KEY }, body: JSON.stringify({ text: answerText }) }, 5000); }
        catch(e){ console.warn('Initial TTS attempt failed/timeout', e); ttsRes = null; }
        if (!ttsRes || !ttsRes.ok) {
          const errText = ttsRes ? await ttsRes.text().catch(()=>null) : 'TTS timeout or no response';
          console.warn('ElevenLabs TTS error', ttsRes.status, errText);
          // If voice not found, fetch available voices and retry with first available
          if (errText && errText.includes('voice_not_found')) {
            try {
              const voicesRes = await fetchFn('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': ELEVEN_API_KEY } });
              if (voicesRes.ok) {
                const voicesJson = await voicesRes.json();
                const firstVoice = Array.isArray(voicesJson) ? voicesJson[0] : (voicesJson?.voices?.[0]);
                const newVoiceId = firstVoice?.voice_id || firstVoice?.id || firstVoice?.voiceId || null;
                if (newVoiceId) {
                  console.warn('Retrying TTS with voice:', newVoiceId);
                  ttsRes = await ttsAttempt(newVoiceId);
                }
              } else {
                console.warn('Failed to list ElevenLabs voices', voicesRes.status);
              }
            } catch (listErr) {
              console.warn('Error fetching ElevenLabs voices', listErr);
            }
          }
        }

        if (ttsRes && ttsRes.ok) {
          const arrayBuffer = await ttsRes.arrayBuffer();
          const buf = Buffer.from(arrayBuffer);
          const mime = ttsRes.headers.get('content-type') || 'audio/mpeg';
          audioDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
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
