// ─────────────────────────────────────────────────────────
//  PANDA BERPICNIC 2026 — Shared Store
//  • All data lives in PocketBase (collection: picnic_state)
//  • Each CRUD op writes to PocketBase directly
//  • Real-time subscription syncs changes from other devices
// ─────────────────────────────────────────────────────────

import { pb } from "src/pocketbase.js";
import { ref } from "vue";

const COLLECTION = "picnic_state";

// ── Helpers ────────────────────────────────────────────
function toPlain(v) {
  return JSON.parse(JSON.stringify(v));
}

// ── State (empty until PocketBase loads) ──────────────
export const vvip = ref([]);
export const tetamu = ref([]);
export const categories = ref([]);
export const games = ref([]);

let recordId = null;
let unsubscriber = null;

// ── Push partial update to PocketBase ─────────────────
async function push(fields) {
  if (!recordId) return;
  try {
    await pb.collection(COLLECTION).update(recordId, fields);
  } catch (e) {
    console.error("PocketBase write error:", e.message);
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

// ── Init: fetch from PocketBase + subscribe ───────────
async function initPB() {
  try {
    const list = await pb.collection(COLLECTION).getList(1, 1);
    if (!list.items.length) {
      console.warn("🐼 No data in PocketBase — run seed.mjs first");
      return;
    }
    const rec = list.items[0];
    recordId = rec.id;

    if (rec.vvip?.length) vvip.value = rec.vvip;
    if (rec.tetamu?.length) tetamu.value = rec.tetamu;
    if (rec.categories?.length) categories.value = rec.categories;
    if (rec.games?.length) games.value = rec.games;

    // Real-time updates from other devices
    // Unsubscribe previous subscription if it exists
    if (unsubscriber) {
      await unsubscriber();
    }

    unsubscriber = await pb.collection(COLLECTION).subscribe(recordId, (e) => {
      if (e.action !== "update") return;
      const d = e.record;
      if (d.vvip) vvip.value = d.vvip;
      if (d.tetamu) tetamu.value = d.tetamu;
      if (d.categories) categories.value = d.categories;
      if (d.games) games.value = d.games;
    });

    console.log("🐼 PocketBase sync live! Record:", recordId);
  } catch (e) {
    console.warn("🐼 PocketBase unavailable:", e.message);
  }
}

// ── Cleanup subscription (call from App.vue onBeforeUnmount) ──
export async function cleanupSubscription() {
  if (unsubscriber) {
    await unsubscriber();
    unsubscriber = null;
  }
}

initPB();
