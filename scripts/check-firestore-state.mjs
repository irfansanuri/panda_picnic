import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);
const collection = process.env.VITE_FIRESTORE_COLLECTION || "app_state";
const docId = process.env.VITE_FIRESTORE_DOC_ID || "picnic_state";
const ref = doc(db, collection, docId);
const snap = await getDoc(ref);

if (!snap.exists()) {
  console.log("DOC_MISSING", { collection, docId });
} else {
  const d = snap.data();
  console.log("DOC_EXISTS", {
    collection,
    docId,
    vvip: Array.isArray(d.vvip) ? d.vvip.length : null,
    tetamu: Array.isArray(d.tetamu) ? d.tetamu.length : null,
    categories: Array.isArray(d.categories) ? d.categories.length : null,
    games: Array.isArray(d.games) ? d.games.length : null,
  });
}
