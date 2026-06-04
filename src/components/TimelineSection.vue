<template>
    <section class="timeline" ref="sectionRef">
        <div class="section-inner">
            <div class="text-center timeline__header" ref="headerRef">
                <span class="section-label">⏱️ Jadual</span>
                <h2 class="section-title">Timeline Hari Picnic 🌅</h2>
                <div class="wave-divider wave-divider-center"></div>
                <p class="section-subtitle">Dari pagi sampai petang, penuh dengan aktiviti!</p>
            </div>

            <!-- Horizontal scroll timeline -->
            <div class="timeline__track-wrap" ref="trackWrap">
                <!-- Sandy ground line -->
                <div class="timeline__baseline"></div>
                <!-- Animated fill line -->
                <div class="timeline__fill" ref="fillLine"></div>

                <!-- Events -->
                <div v-for="(event, i) in events" :key="i" class="timeline__event"
                    :class="{ 'timeline__event--above': i % 2 === 0, 'timeline__event--below': i % 2 !== 0 }"
                    :ref="el => (eventRefs[i] = el)" :style="{ left: `${(i / (events.length - 1)) * 100}%` }">
                    <!-- Connector dot -->
                    <div class="timeline__dot" :ref="el => (dotRefs[i] = el)">{{ event.icon }}</div>

                    <!-- Card -->
                    <div class="timeline__card wood-card">
                        <span class="timeline__card-time">{{ event.time }}</span>
                        <span class="timeline__card-name">{{ event.name }}</span>
                    </div>
                </div>
            </div>

            <div class="timeline__mobile-list" ref="mobileListRef">
                <div
                    v-for="(event, i) in events"
                    :key="`mobile-${i}`"
                    class="timeline__mobile-item"
                    :ref="el => (mobileItemRefs[i] = el)"
                >
                    <div class="timeline__mobile-dot">{{ event.icon }}</div>
                    <div class="timeline__mobile-card wood-card">
                        <span class="timeline__mobile-time">{{ event.time }}</span>
                        <span class="timeline__mobile-name">{{ event.name }}</span>
                    </div>
                </div>
            </div>

            <!-- Sun progress indicator -->
            <div class="timeline__sun" ref="sunEl">☀️</div>
        </div>
    </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const headerRef = ref(null)
const trackWrap = ref(null)
const fillLine = ref(null)
const sunEl = ref(null)
const eventRefs = reactive({})
const dotRefs = reactive({})
const mobileListRef = ref(null)
const mobileItemRefs = reactive({})
let timelineMatchMedia = null

const events = [
    { time: '7:30 Pagi', icon: '🌅', name: 'Bertolak dari KL' },
    { time: '8:00 Pagi', icon: '🚗', name: 'Tiba & Setup' },
    { time: '8:30 Pagi', icon: '🧺', name: 'Bentang Tarpaulin' },
    { time: '9:00 Pagi', icon: '🔥', name: 'Hidupkan BBQ' },
    { time: '10:00 Pagi', icon: '🏊', name: 'Main Air / Berenang' },
    { time: '12:00 Tgh', icon: '🍖', name: 'Makan Tengahari BBQ' },
    { time: '1:30 Ptg', icon: '🎮', name: 'Permainan & Aktiviti' },
    { time: '3:00 Ptg', icon: '🥥', name: 'Rehat & Air Kelapa' },
    { time: '4:00 Ptg', icon: '📸', name: 'Gambar Kenangan' },
    { time: '5:00 Ptg', icon: '🌇', name: 'Balik Dengan Senyum' },
]

onMounted(() => {
    const cards = Object.values(eventRefs)
    const dots = Object.values(dotRefs)
    const total = events.length

    timelineMatchMedia = gsap.matchMedia()

    timelineMatchMedia.add('(min-width: 901px)', () => {
        gsap.set(headerRef.value, { opacity: 0, y: 60 })
        gsap.set(cards, { opacity: 0, scale: 0.4 })
        gsap.set(dots, { scale: 0 })
        gsap.set(fillLine.value, { scaleX: 0, transformOrigin: 'left center' })
        gsap.set(sunEl.value, { opacity: 0, left: '0%' })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.value,
                pin: true,
                scrub: 0.9,
                start: 'top top', end: '+=1700',
                anticipatePin: 1,
                fastScrollEnd: true,
                invalidateOnRefresh: true,
            }
        })

        tl.to(headerRef.value, { opacity: 1, y: 0, duration: 0.08 })
        tl.to(fillLine.value, { scaleX: 1, duration: 0.5, ease: 'none' }, 0.1)
        tl.to(sunEl.value, { opacity: 1, left: '95%', duration: 0.5, ease: 'none' }, 0.1)

        for (let i = 0; i < total; i++) {
            const pct = 0.1 + (i / (total - 1)) * 0.45
            tl.to(dots[i], { scale: 1.2, duration: 0.04, ease: 'back.out(3)' }, pct)
            tl.to(dots[i], { scale: 1, duration: 0.03 })
            tl.to(cards[i], { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(2)' }, pct + 0.02)
        }

        tl.to({}, { duration: 0.18 })
        tl
            .to(cards, { opacity: 0, y: 60, stagger: 0.02, duration: 0.2 }, 0.82)
            .to(fillLine.value, { opacity: 0, duration: 0.15 }, 0.84)
            .to(sunEl.value, { opacity: 0, y: -50, duration: 0.15 }, 0.84)
            .to(headerRef.value, { opacity: 0, y: -60, duration: 0.15 }, 0.84)
    })

    timelineMatchMedia.add('(max-width: 900px)', () => {
        gsap.set([headerRef.value, fillLine.value, sunEl.value], { clearProps: 'all' })
        gsap.set(cards, { clearProps: 'all' })
        gsap.set(dots, { clearProps: 'all' })
        const mobileItems = Object.values(mobileItemRefs)

        gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.value,
                start: 'top 88%',
                once: true,
            }
        })
            .from(headerRef.value, { opacity: 0, y: 30, duration: 0.35 })
            .from(mobileItems, { opacity: 0, y: 24, stagger: 0.06, duration: 0.28, ease: 'power2.out' }, 0.08)
    })
})

