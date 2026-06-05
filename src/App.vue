<template>
    <LoginPage v-if="!isAuthenticated && !authLoading" />
    <router-view v-else-if="isAuthenticated" />
    <div v-else-if="authLoading" class="auth-loading">
        <span>Loading...</span>
    </div>
</template>

<script setup>
import { cleanupSubscription } from 'src/composables/useStore.js';
import { initAuth, isAuthenticated, authLoading } from 'src/composables/useAuth.js';
import LoginPage from 'src/pages/LoginPage.vue';
import { onBeforeUnmount, onMounted } from 'vue';

onMounted(() => {
    initAuth();
});

onBeforeUnmount(async () => {
    await cleanupSubscription()
})
</script>

<style scoped>
.auth-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-size: 18px;
}
</style>

