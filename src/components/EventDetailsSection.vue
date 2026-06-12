<template>
    <section class="details" ref="sectionRef">
        <div class="section-inner">
            <div class="details__header text-center" ref="headerRef">
                <span class="section-label">📋 Maklumat</span>
                <h2 class="section-title">Butiran Acara</h2>
                <div class="wave-divider wave-divider-center"></div>
                <p class="section-subtitle">Semua info penting dalam satu tempat</p>
            </div>

            <div class="details__grid" ref="gridRef">
                <div v-for="(d, i) in details" :key="i" class="details__card wood-card" :ref="el => (cardRefs[i] = el)"
                    @mousemove="onTilt($event, i)" @mouseleave="resetTilt(i)">
                    <div class="details__card-icon">{{ d.icon }}</div>
                    <div class="details__card-body">
                        <span class="details__card-label">{{ d.label }}</span>
                        <span class="details__card-value">{{ d.value }}</span>
                        <span class="details__card-sub">{{ d.sub }}</span>
                    </div>
                    <div class="details__card-shine"></div>
                </div>
            </div>

            <!-- Map button -->
            <div class="details__map" ref="mapRef">
                <a href="https://maps.app.goo.gl/9mqnwygmJLeNiYcq8" target="_blank" rel="noopener"
                    class="btn-tropical details__map-btn">
                    🗺️ Buka Google Maps
                </a>
                <p class="details__map-note">
                    Pantai Kuala Sungai Baru · Melaka · Bawa pelumba matahari! ☀️
                </p>
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
const mapRef = ref(null)
const cardRefs = reactive({})
let detailsMatchMedia = null

const details = [
    { icon: '📍', label: 'Tempat', value: 'Pantai Kuala Sungai Baru', sub: 'Melaka' },
    { icon: '📅', label: 'Tarikh', value: '13 Jun 2026', sub: 'Sabtu' },
    { icon: '⏰', label: 'Masa', value: '8:00 Pagi', sub: 'Jangan lambat!' },
    { icon: '🌊', label: 'Aktiviti', value: 'Picnic & BBQ', sub: 'Di tepi pantai' },
]

