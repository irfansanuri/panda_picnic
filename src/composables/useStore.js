// ─────────────────────────────────────────────────────────
//  PANDA BERPICNIC 2026 — Shared Store
//  • All data lives in Firestore (collection: app_state, doc: picnic_state)
//  • Each CRUD op writes to Firestore directly
//  • Real-time subscription syncs changes from other devices
// ─────────────────────────────────────────────────────────

import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "src/firebase.js";
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

async function generateGameMeta(name = "") {
  const cleanName = stripEmoji(name);
  if (!cleanName) {
    return {
      name: "",
      emoji: "",
      description: "",
      type: "",
      typeLabel: "",
      metaSource: "ai",
    };
  }

  const response = await fetch("/api/generate-game-meta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: cleanName }),
  });

  if (!response.ok) {
    throw new Error(`AI metadata request failed (${response.status})`);
  }

  const data = await response.json();
  return {
    name: cleanName,
    emoji: String(data.emoji || "").trim(),
    description: String(data.description || "").trim(),
    type: String(data.type || "").trim(),
    typeLabel: String(data.typeLabel || "").trim(),
    metaSource: "ai",
  };
}

async function normalizeGameItem(item = {}) {
  const generated = await generateGameMeta(item.name);
  return {
    ...item,
    name: generated.name,
    emoji: generated.emoji,
    description: generated.description,
    type: generated.type,
    typeLabel: generated.typeLabel,
    metaSource: generated.metaSource,
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

function hasAiMetadata(item = {}) {
  return !!(
    item.metaSource === "ai" &&
    item.emoji &&
    item.description &&
    item.type &&
    item.typeLabel
  );
}

async function normalizeCategories(list = []) {
  let changed = false;

  const normalized = await Promise.all(
    list.map(async (cat) => {
      if (!isGamesCategory(cat)) return cat;

      const items = await Promise.all(
        (cat.items || []).map(async (item) => {
          if (hasAiMetadata(item)) {
            return item;
          }

          const next = await normalizeGameItem(item);
          if (!hasSameGameMeta(item, next)) changed = true;
          return next;
        }),
      );

      return {
        ...cat,
        items,
      };
    }),
  );

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
    try {
      Object.assign(item, await normalizeGameItem(item));
    } catch (e) {
      console.warn("Failed to generate AI metadata for game item:", e.message);
      return;
    }
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
        await setDoc(stateRef, emptyState());
        return;
      }

      const data = snapshot.data();
      if (Array.isArray(data.vvip)) vvip.value = data.vvip;
      if (Array.isArray(data.tetamu)) tetamu.value = data.tetamu;
      if (Array.isArray(data.categories)) {
        try {
          const { normalized, changed } = await normalizeCategories(
            data.categories,
          );
          categories.value = normalized;

          if (changed) {
            await updateDoc(stateRef, { categories: toPlain(normalized) });
          }
        } catch (err) {
          console.warn("Failed to backfill AI game metadata:", err.message);
          categories.value = data.categories;
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

// ── Cleanup subscription (call from App.vue onBeforeUnmount) ──
export async function cleanupSubscription() {
  if (unsubscriber) {
    unsubscriber();
    unsubscriber = null;
  }
}

initFirestore();
