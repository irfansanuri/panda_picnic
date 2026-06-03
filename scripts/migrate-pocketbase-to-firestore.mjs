import PocketBase from "pocketbase";
import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const PB_URL = process.env.PB_URL || "http://127.0.0.1:8090";
const PB_SUPERUSER_EMAIL = process.env.PB_SUPERUSER_EMAIL || "admin@panda.com";
const PB_SUPERUSER_PASS = process.env.PB_SUPERUSER_PASS || "panda2026";
const PB_COLLECTION = process.env.PB_COLLECTION || "picnic_state";

const FIRESTORE_COLLECTION = process.env.FIRESTORE_COLLECTION || "app_state";
const FIRESTORE_DOC_ID = process.env.FIRESTORE_DOC_ID || "picnic_state";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

function assertRequired(name, value) {
  if (!value) {
    throw new Error("Missing required environment variable: " + name);
  }
}

assertRequired("VITE_FIREBASE_API_KEY", firebaseConfig.apiKey);
assertRequired("VITE_FIREBASE_PROJECT_ID", firebaseConfig.projectId);
assertRequired("VITE_FIREBASE_APP_ID", firebaseConfig.appId);

const pb = new PocketBase(PB_URL);

async function readPocketBaseRecord() {
  await pb
    .collection("_superusers")
    .authWithPassword(PB_SUPERUSER_EMAIL, PB_SUPERUSER_PASS);

  const list = await pb.collection(PB_COLLECTION).getList(1, 1, {
    sort: "-updated",
  });

  if (!list.items.length) {
    throw new Error("No record found in PocketBase collection: " + PB_COLLECTION);
  }

  const rec = list.items[0];
  return {
    vvip: Array.isArray(rec.vvip) ? rec.vvip : [],
    tetamu: Array.isArray(rec.tetamu) ? rec.tetamu : [],
    categories: Array.isArray(rec.categories) ? rec.categories : [],
    games: Array.isArray(rec.games) ? rec.games : [],
    migratedFrom: {
      source: "pocketbase",
      sourceCollection: PB_COLLECTION,
      sourceRecordId: rec.id,
      sourceUpdated: rec.updated,
      migratedAt: new Date().toISOString(),
    },
  };
}

async function writeFirestoreDoc(payload) {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const targetRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);

  await setDoc(targetRef, payload, { merge: true });
}

async function main() {
  console.log("Reading PocketBase record from", PB_URL);
  const payload = await readPocketBaseRecord();

  console.log(
    "Writing Firestore doc",
    FIRESTORE_COLLECTION + "/" + FIRESTORE_DOC_ID,
  );
  await writeFirestoreDoc(payload);

  console.log("Migration completed successfully.");
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
