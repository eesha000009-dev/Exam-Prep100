import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const MAX_VERIFICATION_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export const verifyEmail = functions.https.onCall(async (data, context) => {
  const { userId, code } = data;

  try {
    // Get user document
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    // Check if user is locked out
    if (userData.lockedUntil && userData.lockedUntil.toMillis() > Date.now()) {
      const remainingTime = Math.ceil((userData.lockedUntil.toMillis() - Date.now()) / 60000);
      throw new functions.https.HttpsError(
        'permission-denied',
        `Too many attempts. Please try again in ${remainingTime} minutes`
      );
    }

    // Check if code has expired
    if (userData.verificationCodeExpires.toMillis() < Date.now()) {
      throw new functions.https.HttpsError('deadline-exceeded', 'Verification code has expired');
    }

    // Increment attempt counter
    const attempts = (userData.verificationAttempts || 0) + 1;
    await userDoc.ref.update({ verificationAttempts: attempts });

    // Check if max attempts reached
    if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
      const lockedUntil = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + LOCKOUT_DURATION)
      );
      await userDoc.ref.update({ lockedUntil });
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Too many attempts. Please try again later'
      );
    }

    // Verify code
    if (code !== userData.verificationCode) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid verification code'
      );
    }

    // Update user document
    await userDoc.ref.update({
      emailVerified: true,
      verificationCode: admin.firestore.FieldValue.delete(),
      verificationCodeExpires: admin.firestore.FieldValue.delete(),
      verificationAttempts: admin.firestore.FieldValue.delete(),
      lockedUntil: admin.firestore.FieldValue.delete()
    });

    return { success: true };
  } catch (error) {
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', 'Error verifying email');
  }
});
