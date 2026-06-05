// ─────────────────────────────────────────────────────────
//  Auth Composable — Domain-restricted Google Login
// ─────────────────────────────────────────────────────────

import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { ref } from "vue";
import { auth } from "src/firebase.js";

const ALLOWED_DOMAIN = "pandasoftware.my";

export const currentUser = ref(null);
export const isAuthenticated = ref(false);
export const authLoading = ref(true);

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
    
    currentUser.value = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName || "Anonymous",
      photoURL: result.user.photoURL,
    };
    isAuthenticated.value = true;
    console.log(`🐼 Login successful: ${currentUser.value.displayName} (${currentUser.value.email})`);
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

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const domain = user.email?.split("@")[1];
      if (domain === ALLOWED_DOMAIN) {
        currentUser.value = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL,
        };
        isAuthenticated.value = true;
      } else {
        console.warn(`🐼 User ${user.email} not in allowed domain, signing out`);
        signOut(auth);
        currentUser.value = null;
        isAuthenticated.value = false;
      }
    } else {
      currentUser.value = null;
      isAuthenticated.value = false;
    }
    authLoading.value = false;
  });
}

export { loginWithGoogle, logout };
