import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Initialize nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass
  }
});

// Email template for verification
const createVerificationEmailTemplate = (code: string, name: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://owluminate.com/logo.png" alt="Owluminate Logo" style="width: 150px;">
      </div>
      <h2 style="color: #16a34a; text-align: center;">Verify Your Email Address</h2>
      <p>Hello ${name},</p>
      <p>Thank you for creating an account with Owluminate. To complete your registration, please use the following verification code:</p>
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
        <h1 style="color: #16a34a; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't create an account with Owluminate, please ignore this email.</p>
      <div style="margin-top: 40px; text-align: center; color: #6b7280; font-size: 14px;">
        <p>© ${new Date().getFullYear()} Owluminate. All rights reserved.</p>
      </div>
    </div>
  `;
};

export const sendVerificationEmail = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    const userId = context.params.userId;

    try {
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
      );

      // Store verification data
      await admin.firestore().collection('users').doc(userId).update({
        verificationCode,
        verificationCodeExpires: expiresAt,
        verificationAttempts: 0,
        emailVerified: false
      });

      // Send email
      await transporter.sendMail({
        from: '"Owluminate" <noreply@owluminate.com>',
        to: userData.email,
        subject: 'Verify Your Email Address - Owluminate',
        html: createVerificationEmailTemplate(verificationCode, userData.name)
      });

      return { success: true };
    } catch (error) {
      console.error('Error sending verification email:', error);
      // Update user document with error status
      await admin.firestore().collection('users').doc(userId).update({
        emailVerificationError: error.message
      });
      throw new functions.https.HttpsError('internal', 'Error sending verification email');
    }
  });