function onTilt(e, i) {
    const card = cardRefs[i]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -16
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 700, scale: 1.06, duration: 0.3 })
}
function resetTilt(i) {
    gsap.to(cardRefs[i], { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,0.6)' })
}

onMounted(() => {
    detailsMatchMedia = gsap.matchMedia()

    detailsMatchMedia.add('(min-width: 901px)', () => {
        gsap.set(headerRef.value, { opacity: 0, y: 60 })
        gsap.set(cardRefs[0], { rotateY: -120, x: -80, opacity: 0, transformPerspective: 1200 })
        gsap.set(cardRefs[1], { rotateY: 120, x: 80, opacity: 0, transformPerspective: 1200 })
        gsap.set(cardRefs[2], { rotateY: -110, x: -80, opacity: 0, transformPerspective: 1200 })
        gsap.set(cardRefs[3], { rotateY: 110, x: 80, opacity: 0, transformPerspective: 1200 })
        gsap.set(mapRef.value, { opacity: 0, y: 40 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.value,
                pin: true, scrub: 1.5,
                start: 'top top', end: '+=1400',
                anticipatePin: 1,
            }
        })

        tl
            .to(headerRef.value, { opacity: 1, y: 0, duration: 0.12 })
            .to(cardRefs[0], { rotateY: 0, x: 0, opacity: 1, duration: 0.26, ease: 'back.out(1.4)' }, 0.1)
            .to(cardRefs[1], { rotateY: 0, x: 0, opacity: 1, duration: 0.26, ease: 'back.out(1.4)' }, 0.16)
            .to(cardRefs[2], { rotateY: 0, x: 0, opacity: 1, duration: 0.26, ease: 'back.out(1.4)' }, 0.22)
            .to(cardRefs[3], { rotateY: 0, x: 0, opacity: 1, duration: 0.26, ease: 'back.out(1.4)' }, 0.28)
            .to(mapRef.value, { opacity: 1, y: 0, duration: 0.1 }, 0.36)
            .to(cardRefs[0], { rotateZ: -1.5, duration: 0.08, ease: 'sine.inOut' }, 0.42)
            .to(cardRefs[1], { rotateZ: 1.5, duration: 0.08, ease: 'sine.inOut' }, 0.44)
            .to(cardRefs[2], { rotateZ: -1.2, duration: 0.08, ease: 'sine.inOut' }, 0.46)
            .to(cardRefs[3], { rotateZ: 1.2, duration: 0.08, ease: 'sine.inOut' }, 0.48)
            .to(Object.values(cardRefs), { rotateZ: 0, duration: 0.1 }, 0.5)
            .to({}, { duration: 0.2 })
            .to(cardRefs[0], { rotateY: 90, x: -120, opacity: 0, scale: 0.8, duration: 0.2 }, 0.72)
            .to(cardRefs[1], { rotateY: -90, x: 120, opacity: 0, scale: 0.8, duration: 0.2 }, 0.74)
            .to(cardRefs[2], { rotateY: 90, x: -120, opacity: 0, scale: 0.8, duration: 0.2 }, 0.76)
            .to(cardRefs[3], { rotateY: -90, x: 120, opacity: 0, scale: 0.8, duration: 0.2 }, 0.78)
            .to(headerRef.value, { y: -80, opacity: 0, duration: 0.15 }, 0.74)
            .to(mapRef.value, { y: 80, opacity: 0, duration: 0.15 }, 0.74)
    })

    detailsMatchMedia.add('(max-width: 900px)', () => {
        const cards = Object.values(cardRefs)
        gsap.set(cards, { clearProps: 'all' })
        gsap.set([headerRef.value, mapRef.value], { clearProps: 'all' })

        gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.value,
                start: 'top 88%',
                once: true,
            }
        })
            .from(headerRef.value, { opacity: 0, y: 30, duration: 0.35 })
            .from(cards, { opacity: 0, y: 28, stagger: 0.08, duration: 0.3, ease: 'power2.out' }, 0.08)
            .from(mapRef.value, { opacity: 0, y: 20, duration: 0.28 }, 0.22)
    })
})

onBeforeUnmount(() => {
    detailsMatchMedia?.revert()
    ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.details {
    background: linear-gradient(160deg, var(--sky-pale) 0%, #D8F0E0 60%, var(--cream) 100%);
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

.details__header {
    margin-bottom: 50px;

    @media (max-width: 900px) {
        margin-bottom: 32px;
    }
}

.details__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 40px;
    transform-style: preserve-3d;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
}

.details__card {
    padding: 32px 20px;
    text-align: center;
    transform-style: preserve-3d;
    cursor: default;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.3s;

    @media (max-width: 900px) {
        padding: 24px 18px;
    }
}

.details__card-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%);
    pointer-events: none;
    transition: left 0.5s ease;

    .details__card:hover & {
        left: 150%;
    }
}

.details__card-icon {
    font-size: 2.4rem;
    margin-bottom: 14px;
    filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.2));
}

.details__card-label {
    display: block;
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 10px;
}

.details__card-value {
    display: block;
    font-family: var(--font-display);
    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
    color: #fff;
    margin-bottom: 6px;
    line-height: 1.3;
    text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.2);
}

.details__card-sub {
    display: block;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--sand-light);
}

.details__map {
    text-align: center;
}

.details__map-btn {
    font-size: 1rem;
    padding: 14px 36px;
    margin-bottom: 14px;

    @media (max-width: 900px) {
        width: 100%;
        justify-content: center;
        padding: 14px 20px;
    }
}

.details__map-note {
    font-family: var(--font-body);
    font-size: 0.9rem;
    color: var(--text-light);
    font-style: italic;
}
</style>
