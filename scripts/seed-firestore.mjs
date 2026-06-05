// ─────────────────────────────────────────────────────────
//  PANDA BERPICNIC 2026 — Firestore Seed Script
//  Run: node scripts/seed-firestore.mjs
//  Loads .env, then writes full picnic_state to Firestore.
// ─────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { readFileSync } from "fs";

// Load .env manually
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
const COLLECTION = env.VITE_FIRESTORE_COLLECTION || "app_state";
const DOC_ID = env.VITE_FIRESTORE_DOC_ID || "picnic_state";

// ── Data from Google Doc ──────────────────────────────

const vvip = [
  {
    id: 1,
    name: "Fathur",
    emoji: "🐼",
    title: "VIP",
    crown: true,
    editing: false,
  },
  {
    id: 2,
    name: "Dato' Haikal",
    emoji: "🐼",
    title: "VIP",
    crown: false,
    editing: false,
  },
];

const tetamu = [
  { id: 3, name: "Luqman", emoji: "😊", editing: false },
  { id: 4, name: "Aisyah", emoji: "😊", editing: false },
];

const categories = [
  {
    id: "basic_needs",
    label: "Keperluan Asas",
    icon: "🏕️",
    items: [
      { id: 101, name: "Tempat BBQ", person: "Luqman", editing: false },
      { id: 102, name: "Arang", person: "Luqman", editing: false },
      { id: 103, name: "Penyepit", person: "Luqman", editing: false },
      { id: 104, name: "Kipas Sate", person: "Luqman", editing: false },
      { id: 105, name: "Tikar", person: "Dato' Haikal", editing: false },
      { id: 106, name: "Pinggan", person: null, editing: false },
      { id: 107, name: "Cawan", person: null, editing: false },
      { id: 108, name: "Plastik Sampah", person: "Fathur", editing: false },
      { id: 109, name: "Bekas Aluminium Foil", person: null, editing: false },
      { id: 110, name: "Bekas Air", person: "Fathur", editing: false },
      { id: 111, name: "Kerusi healing", person: null, editing: false },
      { id: 112, name: "Sun screen SPF 100", person: null, editing: false },
      { id: 113, name: "Khemah", person: null, editing: false },
      {
        id: 114,
        name: "Gopro + Insta 360 + Drone",
        person: "Luqman",
        editing: false,
      },
      { id: 115, name: "Net bola tampar", person: null, editing: false },
    ],
  },
  {
    id: "food",
    label: "Makanan",
    icon: "🍖",
    items: [
      { id: 201, name: "Ayam Perap", person: "Aisyah", editing: false },
      { id: 202, name: "Sosej", person: null, editing: false },
      { id: 203, name: "Sayur (Salad)", person: null, editing: false },
      {
        id: 204,
        name: "Buah (Tembikai)",
        person: "Dato' Haikal",
        editing: false,
      },
      { id: 205, name: "Dessert", person: null, editing: false },
      { id: 206, name: "Minuman", person: "Fathur", editing: false },
      { id: 207, name: "Sos Cili", person: null, editing: false },
      { id: 208, name: "Sos BBQ", person: null, editing: false },
      { id: 209, name: "Jajan", person: null, editing: false },
      { id: 210, name: "Ais", person: "Aisyah", editing: false },
      { id: 211, name: "Patty Burger", person: null, editing: false },
      { id: 212, name: "Kambing perap", person: null, editing: false },
      { id: 213, name: "Nasi Lemak", person: "Dato' Haikal", editing: false },
      {
        id: 214,
        name: "Minyak masak nak oles dekat ayam pakai serai",
        person: null,
        editing: false,
      },
    ],
  },
  {
    id: "games",
    label: "Permainan",
    icon: "🎮",
    items: [
      { id: 301, name: "Uno (No mercy)", person: null, editing: false },
      { id: 302, name: "Saidina", person: null, editing: false },
      { id: 303, name: "Monopoly", person: null, editing: false },
      { id: 304, name: "Baling Selipar", person: null, editing: false },
      { id: 305, name: "Mancing dan mata kail", person: null, editing: false },
      { id: 306, name: "Hiking", person: null, editing: false },
      { id: 307, name: "Chess", person: null, editing: false },
      { id: 308, name: "Mandi laut", person: null, editing: false },
      { id: 309, name: "Mandi Sungai", person: null, editing: false },
      { id: 310, name: "Sand toy set", person: null, editing: false },
      { id: 311, name: "Camping set", person: null, editing: false },
      { id: 312, name: "Karaoke set", person: null, editing: false },
      { id: 313, name: "Bola pantai", person: null, editing: false },
      { id: 314, name: "Bola tampar", person: null, editing: false },
      { id: 315, name: "Frisbee", person: null, editing: false },
      { id: 316, name: "Fun Run", person: null, editing: false },
      { id: 317, name: "Hilang", person: null, editing: false },
      { id: 318, name: "Lari dalam guni", person: null, editing: false },
      { id: 319, name: "Sukaneka", person: null, editing: false },
      { id: 320, name: "Tarik tali", person: null, editing: false },
      { id: 321, name: "Lumba lari 100m", person: null, editing: false },
      { id: 322, name: "Batu seremban", person: null, editing: false },
      { id: 323, name: "Congkak", person: null, editing: false },
      { id: 324, name: "Gasing", person: null, editing: false },
      { id: 325, name: "Layang-layang", person: null, editing: false },
      { id: 326, name: "Mewarna", person: null, editing: false },
      { id: 327, name: "Bubble", person: null, editing: false },
    ],
  },
];

const games = [];

// ── Write to Firestore ────────────────────────────────

const stateRef = doc(db, COLLECTION, DOC_ID);

await setDoc(stateRef, { vvip, tetamu, categories, games });

console.log("✅ Firestore repopulated successfully!");
console.log(`   vvip: ${vvip.length}`);
console.log(`   tetamu: ${tetamu.length}`);
categories.forEach((c) =>
  console.log(`   ${c.label}: ${c.items.length} items`),
);
process.exit(0);
