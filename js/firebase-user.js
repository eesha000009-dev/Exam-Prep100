// Shared Firebase user helper module for pages that need lightweight personalization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-check.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize App Check when recaptchaSiteKey is present. This mirrors the secure dashboard behavior.
if (firebaseConfig && firebaseConfig.recaptchaSiteKey) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(firebaseConfig.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    });
    console.log('App Check initialized (shared module)');
  } catch (err) {
    console.warn('App Check init failed (shared):', err && err.message ? err.message : err);
  }
} else {
  console.warn('App Check skipped in shared module: recaptchaSiteKey missing in firebase-config.js');
}

// Lightweight helpers for pages that only need to personalize UI
function onUserChange(handler) {
  return onAuthStateChanged(auth, async (u) => {
    if (!u) return handler(null);
    let profile = {};
    try {
      const snap = await getDoc(doc(db, 'students', u.uid));
      if (snap.exists()) profile = snap.data();
    } catch (e) {
      console.warn('Failed to load profile in shared module', e);
    }
  handler({ uid: u.uid, displayName: u.displayName || u.email || 'Student', photoURL: u.photoURL || '', profile });
  });
}

async function getUnreadNotificationsCount(uid) {
  try {
    const q = query(collection(db, 'notifications'), where('userId', '==', uid), where('read', '==', false));
    const snap = await getDocs(q);
    return snap.size;
  } catch (e) {
    console.warn('getUnreadNotificationsCount failed', e);
    return 0;
  }
}

export { app, auth, db, onUserChange, getUnreadNotificationsCount };

// Utility: get two-letter initials from a display name (uppercase). Returns empty string if no name.
function initialsFromName(name) {
  if (!name || typeof name !== 'string') return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + (parts[1][0] || '')).slice(0,2).toUpperCase();
}

export { initialsFromName };
