// Firebase Configuration for Wolves Den Inventory
// Replace this with your Firebase project configuration
// Get your config from: https://console.firebase.google.com/
// Project Settings > General > Your apps > Web app > Config

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Initialize Firebase Authentication
const auth = firebase.auth();

// Initialize Firebase Storage
let storage = null;

// Function to initialize storage
function initializeStorage() {
  try {
    if (typeof firebase !== 'undefined' && firebase.storage) {
      storage = firebase.storage();
      if (typeof window !== 'undefined') {
        window.storage = storage;
      }
      console.log('✅ Firebase Storage initialized');
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error initializing Firebase Storage:', error);
    return false;
  }
}

// Initialize storage
if (!initializeStorage()) {
  setTimeout(() => {
    if (!initializeStorage()) {
      console.error('Failed to initialize Firebase Storage after retry');
    }
  }, 100);
}

// Enable offline persistence for Firestore
db.enablePersistence({ synchronizeTabs: true })
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn('⚠️ Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
      console.warn('⚠️ The current browser does not support offline persistence');
    }
  });

console.log('✅ Firestore offline persistence enabled');

// Initialize Firebase App Check (protection against abuse)
if (typeof firebase !== 'undefined' && firebase.appCheck) {
  try {
    const appCheck = firebase.appCheck();
    // TODO: Replace with your reCAPTCHA v3 site key
    // Get from: https://console.cloud.google.com/security/recaptcha
    appCheck.activate(
      new firebase.appCheck.ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
      true // Auto-refresh tokens
    );
    console.log('✅ Firebase App Check activated - protection enabled');
  } catch (error) {
    console.error('❌ Error initializing App Check:', error);
  }
} else {
  console.warn('⚠️ Firebase App Check SDK not available');
}

/**
 * Authentication functions
 */

// Sign in with email and password (for admin interface)
function signInWithEmail(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

// Sign in anonymously (for borrower self-service)
function signInAnonymously() {
  return auth.signInAnonymously();
}

// Sign out
function signOut() {
  return auth.signOut();
}

// Get current user
function getCurrentUser() {
  return auth.currentUser;
}

// Check if current user is admin
async function isCurrentUserAdmin() {
  const user = getCurrentUser();
  if (!user) return false;
  
  try {
    const adminDoc = await db.collection('admins').doc(user.uid).get();
    return adminDoc.exists;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Auth state change listener
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('✅ User authenticated:', user.uid, user.email || '(anonymous)');
    if (typeof window !== 'undefined') {
      window.currentUser = user;
    }
  } else {
    console.log('⚠️ User not authenticated');
    if (typeof window !== 'undefined') {
      window.currentUser = null;
    }
  }
});

// Export for use in other files
if (typeof window !== 'undefined') {
  window.db = db;
  window.auth = auth;
  window.storage = storage;
  window.signInWithEmail = signInWithEmail;
  window.signInAnonymously = signInAnonymously;
  window.signOut = signOut;
  window.getCurrentUser = getCurrentUser;
  window.isCurrentUserAdmin = isCurrentUserAdmin;
}

console.log('✅ Firebase configuration loaded');
