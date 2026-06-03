<template>
    <router-view />
</template>

<script setup>
import { cleanupSubscription } from 'src/composables/useStore.js';
import { onBeforeUnmount } from 'vue';

onBeforeUnmount(async () => {
    await cleanupSubscription()
})
</script>
