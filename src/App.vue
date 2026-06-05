<template>
    <LoginPage v-if="!isAuthenticated && !showLoader" />
    <router-view v-else-if="isAuthenticated && !showLoader" />
    <div v-else class="auth-loading">
        <ThemedLoading :progress="loaderProgress" />
    </div>
</template>

<script setup>
import { cleanupSubscription } from 'src/composables/useStore.js';
import { initAuth, isAuthenticated, authLoading } from 'src/composables/useAuth.js';
import ThemedLoading from 'src/components/ThemedLoading.vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import LoginPage from 'src/pages/LoginPage.vue';

const loaderProgress = ref(8)
const completingLoader = ref(false)
let progressTimer = null

const showLoader = computed(() => authLoading.value || completingLoader.value)

function clearProgressTimer() {
    if (!progressTimer) return
    clearInterval(progressTimer)
    progressTimer = null
}

function startProgressTimer() {
    clearProgressTimer()

    progressTimer = setInterval(() => {
        if (authLoading.value) {
            const remaining = 92 - loaderProgress.value
            const step = Math.max(0.45, remaining * 0.07)
            loaderProgress.value = Math.min(92, loaderProgress.value + step)
            return
        }

        if (completingLoader.value) {
            loaderProgress.value = Math.min(100, loaderProgress.value + 3.5)
            if (loaderProgress.value >= 100) {
                completingLoader.value = false
                clearProgressTimer()
            }
        }
    }, 110)
}

watch(authLoading, (loadingNow) => {
    if (loadingNow) {
        loaderProgress.value = Math.max(8, Math.min(loaderProgress.value, 50))
        completingLoader.value = false
        startProgressTimer()
        return
    }

    completingLoader.value = true
    startProgressTimer()
}, { immediate: true })

onMounted(() => {
    initAuth();
});

onBeforeUnmount(async () => {
    clearProgressTimer()
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

