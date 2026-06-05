// ─────────────────────────────────────────────────────────
//  Firebase Config — PANDA BERPICNIC 2026
// ─────────────────────────────────────────────────────────
//
//  SETUP STEPS (5 minutes):
//  1. Go to https://console.firebase.google.com
//  2. Create a project (e.g. "panda-berpicnic")
//  3. Click "Firestore Database" → Create database → Start in TEST mode
//  4. Go to Project Settings (gear icon) → Your apps → Add web app
//  5. Copy the firebaseConfig object and paste the values below
//
// ─────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

// Only initialize when required values are present.
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const firebaseApp = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;
