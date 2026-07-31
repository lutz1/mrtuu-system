// src/lib/firebase.js
//
// Central Firebase initialization — the app, auth, and storage instances
// created here are imported wherever Firebase is needed (AuthContext,
// Login/Signup pages, ProfilePictureUpload, etc.) so we only ever
// initialize the SDK once.
//
// Setup:
// 1. npm install firebase
// 2. Create a Firebase project at https://console.firebase.google.com
// 3. In Project Settings > General, register a Web App and copy the config
//    values below (or better, put them in a .env file — see note below).
// 4. In Authentication > Sign-in method, enable "Email/Password" and "Google".
// 5. In Storage, click "Get started" to provision the default bucket
//    (needed for profile picture uploads).

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
}); // If you plan to use Firestore

export default app;
