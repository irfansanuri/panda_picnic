<template>
    <q-page>
        <div class="page-wrapper" ref="pageWrapperRef">
            <NavBar />
            <HeroSection id="hero" />
            <CountdownSection id="countdown" />
            <EventDetailsSection id="details" />
            <AttendeesSection id="attendees" />
            <BringListSection id="bringlist" />
            <GamesSection id="games" />
            <TimelineSection id="timeline" />
            <MoodSection id="mood" />
            <FooterSection id="footer" />
        </div>
    </q-page>
</template>

<script setup>
import AttendeesSection from 'components/AttendeesSection.vue'
import BringListSection from 'components/BringListSection.vue'
import CountdownSection from 'components/CountdownSection.vue'
import EventDetailsSection from 'components/EventDetailsSection.vue'
import FooterSection from 'components/FooterSection.vue'
import GamesSection from 'components/GamesSection.vue'
import HeroSection from 'components/HeroSection.vue'
import MoodSection from 'components/MoodSection.vue'
import NavBar from 'components/NavBar.vue'
import TimelineSection from 'components/TimelineSection.vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const pageWrapperRef = ref(null)
let refreshTimer = null
let refreshObserver = null

function scheduleRefresh(delay = 140) {
    if (refreshTimer) clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(true), delay)
}

function onViewportChange() {
    scheduleRefresh(120)
}

onMounted(async () => {
    await nextTick()
    scheduleRefresh(0)

    window.addEventListener('resize', onViewportChange)
    window.addEventListener('orientationchange', onViewportChange)
    window.addEventListener('load', onViewportChange, { once: true })

    if (document.fonts?.ready) {
        document.fonts.ready.then(() => scheduleRefresh(0))
    }

    if ('ResizeObserver' in window && pageWrapperRef.value) {
        refreshObserver = new ResizeObserver(() => scheduleRefresh(180))
        refreshObserver.observe(pageWrapperRef.value)
    }

    // Firestore-driven content and image loads can shift section heights after mount.
    scheduleRefresh(650)
    scheduleRefresh(1400)
})

onBeforeUnmount(() => {
    if (refreshTimer) {
        clearTimeout(refreshTimer)
        refreshTimer = null
    }
    refreshObserver?.disconnect()
    refreshObserver = null
    window.removeEventListener('resize', onViewportChange)
    window.removeEventListener('orientationchange', onViewportChange)
    window.removeEventListener('load', onViewportChange)
})
</script>
