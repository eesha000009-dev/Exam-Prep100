import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

admin.initializeApp();

// Configure nodemailer with Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().email.user,
        pass: functions.config().email.pass
    }
});

export const sendVerificationEmail = functions.https.onCall(async (data, context) => {
    // Check if request is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const { email, code } = data;

    if (!email || !code) {
        throw new functions.https.HttpsError('invalid-argument', 'Email and verification code are required.');
    }

    try {
        // Send verification email
        const mailOptions = {
            from: functions.config().email.user,
            to: email,
            subject: 'Verify your Owluminate account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #22C55E;">Welcome to Owluminate!</h2>
                    <p>Please verify your email address to complete your registration.</p>
                    <p>Your verification code is:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #22C55E; letter-spacing: 5px; margin: 0;">${code}</h1>
                    </div>
                    <p>This code will expire in 2 minutes.</p>
                    <p>If you didn't create an account with Owluminate, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #6b7280; font-size: 14px;">This is an automated email. Please do not reply.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        return { success: true };

    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new functions.https.HttpsError('internal', 'Error sending verification email.');
    }
});
