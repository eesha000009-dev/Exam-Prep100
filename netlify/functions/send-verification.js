const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email, code;
  try {
    ({ email, code } = JSON.parse(event.body));
  } catch (err) {
    return { statusCode: 400, body: 'Invalid request body' };
  }

  // Configure transporter with Brevo SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: 'fuhadadeyemo@gmail.com', // Brevo SMTP username (your Brevo login email)
      pass: 'xsmtpsib-78fd377550d2a0a8245bf56868eface218ac0ac476e77d62e026943dd84253d3-XgshPfBjZ1Kmz9w3' // Brevo SMTP key
    }
  });

  const mailOptions = {
    from: 'Owluminate <no-reply@owluminate.com>',
    to: email,
    subject: 'Verify your email address',
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: JSON.stringify({ message: 'Verification email sent' }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
