// ─────────────────────────────────────────────────────────
//  PocketBase client — PANDA BERPICNIC 2026
//
//  PocketBase must be running first:
//    .\pocketbase.exe serve --http="0.0.0.0:8090"
//
//  Quasar Frontend: http://192.168.14.129:9000
//  PocketBase Backend: http://192.168.14.129:8090
// ─────────────────────────────────────────────────────────

import PocketBase from "pocketbase";

// PocketBase SDK appends /api internally, so use the app origin as the base URL.
// Quasar devServer proxy forwards /api/* to PocketBase on port 8090.
export const POCKETBASE_URL =
	typeof window !== "undefined" ? window.location.origin : "http://localhost:9000";

// Superuser credentials (used once for auto-setup of the collection)
export const PB_SUPERUSER_EMAIL = "admin@panda.com";
export const PB_SUPERUSER_PASS = "panda2026";

export const pb = new PocketBase(POCKETBASE_URL);
pb.autoCancellation(false);
