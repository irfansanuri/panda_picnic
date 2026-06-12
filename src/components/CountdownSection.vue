<template>
    <section class="cdown" ref="sectionRef">
        <!-- Floating coconut/sun decorations -->
        <div class="cdown__deco cdown__deco--sun">☀️</div>
        <div class="cdown__deco cdown__deco--coconut">🥥</div>
        <div class="cdown__deco cdown__deco--wave">🌊</div>

        <div class="section-inner">
            <div class="text-center cdown__header" ref="headerRef">
                <span class="section-label">⏳ Kiraan Detik</span>
                <h2 class="section-title">Masa Yang Tinggal!</h2>
                <div class="wave-divider wave-divider-center"></div>
                <p class="section-subtitle">Sebelum kita seru bertemu di tepi pantai...</p>
            </div>

            <div class="cdown__grid" ref="gridRef">
                <div v-for="(unit, i) in units" :key="unit.key" class="cdown__card wood-card"
                    :ref="el => (cardRefs[i] = el)">
                    <div class="cdown__card-inner">
                        <span class="cdown__number" :ref="el => (numRefs[unit.key] = el)">
                            {{ pad(time[unit.key]) }}
                        </span>
                        <div class="cdown__ropes">
                            <div class="cdown__rope cdown__rope--left"></div>
                            <div class="cdown__rope cdown__rope--right"></div>
                        </div>
                        <div class="cdown__label-en">{{ unit.label }}</div>
                        <div class="cdown__label-my">{{ unit.labelMy }}</div>
                    </div>
                </div>
            </div>

            <div class="cdown__footer" ref="footerRef">
                <div class="cdown__footer-inner">
                    <span class="cdown__footer-icon">📅</span>
                    <span class="cdown__footer-text">Sabtu, 13 Jun 2026 · 8:00 Pagi · Pantai Kuala Sungai Baru</span>
                    <span class="cdown__footer-icon">🏖️</span>
                </div>
            </div>
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
const gridRef = ref(null)
const footerRef = ref(null)
const cardRefs = reactive({})
const numRefs = reactive({})
let interval
let countdownMatchMedia = null

const TARGET = new Date('2026-06-13T08:00:00+08:00')
const time = reactive({ days: 0, hours: 0, minutes: 0, seconds: 0 })

const units = [
    { key: 'days', label: 'Days', labelMy: 'Hari' },
    { key: 'hours', label: 'Hours', labelMy: 'Jam' },
    { key: 'minutes', label: 'Minutes', labelMy: 'Minit' },
    { key: 'seconds', label: 'Seconds', labelMy: 'Saat' },
]

function pad(n) { return String(Math.max(0, n)).padStart(2, '0') }

function tick() {
    const diff = TARGET - new Date()
    if (diff <= 0) { clearInterval(interval); return }
    const isCompact = window.matchMedia('(max-width: 640px)').matches
    const prev = { ...time }
    time.days = Math.floor(diff / 86400000)
    time.hours = Math.floor((diff % 86400000) / 3600000)
    time.minutes = Math.floor((diff % 3600000) / 60000)
    time.seconds = Math.floor((diff % 60000) / 1000)

    Object.keys(time).forEach((k, idx) => {
        if (prev[k] !== time[k] && numRefs[k]) {
            const el = numRefs[k]
            gsap.timeline({ overwrite: 'auto' })
                .to(el, {
                    y: isCompact ? -24 : -56,
                    opacity: 0,
                    scale: isCompact ? 0.9 : 0.75,
                    duration: isCompact ? 0.12 : 0.18,
                    ease: 'power3.in'
                })
                .set(el, { y: isCompact ? 28 : 64, scale: isCompact ? 1.08 : 1.3 })
                .to(el, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: isCompact ? 0.24 : 0.38,
                    ease: isCompact ? 'power2.out' : 'back.out(3)'
                })

            if (cardRefs[idx]) {
                gsap.timeline({ overwrite: 'auto' })
                    .to(cardRefs[idx], {
                        scale: isCompact ? 1.03 : 1.1,
                        boxShadow: isCompact ? '0 0 16px rgba(91,191,232,0.35)' : '0 0 30px rgba(91,191,232,0.6)',
                        duration: isCompact ? 0.1 : 0.15,
                        ease: 'power2.out'
                    })
                    .to(cardRefs[idx], {
                        scale: 1,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        duration: isCompact ? 0.2 : 0.5,
                        ease: isCompact ? 'power2.out' : 'elastic.out(1, 0.4)'
                    })
            }
        }
    })
}

