// ─────────────────────────────────────────────────────────
//  PocketBase Seeder — PANDA BERPICNIC 2026
//  Run once:  node seed.mjs
// ─────────────────────────────────────────────────────────

import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

// ── Auth ───────────────────────────────────────────────
await pb
  .collection("_superusers")
  .authWithPassword("admin@panda.com", "panda2026");
console.log("✅ Authenticated as superuser");

// ── Create collection ──────────────────────────────────
try {
  await pb.collections.create({
    name: "picnic_state",
    type: "base",
    fields: [
      { name: "vvip", type: "json" },
      { name: "tetamu", type: "json" },
      { name: "categories", type: "json" },
      { name: "games", type: "json" },
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
  });
  console.log('✅ Collection "picnic_state" created with public rules');
} catch {
  console.log("ℹ️  Collection already exists — skipping creation");
}

// ── Initial data ───────────────────────────────────────
const vvip = [
  { id: 1, name: "Fathur", emoji: "🐼", title: "Ketua Panda", crown: true },
  {
    id: 2,
    name: "Dato' Haikal",
    emoji: "🎖️",
    title: "YB Taman Picnic",
    crown: false,
  },
];

const tetamu = [
  { id: 1, name: "Luqman", emoji: "🧑" },
  { id: 2, name: "Aisyah", emoji: "👩" },
];

const games = [
  { id: 1, name: "Uno No Mercy" },
  { id: 2, name: "Monopoly" },
  { id: 3, name: "Saidina" },
  { id: 4, name: "Baling Selipar" },
  { id: 5, name: "Mancing" },
  { id: 6, name: "Hiking" },
  { id: 7, name: "Chess" },
  { id: 8, name: "Berenang" },
];

const categories = [
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
];

// ── Upsert record ──────────────────────────────────────
const list = await pb.collection("picnic_state").getList(1, 1);

if (list.items.length === 0) {
  const rec = await pb
    .collection("picnic_state")
    .create({ vvip, tetamu, categories, games });
  console.log("✅ Data seeded into PocketBase! Record ID:", rec.id);
} else {
  const rec = await pb
    .collection("picnic_state")
    .update(list.items[0].id, { vvip, tetamu, categories, games });
  console.log("✅ Existing record updated! Record ID:", rec.id);
}

console.log("\n🐼 Done! PocketBase is ready.");
