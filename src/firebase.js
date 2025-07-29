import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration with fallbacks for production
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyBqCOlshwEtLLxi5ZZKp2BuG0UK_f3dBfs",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "mandal-app-87305.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mandal-app-87305",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "mandal-app-87305.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "429069952935",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:429069952935:web:531a52876ea4fcea72b882",
};

// Log configuration for debugging (only in development)
if (import.meta.env.DEV) {
  console.log("Firebase Config:", {
    apiKey: firebaseConfig.apiKey ? "***" : "MISSING",
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
