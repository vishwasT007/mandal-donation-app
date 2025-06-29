import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqCOlshwEtLLxi5ZZKp2BuG0UK_f3dBfs",
  authDomain: "mandal-app-87305.firebaseapp.com",
  projectId: "mandal-app-87305",
  storageBucket: "mandal-app-87305.firebasestorage.app",
  messagingSenderId: "429069952935",
  appId: "1:429069952935:web:531a52876ea4fcea72b882",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
