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
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Only initialize when config is filled in
const isConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

export const db = isConfigured
  ? getFirestore(initializeApp(firebaseConfig))
  : null;
