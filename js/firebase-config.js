// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKEAsHk-Uh31U3O6Abq2E7HZQLJooa7S8",
  authDomain: "exam-prep100-v2.firebaseapp.com",
  projectId: "exam-prep100-v2",
  storageBucket: "exam-prep100-v2.firebasestorage.app",
  messagingSenderId: "197475339483",
  appId: "1:197475339483:web:1e2b6b804a08689a4f10fe",
  measurementId: "G-PYCY0C5XL3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = firebase.analytics();

// Get references to Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Make Firebase services available globally
window.db = db;
window.auth = auth;
window.analytics = analytics;