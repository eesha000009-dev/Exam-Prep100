// Use node-fetch for this environment
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const { prompt } = JSON.parse(event.body || '{}');
    if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt' }) };

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY || process.env.ELEVENLABS_API_KEY || process.env.ELEVENLAB_API_KEY;

    if (!GEMINI_API_KEY) return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured' }) };

    const fetchWithTimeout = async (url, opts = {}, ms = 10000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), ms);
      try {
        const res = await fetch(url, { ...opts, signal: controller.signal });
        return res;
      } finally { clearTimeout(id); }
    };

    // Gemini call
    let geminiData = null;
    try {
      const geminiRes = await fetchWithTimeout(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }, 10000);

      const ct = geminiRes.headers.get('content-type') || '';
      if (ct.includes('application/json')) geminiData = await geminiRes.json();
      else geminiData = await geminiRes.text().catch(()=>null);
    } catch (e) {
      console.warn('Gemini request failed/timeout', e && e.name ? e.name : e);
      return { statusCode: 502, body: JSON.stringify({ error: 'Gemini request failed or timed out' }) };
    }

    let answerText = null;
    try {
      if (typeof geminiData === 'string') answerText = geminiData;
      else answerText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || geminiData?.candidates?.[0]?.content?.text || geminiData?.output?.[0]?.content?.text || null;
    } catch (e) { answerText = null; }
    if (!answerText) answerText = (typeof geminiData === 'string') ? geminiData : JSON.stringify(geminiData || {});

    // ElevenLabs TTS (similar retry logic)
    let audioDataUrl = null;
    if (ELEVEN_API_KEY) {
      try {
        let voiceId = process.env.ELEVEN_VOICE_ID || 'alloy';
        const ttsAttempt = async (id) => await fetchWithTimeout(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(id)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'xi-api-key': ELEVEN_API_KEY }, body: JSON.stringify({ text: answerText }) }, 5000);

        let ttsRes = null;
        try { ttsRes = await ttsAttempt(voiceId); } catch(e){ ttsRes = null; }
        if (!ttsRes || !ttsRes.ok) {
          const errText = ttsRes ? await ttsRes.text().catch(()=>null) : 'TTS timeout or no response';
          console.warn('ElevenLabs TTS error', ttsRes ? ttsRes.status : 'no-resp', errText);
          if (errText && errText.includes('voice_not_found')) {
            try {
              const voicesRes = await fetchWithTimeout('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': ELEVEN_API_KEY } }, 5000);
              if (voicesRes.ok) {
                const voicesJson = await voicesRes.json();
                const firstVoice = Array.isArray(voicesJson) ? voicesJson[0] : (voicesJson?.voices?.[0]);
                const newVoiceId = firstVoice?.voice_id || firstVoice?.id || firstVoice?.voiceId || null;
                if (newVoiceId) {
                  ttsRes = await ttsAttempt(newVoiceId);
                }
              }
            } catch (listErr) { console.warn('Error fetching ElevenLabs voices', listErr); }
          }
        }

        if (ttsRes && ttsRes.ok) {
          const arrayBuffer = await ttsRes.arrayBuffer();
          const buf = Buffer.from(arrayBuffer);
          const mime = ttsRes.headers.get('content-type') || 'audio/mpeg';
          audioDataUrl = `data:${mime};base64,${buf.toString('base64')}`;
        }
      } catch (ttsErr) { console.warn('ElevenLabs TTS request failed', ttsErr); }
    }

    const payload = { text: answerText };
    if (audioDataUrl) payload.audio = audioDataUrl;
    return { statusCode: 200, body: JSON.stringify(payload) };
  } catch (err) {
    console.error('Function error', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error', details: String(err) }) };
  }
};