onMounted(() => {
    tick()
    interval = setInterval(tick, 1000)

    const cards = Object.values(cardRefs)
    countdownMatchMedia = gsap.matchMedia()

    countdownMatchMedia.add('(min-width: 901px)', () => {
        const corners = [
            { x: -500, y: -350, rotation: -60 },
            { x: 500, y: -350, rotation: 60 },
            { x: -500, y: 350, rotation: 45 },
            { x: 500, y: 350, rotation: -45 },
        ]
        gsap.set(headerRef.value, { opacity: 0, y: -80 })
        gsap.set(footerRef.value, { opacity: 0, y: 80 })
        cards.forEach((card, i) => {
            gsap.set(card, { opacity: 0, scale: 0.2, ...(corners[i] ?? corners[0]) })
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.value,
                pin: true, scrub: 1.5,
                start: 'top top', end: '+=1400',
                anticipatePin: 1,
            }
        })

        tl
            .to(headerRef.value, { opacity: 1, y: 0, duration: 0.12, ease: 'back.out(2)' })
            .to(cards[0], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(1.8)' }, 0.1)
            .to(cards[1], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(1.8)' }, 0.16)
            .to(cards[2], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(1.8)' }, 0.22)
            .to(cards[3], { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 0.28, ease: 'back.out(1.8)' }, 0.28)
            .to(footerRef.value, { opacity: 1, y: 0, duration: 0.1 }, 0.35)
            .to({}, { duration: 0.3 })
            .to(cards[0], { x: -400, y: -280, rotation: -55, opacity: 0, scale: 0.3, duration: 0.22 }, 0.72)
            .to(cards[1], { x: 400, y: -280, rotation: 55, opacity: 0, scale: 0.3, duration: 0.22 }, 0.74)
            .to(cards[2], { x: -400, y: 280, rotation: 40, opacity: 0, scale: 0.3, duration: 0.22 }, 0.76)
            .to(cards[3], { x: 400, y: 280, rotation: -40, opacity: 0, scale: 0.3, duration: 0.22 }, 0.78)
            .to(headerRef.value, { y: -100, opacity: 0, duration: 0.2 }, 0.72)
            .to(footerRef.value, { y: 100, opacity: 0, duration: 0.2 }, 0.72)
    })

    countdownMatchMedia.add('(max-width: 900px)', () => {
        gsap.set(cards, { clearProps: 'all' })
        gsap.set([headerRef.value, footerRef.value], { clearProps: 'all' })

        gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.value,
                start: 'top 88%',
                once: true,
            }
        })
            .from(headerRef.value, { opacity: 0, y: 30, duration: 0.35 })
            .from(cards, { opacity: 0, y: 28, stagger: 0.08, duration: 0.3, ease: 'power2.out' }, 0.08)
            .from(footerRef.value, { opacity: 0, y: 20, duration: 0.28 }, 0.22)
    })
})

onBeforeUnmount(() => {
    clearInterval(interval)
    countdownMatchMedia?.revert()
    ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.cdown {
    background: linear-gradient(160deg, var(--sand-light) 0%, var(--cream) 60%, var(--sky-pale) 100%);
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

// Deco
.cdown__deco {
    position: absolute;
    font-size: 2.5rem;
    pointer-events: none;
    z-index: 1;
    opacity: 0.35;

    @media (max-width: 640px) {
        opacity: 0.18;
        transform: scale(0.8);
    }

    &--sun {
        top: 12%;
        right: 8%;
        animation: sunPulse 3s ease-in-out infinite, float 4s ease-in-out infinite;
    }

    &--coconut {
        bottom: 15%;
        left: 5%;
        animation: float 3.5s ease-in-out infinite 0.5s;
        font-size: 2rem;
    }

    &--wave {
        bottom: 10%;
        right: 10%;
        animation: wave-bob 3s ease-in-out infinite;
    }
}

.cdown__header {
    margin-bottom: 50px;
    opacity: 0;

    @media (max-width: 900px) {
        margin-bottom: 32px;
        opacity: 1;
    }
}

.cdown__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
    perspective: 1200px;

    @media (max-width: 640px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
        max-width: 100%;
        width: min(100%, 360px);
        padding: 14px;
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.45);
        box-shadow: 0 12px 30px rgba(27, 58, 107, 0.08);
    }
}

.cdown__card {
    text-align: center;
    padding: 0;
    transform-style: preserve-3d;
    opacity: 0;

    @media (max-width: 640px) {
        min-width: 0;
        min-height: 132px;
        opacity: 1;
    }
}

.cdown__card-inner {
    padding: 28px 16px 22px;
    position: relative;

    @media (max-width: 640px) {
        padding: 20px 12px 16px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}

.cdown__ropes {
    position: absolute;
    top: -18px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;

    @media (max-width: 640px) {
        display: none;
    }
}

.cdown__rope {
    width: 4px;
    height: 20px;
    background: linear-gradient(180deg, var(--wood-dark), var(--wood-mid));
    border-radius: 2px;

    &::before {
        content: '';
        position: absolute;
        top: -4px;
        left: 50%;
        transform: translateX(-50%);
        width: 10px;
        height: 10px;
        background: var(--wood-border);
        border-radius: 50%;
    }
}

.cdown__number {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 5rem);
    color: var(--navy);
    line-height: 1;
    display: block;
    text-shadow: 2px 3px 0 rgba(27, 58, 107, 0.15);
    will-change: transform, color;

    @media (max-width: 640px) {
        font-size: clamp(2.4rem, 12vw, 3.4rem);
    }
}

.cdown__label-en {
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 10px;

    @media (max-width: 640px) {
        font-size: 0.56rem;
        letter-spacing: 1.8px;
        margin-top: 8px;
    }
}

.cdown__label-my {
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--sand-light);
    margin-top: 2px;

    @media (max-width: 640px) {
        font-size: 0.82rem;
    }
}

.cdown__footer {
    text-align: center;
    margin-top: 40px;
    opacity: 0;

    @media (max-width: 640px) {
        margin-top: 24px;
        opacity: 1;
    }
}

.cdown__footer-inner {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: white;
    border: 2px solid rgba(91, 191, 232, 0.3);
    border-radius: 50px;
    padding: 12px 28px;
    box-shadow: var(--shadow-sm);

    @media (max-width: 640px) {
        width: min(100%, 360px);
        display: grid;
        grid-template-columns: 1fr;
        justify-items: center;
        gap: 6px;
        padding: 14px 18px;
        border-radius: 24px;
    }
}

.cdown__footer-icon {
    @media (max-width: 640px) {
        display: none;
    }
}

.cdown__footer-text {
    font-family: var(--font-body);
    font-size: clamp(0.8rem, 2vw, 1rem);
    font-weight: 700;
    color: var(--navy);
    text-align: center;

    @media (max-width: 640px) {
        font-size: 0.88rem;
        line-height: 1.4;
    }
}
</style>
