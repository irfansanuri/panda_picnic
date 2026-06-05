// ─────────────────────────────────────────────────────────
//  Auth Composable — Domain-restricted Google Login
//  Session persists via Firebase + localStorage backup
// ─────────────────────────────────────────────────────────

import { GoogleAuthProvider, onAuthStateChanged, setPersistence, browserLocalPersistence, signInWithPopup, signOut } from "firebase/auth";
import { ref } from "vue";
import { auth } from "src/firebase.js";

const ALLOWED_DOMAIN = "pandasoftware.my";

export const currentUser = ref(null);
export const isAuthenticated = ref(false);
export const authLoading = ref(true);

// Enable session persistence (survives page refresh)
if (auth) {
  setPersistence(auth, browserLocalPersistence).catch(e => {
    console.warn("🐼 Failed to enable session persistence:", e.message);
  });
}

async function loginWithGoogle() {
  if (!auth) {
    console.error("🐼 Firebase Auth not configured");
    return false;
  }

  try {
    const provider = new GoogleAuthProvider();
    // Force account selection/login every time
    provider.setCustomParameters({ 
      prompt: "select_account"
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
    console.error("🐼 Login error:", e.message);
    isAuthenticated.value = false;
    currentUser.value = null;
    throw e;  // Re-throw so UI can show the error
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

  onAuthStateChanged(auth, async (user) => {
    try {
      if (user) {
        const domain = user.email?.split("@")[1];
        if (domain === ALLOWED_DOMAIN) {
          // Force token refresh to ensure it's valid
          const token = await user.getIdToken(true);
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
