// ─────────────────────────────────────────────────────────
//  PANDA BERPICNIC 2026 — Shared Store
//  • All data lives in Firestore (collection: app_state, doc: picnic_state)
//  • Each CRUD op writes to Firestore directly
//  • Real-time subscription syncs changes from other devices
// ─────────────────────────────────────────────────────────

import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "src/firebase.js";
import { lookupGameMeta } from "src/data/gameDictionary.js";
import { ref } from "vue";

const COLLECTION = import.meta.env.VITE_FIRESTORE_COLLECTION;
const DOC_ID = import.meta.env.VITE_FIRESTORE_DOC_ID;

function emptyState() {
  return {
    vvip: [],
    tetamu: [],
    categories: [],
    games: [],
  };
}

function toPlain(v) {
  return JSON.parse(JSON.stringify(v));
}

function isGamesCategory(cat) {
  return cat?.id === "games" || /permainan/i.test(cat?.label || "");
}

function stripEmoji(text = "") {
  return String(text)
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function normalizeGameItem(item = {}) {
  const cleanName = stripEmoji(item.name);
  const meta = lookupGameMeta(cleanName);
  return {
    ...item,
    name: cleanName,
    emoji: meta.emoji,
    description: meta.description,
    type: meta.type,
    typeLabel: meta.typeLabel,
    metaSource: "dict",
  };
}

function hasSameGameMeta(a = {}, b = {}) {
  return (
    a.name === b.name &&
    a.emoji === b.emoji &&
    a.description === b.description &&
    a.type === b.type &&
    a.typeLabel === b.typeLabel &&
    a.metaSource === b.metaSource
  );
}

function hasMetadata(item = {}) {
  return !!(item.emoji && item.description && item.type && item.typeLabel);
}

function normalizeCategories(list = []) {
  let changed = false;

  const normalized = list.map((cat) => {
    if (!isGamesCategory(cat)) return cat;

    const items = (cat.items || []).map((item) => {
      if (hasMetadata(item)) return item;

      const next = normalizeGameItem(item);
      if (!hasSameGameMeta(item, next)) changed = true;
      return next;
    });

    return { ...cat, items };
  });

  return { normalized, changed };
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
  if (cat) {
    const newItem = { id: Date.now(), name: "", person: null, editing: true };
    cat.items.push(newItem);
  }
}
export function deleteItem(catId, itemId) {
  const cat = categories.value.find((c) => c.id === catId);
  if (cat) {
    cat.items = cat.items.filter((i) => i.id !== itemId);
    push({ categories: toPlain(categories.value) });
  }
}
export async function saveItem(item) {
  item.editing = false;

  const parentCat = categories.value.find((cat) =>
    (cat.items || []).some((entry) => entry.id === item.id),
  );
  if (isGamesCategory(parentCat)) {
    Object.assign(item, normalizeGameItem(item));
  }

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
    console.warn(
      "🐼 Firebase is not configured. Add VITE_FIREBASE_* variables.",
    );
    const state = emptyState();
    vvip.value = state.vvip;
    tetamu.value = state.tetamu;
    categories.value = state.categories;
    games.value = state.games;
    return;
  }

  if (!COLLECTION || !DOC_ID) {
    console.warn(
      "🐼 Firestore path is not configured. Add VITE_FIRESTORE_COLLECTION and VITE_FIRESTORE_DOC_ID.",
    );
    const state = emptyState();
    vvip.value = state.vvip;
    tetamu.value = state.tetamu;
    categories.value = state.categories;
    games.value = state.games;
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
        console.warn('🐼 Firestore doc not found. Not auto-creating to avoid data loss. Run initDoc() to seed fresh data intentionally.');
        return;
      }

      const data = snapshot.data();
      if (Array.isArray(data.vvip)) vvip.value = data.vvip;
      if (Array.isArray(data.tetamu)) tetamu.value = data.tetamu;
      if (Array.isArray(data.categories)) {
        const { normalized, changed } = normalizeCategories(data.categories);
        categories.value = normalized;
        if (changed) {
          await updateDoc(stateRef, { categories: toPlain(normalized) });
        }
      }
      if (Array.isArray(data.games)) games.value = data.games;
    },
    (e) => {
      console.warn("🐼 Firestore unavailable:", e.message);
    },
  );

  console.log("🐼 Firestore sync live!");
}

// ── Explicit first-time seed (call intentionally, never auto) ──
export async function initDoc() {
  if (!stateRef) return;
  const { getDoc } = await import('firebase/firestore');
  const snap = await getDoc(stateRef);
  if (snap.exists()) {
    console.warn('🐼 initDoc(): doc already exists, skipping seed to avoid data loss.');
    return;
  }
  await setDoc(stateRef, emptyState());
  console.log('🐼 initDoc(): fresh empty doc created.');
}

// ── Cleanup subscription (call from App.vue onBeforeUnmount) ──
export async function cleanupSubscription() {
  if (unsubscriber) {
    unsubscriber();
    unsubscriber = null;
  }
}

initFirestore();
