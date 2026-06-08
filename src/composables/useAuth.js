// ─────────────────────────────────────────────────────────
//  Auth Composable — Domain-restricted Google Login
//  Session persists via Firebase + localStorage backup
// ─────────────────────────────────────────────────────────

import { GoogleAuthProvider, onIdTokenChanged, setPersistence, browserLocalPersistence, signInWithPopup, signOut } from "firebase/auth";
import { ref } from "vue";
import { auth, isFirebaseConfigured } from "src/firebase.js";

const ALLOWED_DOMAIN = "pandasoftware.my";

export const currentUser = ref(null);
export const isAuthenticated = ref(false);
export const authLoading = ref(true);

// Enable session persistence (survives page refresh)
const persistenceReady = auth
  ? setPersistence(auth, browserLocalPersistence).catch((e) => {
      console.warn("🐼 Failed to enable session persistence:", e.message);
    })
  : Promise.resolve();

function mapAuthError(error) {
  const code = error?.code || "";

  if (code === "auth/configuration-not-found") {
    return "Firebase Authentication is not configured for this project. In Firebase Console, open Authentication > Sign-in method, enable Google provider, and verify the project uses the same Web App config as this app.";
  }
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized in Firebase Auth. Add your host (for local dev: localhost) in Authentication > Settings > Authorized domains.";
  }
  if (code === "auth/popup-blocked") {
    return "Popup was blocked by your browser. Please allow popups for this site and try again.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "Login popup was closed before sign-in completed. Please try again.";
  }

  return error?.message || "Login failed. Please try again.";
}

async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase is not fully configured. Please set VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID in your .env file.");
  }

  try {
    await persistenceReady;

    const provider = new GoogleAuthProvider();
    // Force account selection/login every time
    provider.setCustomParameters({ 
      prompt: "select_account",
      hd: ALLOWED_DOMAIN,
    });
    const result = await signInWithPopup(auth, provider);
    
    const email = result.user.email || "";
    const domain = email.split("@")[1];
    
    console.log(`🐼 Login attempt with: ${email}`);
    
    if (domain !== ALLOWED_DOMAIN) {
      console.warn(`🐼 Login blocked: ${email} not in @${ALLOWED_DOMAIN} domain`);
      await signOut(auth);
      throw new Error(`Only @${ALLOWED_DOMAIN} emails allowed. You tried: ${email}`);
    }
    
    // Get fresh token (Firebase auto-refreshes this regularly)
    const token = await result.user.getIdToken(true);
    
    currentUser.value = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName || "Anonymous",
      photoURL: result.user.photoURL,
      token: token,
    };
    isAuthenticated.value = true;
    console.log(`🐼 Login successful: ${currentUser.value.displayName} (${currentUser.value.email})`);
    console.log(`🐼 Session persists — close and reopen, you'll stay logged in. Token auto-refreshes.`);
    return true;
  } catch (e) {
    const friendlyMessage = mapAuthError(e);
    console.error("🐼 Login error:", e?.code || e?.message || e);
    isAuthenticated.value = false;
    currentUser.value = null;
    throw new Error(friendlyMessage);
  }
}

async function logout() {
  try {
    await signOut(auth);
    currentUser.value = null;
    isAuthenticated.value = false;
    console.log("🐼 Logged out");
  } catch (e) {
    console.error("🐼 Logout error:", e.message);
  }
}

// Initialize auth state on load
export function initAuth() {
  if (!auth) {
    authLoading.value = false;
    return;
  }

  onIdTokenChanged(auth, async (user) => {
    try {
      if (user) {
        const domain = user.email?.split("@")[1];
        if (domain === ALLOWED_DOMAIN) {
          // onIdTokenChanged runs on sign-in, token refresh, and sign-out.
          const token = await user.getIdToken();
          console.log(`🐼 Session restored: ${user.displayName} (${user.email})`);
          
          currentUser.value = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "Anonymous",
            photoURL: user.photoURL,
            token: token,
          };
          isAuthenticated.value = true;
        } else {
          console.warn(`🐼 Session rejected: ${user.email} not in @${ALLOWED_DOMAIN} domain`);
          await signOut(auth);
          currentUser.value = null;
          isAuthenticated.value = false;
        }
      } else {
        currentUser.value = null;
        isAuthenticated.value = false;
      }
    } catch (e) {
      console.error("🐼 Auth state error:", e.message);
      currentUser.value = null;
      isAuthenticated.value = false;
    } finally {
      authLoading.value = false;
    }
  });
}

export { loginWithGoogle, logout };
