// Netlify/Vercel serverless function example for Brevo (Sendinblue)
// Place this file in your Netlify functions folder or Vercel api folder
// Install: npm install @sendinblue/client

const SibApiV3Sdk = require('@sendinblue/client');

// Use environment variables for API key
const apiKey = process.env.SENDINBLUE_API_KEY;

const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

// Netlify: exports.handler, Vercel: export default
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const { email, code } = JSON.parse(event.body);
    await brevo.sendTransacEmail({
      sender: { email: 'no-reply@yourdomain.com', name: 'Owluminate' },
      to: [{ email }],
      subject: 'Your Owluminate Verification Code',
      htmlContent: `<p>Your verification code is: <b>${code}</b></p>`
    });
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
