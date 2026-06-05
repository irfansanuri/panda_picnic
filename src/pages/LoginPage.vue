<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <span class="login-emoji">🐼</span>
        <h1>PANDA BERPICNIC 2026</h1>
        <p>Sign in with your @pandasoftware.my email</p>
      </div>

      <button v-if="!authLoading" class="login-btn" @click="handleLogin" :disabled="isLoggingIn">
        <span v-if="!isLoggingIn">🔐 Sign in with Google</span>
        <span v-else>Signing in...</span>
      </button>

      <div v-if="authLoading" class="login-loading">Loading...</div>

      <div v-if="loginError" class="login-error">
        ❌ {{ loginError }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { loginWithGoogle, authLoading } from 'src/composables/useAuth.js';
import { ref } from 'vue';

const isLoggingIn = ref(false);
const loginError = ref('');

async function handleLogin() {
  isLoggingIn.value = true;
  loginError.value = '';
  const success = await loginWithGoogle();
  if (!success) {
    loginError.value = 'Login failed. Make sure you use @pandasoftware.my email.';
  }
  isLoggingIn.value = false;
}
</script>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: white;
  border-radius: 12px;
  padding: 48px 32px;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-header {
  margin-bottom: 32px;
}

.login-emoji {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
}

h1 {
  font-family: var(--font-display, 'Poppins', sans-serif);
  font-size: 24px;
  color: #333;
  margin: 0 0 8px;
  letter-spacing: 1px;
}

p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-btn {
  width: 100%;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.login-loading {
  color: #666;
  font-size: 14px;
  padding: 12px;
}

.login-error {
  color: #d32f2f;
  font-size: 14px;
  padding: 12px;
  background: #ffebee;
  border-radius: 6px;
  margin-top: 16px;
}
</style>
