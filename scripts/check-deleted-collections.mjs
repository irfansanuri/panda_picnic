import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { readFileSync } from "fs";

// Load .env
const env = Object.fromEntries(
  readFileSync(".env", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => l.split("=").map((s) => s.trim())),
);

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});

const db = getFirestore(app);

// Check all deleted collections
const deletedCollections = [
  "deletedVvip",
  "deletedTetamu",
  "deletedCategoryItems",
  "deletedGames",
];

for (const collName of deletedCollections) {
  try {
    const snap = await getDocs(collection(db, collName));
    console.log(`\n📋 ${collName}: ${snap.size} entries`);
    snap.docs.forEach((doc) => {
      console.log(
        `  - ${doc.data().name || doc.data().id || "?"} (deleted at ${doc.data().deletedAt})`,
      );
    });
  } catch (e) {
    console.log(`\n❌ ${collName}: does not exist or error: ${e.code}`);
  }
}

process.exit(0);
