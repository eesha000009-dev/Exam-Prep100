// Netlify/Vercel serverless function example for Brevo (Sendinblue)
// Place this file in your Netlify functions folder or Vercel api folder
// Install: npm install @sendinblue/client

const SibApiV3Sdk = require('@sendinblue/client');

// NEVER hardcode your API key in production. Use environment variables!
const apiKey = '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';

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