onBeforeUnmount(() => {
    timelineMatchMedia?.revert()
    ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.timeline {
    background: linear-gradient(180deg, var(--sky-pale) 0%, var(--sand-light) 60%, #E8CFA0 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;

    @media (max-width: 900px) {
        min-height: auto;
        justify-content: flex-start;
        overflow: visible;
        padding: 72px 0;
    }
}

.timeline__header {
    margin-bottom: 60px;
    opacity: 0;

    @media (max-width: 900px) {
        margin-bottom: 28px;
        opacity: 1;
    }
}

.timeline__track-wrap {
    position: relative;
    height: 280px;
    margin: 0 auto;
    width: 100%;
    max-width: 1100px;

    @media (max-width: 900px) {
        display: none;
    }
}

.timeline__mobile-list {
    display: none;

    @media (max-width: 900px) {
        display: grid;
        gap: 14px;
        position: relative;
        padding-left: 22px;
        max-width: 460px;
        margin: 0 auto;

        &::before {
            content: '';
            position: absolute;
            top: 4px;
            bottom: 4px;
            left: 18px;
            width: 4px;
            border-radius: 999px;
            background: linear-gradient(180deg, var(--sky), var(--ocean), var(--rust));
            opacity: 0.55;
        }
    }
}

// Ground line
.timeline__baseline {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--sand), var(--wood-sign), var(--sand));
    border-radius: 4px;
    opacity: 0.4;
}

.timeline__fill {
    position: absolute;
    top: 50%;
    transform: translateY(-50%) scaleX(0);
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, var(--sky), var(--ocean), var(--rust));
    border-radius: 4px;
    box-shadow: 0 0 16px rgba(91, 191, 232, 0.5);
    transform-origin: left center;

    @media (max-width: 900px) {
        display: none;
    }
}

.timeline__sun {
    position: absolute;
    top: calc(50% - 30px);
    left: 0%;
    font-size: 1.8rem;
    z-index: 10;
    opacity: 0;
    filter: drop-shadow(0 0 8px rgba(245, 197, 24, 0.6));
    animation: sunPulse 2s ease-in-out infinite;
    pointer-events: none;

    @media (max-width: 900px) {
        display: none;
    }
}

// Events
.timeline__event {
    position: absolute;
    top: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    &--above {
        flex-direction: column-reverse;

        .timeline__card {
            margin-bottom: 12px;
        }
    }

    &--below {
        flex-direction: column;

        .timeline__card {
            margin-top: 12px;
        }
    }
}

.timeline__dot {
    width: 38px;
    height: 38px;
    background: white;
    border: 3px solid var(--sky);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: var(--shadow-sm);
    z-index: 5;
    flex-shrink: 0;
    will-change: transform;
}

.timeline__card {
    padding: 10px 14px;
    text-align: center;
    min-width: 90px;
    max-width: 130px;
    opacity: 0;
    will-change: transform, opacity;
}

.timeline__card-time {
    display: block;
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 4px;
}

.timeline__card-name {
    display: block;
    font-family: var(--font-display);
    font-size: 0.75rem;
    color: var(--sand-light);
}

.timeline__mobile-item {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr);
    gap: 10px;
    align-items: center;
    position: relative;
    z-index: 1;
    opacity: 1;
}

.timeline__mobile-dot {
    width: 32px;
    height: 32px;
    background: white;
    border: 2px solid var(--sky);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: var(--shadow-sm);
}

.timeline__mobile-card {
    min-width: 0;
    padding: 12px 14px;
}

.timeline__mobile-time {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin-bottom: 8px;
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.18);
    font-family: var(--font-body);
    font-size: 0.62rem;
    font-weight: 900;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.82);
}

.timeline__mobile-name {
    display: block;
    font-family: var(--font-display);
    font-size: 0.88rem;
    line-height: 1.3;
    color: var(--sand-light);
    word-break: break-word;
}
</style>
