// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsdW-mROXR_2tLOzprSmqc2HSD-dI7bC8",
  authDomain: "exam-prep100-61fe5.firebaseapp.com",
  projectId: "exam-prep100-61fe5",
  storageBucket: "exam-prep100-61fe5.firebasestorage.app",
  messagingSenderId: "966809109167",
  appId: "1:966809109167:web:6c83dceeb530247b7e8a5a",
  measurementId: "G-4RZGXMVCYP"
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