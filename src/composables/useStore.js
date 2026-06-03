// ─────────────────────────────────────────────────────────
//  PANDA BERPICNIC 2026 — Shared Store
//  • All data lives in Firestore (collection: app_state, doc: picnic_state)
//  • Each CRUD op writes to Firestore directly
//  • Real-time subscription syncs changes from other devices
// ─────────────────────────────────────────────────────────

import { ref } from "vue";
import {
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "src/firebase.js";

const COLLECTION = "app_state";
const DOC_ID = "picnic_state";

const initialState = {
  vvip: [
    { id: 1, name: "Fathur", emoji: "🐼", title: "Ketua Panda", crown: true },
    {
      id: 2,
      name: "Dato' Haikal",
      emoji: "🎖️",
      title: "YB Taman Picnic",
      crown: false,
    },
  ],
  tetamu: [
    { id: 1, name: "Luqman", emoji: "🧑" },
    { id: 2, name: "Aisyah", emoji: "👩" },
  ],
  categories: [
    {
      id: "basic",
      label: "Keperluan Asas",
      icon: "🏕️",
      items: [
        { id: 1, name: "Tempat BBQ", person: "Luqman" },
        { id: 2, name: "Arang", person: "Luqman" },
        { id: 3, name: "Penyepit", person: "Luqman" },
        { id: 4, name: "Kipas Sate", person: "Luqman" },
        { id: 5, name: "Tikar", person: "Dato' Haikal" },
        { id: 6, name: "Pinggan", person: null },
        { id: 7, name: "Cawan", person: null },
        { id: 8, name: "Plastik Sampah", person: "Fathur" },
        { id: 9, name: "Bekas Aluminium Foil", person: null },
        { id: 10, name: "Bekas Air", person: "Fathur" },
        { id: 11, name: "Kerusi healing", person: null },
      ],
    },
    {
      id: "food",
      label: "Makanan",
      icon: "🍖",
      items: [
        { id: 101, name: "Ayam Perap", person: "Aisyah" },
        { id: 102, name: "Sosej", person: null },
        { id: 103, name: "Sayur (Salad)", person: null },
        { id: 104, name: "Buah (Tembikai) 🍉", person: "Dato' Haikal" },
        { id: 105, name: "Dessert", person: null },
        { id: 106, name: "Minuman", person: "Fathur" },
        { id: 107, name: "Sos Cili", person: null },
        { id: 108, name: "Sos BBQ", person: null },
        { id: 109, name: "Jajan", person: null },
        { id: 110, name: "Ais", person: "Aisyah" },
        { id: 111, name: "Ikan Keli Pistachio 🐟", person: null },
        { id: 112, name: "Laksa Matcha 🍵", person: null },
        { id: 113, name: "Nasi Lemak Matcha 🍃", person: "Dato' Haikal" },
        { id: 114, name: "Ayam Gepuk Pistachio 🥜", person: null },
      ],
    },
    {
      id: "games",
      label: "Permainan",
      icon: "🎲",
      items: [
        { id: 201, name: "Uno (No Mercy) 🃏", person: null },
        { id: 202, name: "Saidina 🎰", person: null },
        { id: 203, name: "Monopoly 🏦", person: null },
        { id: 204, name: "Baling Selipar 👡", person: null },
        { id: 205, name: "Mancing + Mata Kail 🎣", person: null },
        { id: 206, name: "Hiking 🥾", person: null },
        { id: 207, name: "Chess ♟️", person: null },
      ],
    },
  ],
  games: [
    { id: 1, name: "Uno No Mercy" },
    { id: 2, name: "Monopoly" },
    { id: 3, name: "Saidina" },
    { id: 4, name: "Baling Selipar" },
    { id: 5, name: "Mancing" },
    { id: 6, name: "Hiking" },
    { id: 7, name: "Chess" },
    { id: 8, name: "Berenang" },
  ],
};

function toPlain(v) {
  return JSON.parse(JSON.stringify(v));
}

export const vvip = ref([]);
export const tetamu = ref([]);
export const categories = ref([]);
export const games = ref([]);

let unsubscriber = null;
let stateRef = null;

async function push(fields) {
  if (!stateRef) return;
  try {
    await updateDoc(stateRef, fields);
  } catch (e) {
    console.error("Firestore write error:", e.message);
  }
}

// ── VVIP CRUD ──────────────────────────────────────────
export function addVvip() {
  vvip.value.push({
    id: Date.now(),
    name: "",
    emoji: "🐼",
    title: "VIP",
    crown: false,
    editing: true,
  });
}
export function removeVvip(id) {
  vvip.value = vvip.value.filter((p) => p.id !== id);
  push({ vvip: toPlain(vvip.value) });
}
export function saveVvip() {
  push({ vvip: toPlain(vvip.value) });
}

// ── Tetamu CRUD ────────────────────────────────────────
export function addTetamu() {
  tetamu.value.push({ id: Date.now(), name: "", emoji: "😊", editing: true });
}
export function removeTetamu(id) {
  tetamu.value = tetamu.value.filter((p) => p.id !== id);
  push({ tetamu: toPlain(tetamu.value) });
}
export function saveTetamu() {
  push({ tetamu: toPlain(tetamu.value) });
}

// ── Bring List CRUD ────────────────────────────────────
export function addItem(catId) {
  const cat = categories.value.find((c) => c.id === catId);
  if (cat)
    cat.items.push({ id: Date.now(), name: "", person: null, editing: true });
}
export function deleteItem(catId, itemId) {
  const cat = categories.value.find((c) => c.id === catId);
  if (cat) {
    cat.items = cat.items.filter((i) => i.id !== itemId);
    push({ categories: toPlain(categories.value) });
  }
}
export function saveItem(item) {
  item.editing = false;
  push({ categories: toPlain(categories.value) });
}

// ── Games CRUD ─────────────────────────────────────────
export function addGame() {
  games.value.push({ id: Date.now(), name: "", editing: true });
}
export function removeGame(id) {
  games.value = games.value.filter((g) => g.id !== id);
  push({ games: toPlain(games.value) });
}
export function saveGame() {
  push({ games: toPlain(games.value) });
}

// ── allPeople ──────────────────────────────────────────
export function allPeople() {
  return [
    ...vvip.value.map((p) => p.name),
    ...tetamu.value.map((p) => p.name),
  ].filter(Boolean);
}

// ── Init: fetch from Firestore + subscribe ────────────
async function initFirestore() {
  if (!db || !isFirebaseConfigured) {
    console.warn("🐼 Firebase is not configured. Add VITE_FIREBASE_* variables.");
    vvip.value = initialState.vvip;
    tetamu.value = initialState.tetamu;
    categories.value = initialState.categories;
    games.value = initialState.games;
    return;
  }

  stateRef = doc(db, COLLECTION, DOC_ID);

  if (unsubscriber) {
    unsubscriber();
    unsubscriber = null;
  }

  unsubscriber = onSnapshot(
    stateRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        await setDoc(stateRef, initialState);
        return;
      }

      const data = snapshot.data();
      if (Array.isArray(data.vvip)) vvip.value = data.vvip;
      if (Array.isArray(data.tetamu)) tetamu.value = data.tetamu;
      if (Array.isArray(data.categories)) categories.value = data.categories;
      if (Array.isArray(data.games)) games.value = data.games;
    },
    (e) => {
      console.warn("🐼 Firestore unavailable:", e.message);
    },
  );

  console.log("🐼 Firestore sync live!");
}

// ── Cleanup subscription (call from App.vue onBeforeUnmount) ──
export async function cleanupSubscription() {
  if (unsubscriber) {
    unsubscriber();
    unsubscriber = null;
  }
}

initFirestore();
