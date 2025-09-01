/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const SibApiV3Sdk = require('@sendinblue/client');
const logger = require("firebase-functions/logger");

// Set global options
const {setGlobalOptions} = require("firebase-functions");
setGlobalOptions({ maxInstances: 10 });

// Initialize Sendinblue API
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

exports.sendVerificationEmail = functions.https.onCall(async (data, context) => {
    // Log function invocation
    logger.info("sendVerificationEmail function called", {
        uid: context.auth ? context.auth.uid : null,
        email: data.email
    });

    // Check if request is authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const { email, code } = data;

    if (!email || !code) {
        throw new functions.https.HttpsError('invalid-argument', 'Email and verification code are required.');
    }

    try {
        // Create Sendinblue email request
        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        
        sendSmtpEmail.to = [{ "email": email }];
        sendSmtpEmail.subject = 'Verify your Owluminate account';
        sendSmtpEmail.htmlContent = `
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
        `;
        sendSmtpEmail.sender = { "email": "noreply@owluminate.com", "name": "Owluminate" };

        // Send the email
        await apiInstance.sendTransacEmail(sendSmtpEmail);
        logger.info("Verification email sent successfully", {email: data.email});
        return { success: true };

    } catch (error) {
        logger.error("Error sending verification email", {
            error: error.message,
            email: data.email
        });
        throw new functions.https.HttpsError('internal', 'Error sending verification email.');
    }
});

