<template>
    <section class="games" ref="sectionRef">
        <div class="section-inner">
            <div class="text-center games__header" ref="headerRef">
                <span class="section-label">🎮 Aktiviti & Permainan</span>
                <h2 class="section-title">Ada Banyak Aktiviti! 🏆</h2>
                <div class="wave-divider wave-divider-center"></div>
                <p class="section-subtitle">Dari kad sampai pantai, semua ada!</p>
            </div>

            <div class="games__grid" ref="gridRef">
                <div v-for="game in gamesList" :key="game.id" class="games__card tropical-card"
                    :class="'card-type--' + classify(game.name).type" :ref="el => { if (el) cardRefs[game.id] = el }"
                    @mousemove="tilt($event, game.id)" @mouseleave="untilt(game.id)">
                    <div class="games__card-icon">{{ classify(game.name).icon }}</div>

                    <input v-if="game.editing" class="games__edit-input" v-model="game.name"
                        placeholder="Nama aktiviti..." @keyup.enter="game.editing = false; saveGame()"
                        @blur="game.editing = false; saveGame()" autofocus />
                    <div v-else class="games__card-name">
                        {{ game.name }}
                    </div>

                    <div class="games__card-tag" :class="'tag--' + classify(game.name).type">
                        {{ classify(game.name).typeLabel }}
                    </div>

                    <button v-if="game.editing" class="games__remove" @click="removeGame(game.id)"
                        title="Buang">✕</button>
                    <div class="games__card-glow"></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { games as gamesList, removeGame, saveGame } from 'src/composables/useStore.js'
import { nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const headerRef = ref(null)
const gridRef = ref(null)
const cardRefs = reactive({})

// ── Auto-classify game name → icon + category ──────────
function classify(name = '') {
    const n = (name || '').toLowerCase()

    // KAD
    if (/uno|kad\b|kartu|card|skip.?bo|exploding|snap|poker|rummy/.test(n))
        return { type: 'card', typeLabel: 'Kad', icon: '🃏' }

    // BOARD
    if (/monopoly/.test(n)) return { type: 'board', typeLabel: 'Board', icon: '🎲' }
    if (/saidina/.test(n)) return { type: 'board', typeLabel: 'Board', icon: '🏙️' }
    if (/chess|catur/.test(n)) return { type: 'board', typeLabel: 'Board', icon: '♟️' }
    if (/scrabble/.test(n)) return { type: 'board', typeLabel: 'Board', icon: '🔡' }
    if (/ludo|dam|papan|board/.test(n)) return { type: 'board', typeLabel: 'Board', icon: '🎲' }
    if (/strategi|strategy/.test(n)) return { type: 'board', typeLabel: 'Board', icon: '🧩' }

    // LUAR
    if (/berenang|renang|swim/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '🏊' }
    if (/mancing|pancing|ikan|kail/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '🎣' }
    if (/hiking|mendaki|hike/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '🥾' }
    if (/baling|selipar/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '👟' }
    if (/badminton/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '🏸' }
    if (/bola|football|soccer/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '⚽' }
    if (/frisbee/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '🥏' }
    if (/volleyball|tampar/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '🏐' }
    if (/lari|run|jog/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '🏃' }
    if (/basikal|bicycle|bike/.test(n)) return { type: 'outdoor', typeLabel: 'Luar', icon: '🚴' }

    return { type: 'outdoor', typeLabel: 'Luar', icon: '🎯' }
}

function tilt(e, id) {
    const card = cardRefs[id]; if (!card) return
    const r = card.getBoundingClientRect()
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -16
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 16
    gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 700, scale: 1.08, duration: 0.3 })
}
function untilt(id) {
    gsap.to(cardRefs[id], { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,0.6)' })
}

let animInited = false
let iconFloatTween = null

function initAnimations() {
    if (animInited) return
    const cards = Object.values(cardRefs)
    if (!cards.length) return
    animInited = true

    // Cards start like a shuffled deck — stacked, random rotation
    gsap.set(cards, {
        scale: 0,
        rotation: (i) => gsap.utils.random(-140, 140),
        opacity: 0,
        z: (i) => i * -8,
        transformPerspective: 900,
    })
    gsap.set(headerRef.value, { opacity: 0, y: 60 })

    let iconBounced = false

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.value,
            pin: true,
            scrub: 0.9,
            start: 'top top', end: '+=1200',
            anticipatePin: 1,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            onLeave: () => iconFloatTween?.pause(),
            onEnterBack: () => iconFloatTween?.resume(),
            onUpdate: (st) => {
                // When deal is ~halfway done, elastic-bounce all icons
                if (!iconBounced && st.progress > 0.38) {
                    iconBounced = true
                    const icons = gridRef.value?.querySelectorAll('.games__card-icon')
                    if (icons?.length) {
                        gsap.fromTo(icons,
                            { scale: 0.3, rotation: -30, opacity: 0 },
                            {
                                scale: 1, rotation: 0, opacity: 1,
                                stagger: { each: 0.07, from: 'center', grid: 'auto' },
                                duration: 0.8, ease: 'elastic.out(1.1, 0.4)'
                            })
                        // Continuous floating wave on icons
                        iconFloatTween = gsap.to(icons, {
                            y: -7, duration: 1.6,
                            stagger: { each: 0.18, from: 'random', yoyo: true, repeat: -1 },
                            ease: 'sine.inOut', delay: 0.9
                        })
                    }
                }
            }
        }
    })

    // ENTRY: deal cards like a card game (center → outward stagger)
    tl
        .to(headerRef.value, { opacity: 1, y: 0, duration: 0.1 })
        .to(cards, {
            scale: 1, rotation: 0, opacity: 1, z: 0,
            stagger: { each: 0.04, from: 'center', grid: 'auto' },
            duration: 0.26,
            ease: 'back.out(2)',
        }, 0.1)

    // HOLD
    tl.to({}, { duration: 0.32 })

    // EXIT: cards explode outward into the void
    tl
        .to(cards, {
            x: () => gsap.utils.random(-500, 500),
            y: () => gsap.utils.random(-380, 380),
            rotation: () => gsap.utils.random(-300, 300),
            scale: 0,
            opacity: 0,
            stagger: { each: 0.025, from: 'random' },
            duration: 0.3,
        }, 0.72)
        .to(headerRef.value, { opacity: 0, y: -70, duration: 0.2 }, 0.72)
}

onMounted(() => {
    nextTick(initAnimations)
})

// Fallback: if cards weren't rendered yet (store data still loading), init when data arrives
watch(gamesList, () => { nextTick(initAnimations) }, { once: true })

onBeforeUnmount(() => ScrollTrigger.getAll().forEach(st => st.kill()))
onBeforeUnmount(() => {
    iconFloatTween?.kill()
    iconFloatTween = null
})
</script>

<style scoped lang="scss">
.games {
    background: linear-gradient(160deg, #D0EFD0 0%, var(--cream) 50%, var(--sky-pale) 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
}

.games__header {
    margin-bottom: 50px;
    opacity: 0;
}

.games__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    transform-style: preserve-3d;

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 500px) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.games__card {
    text-align: center;
    padding: 28px 16px 22px;
    position: relative;
    overflow: hidden;
    transform-style: preserve-3d;
    transition: box-shadow 0.3s;
    cursor: pointer;
    opacity: 0;

    // Type-specific backgrounds — clear contrast for navy text
    &.card-type--card {
        background: linear-gradient(160deg, #FFF8DC, #FFF0B0);
        border-color: rgba(200, 150, 0, 0.25);
    }

    &.card-type--board {
        background: linear-gradient(160deg, #EAF4FF, #C8E4FF);
        border-color: rgba(91, 142, 232, 0.3);
    }

    &.card-type--outdoor {
        background: linear-gradient(160deg, #EAFAEC, #C8F0CC);
        border-color: rgba(45, 107, 30, 0.25);
    }

    &.card-type--water {
        background: linear-gradient(160deg, #E0F7FF, #B8EBFF);
        border-color: rgba(0, 160, 200, 0.25);
    }
}

.games__card-glow {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.25) 0%, transparent 60%);
    pointer-events: none;
}

.games__card-icon {
    font-size: 3rem;
    margin-bottom: 12px;
    position: relative;
    z-index: 1;
    display: inline-block;
    will-change: transform, opacity;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.12));
    transition: transform 0.3s;

    .games__card:hover & {
        transform: scale(1.2) rotate(10deg);
    }
}

.games__card-name {
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--navy);
    margin-bottom: 10px;
    position: relative;
    z-index: 1;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
        color: var(--rust);
    }
}

.games__edit-input {
    font-family: var(--font-display);
    font-size: 0.95rem;
    color: var(--navy);
    border: 2px solid var(--sky);
    border-radius: var(--radius-sm);
    padding: 4px 8px;
    outline: none;
    background: var(--sky-pale);
    width: 100%;
    margin-bottom: 10px;
    text-align: center;

    &:focus {
        border-color: var(--ocean);
        box-shadow: 0 0 0 3px rgba(91, 191, 232, 0.15);
    }
}

.games__card-tag {
    display: inline-block;
    border-radius: 50px;
    padding: 4px 14px;
    font-family: var(--font-body);
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    position: relative;
    z-index: 1;

    &.tag--card {
        background: rgba(180, 120, 0, 0.12);
        color: #7A4A00;
        border: 1.5px solid rgba(180, 120, 0, 0.4);
    }

    &.tag--board {
        background: rgba(30, 100, 200, 0.1);
        color: #1B3A6B;
        border: 1.5px solid rgba(30, 100, 200, 0.35);
    }

    &.tag--outdoor {
        background: rgba(30, 100, 30, 0.1);
        color: #1E5C1E;
        border: 1.5px solid rgba(30, 120, 30, 0.35);
    }

    &.tag--water {
        background: rgba(0, 120, 180, 0.1);
        color: #005A80;
        border: 1.5px solid rgba(0, 140, 200, 0.35);
    }
}

.games__remove {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--rust);
    font-size: 0.9rem;
    font-weight: 700;
    padding: 4px 6px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s, background 0.2s;

    .games__card:hover & {
        opacity: 1;
    }

    &:hover {
        background: rgba(200, 75, 46, 0.1);
    }
}

.games__add-wrap {
    text-align: center;
    margin-top: 32px;
}

.games__add-btn {
    border: 2px dashed rgba(91, 191, 232, 0.5);
    background: transparent;
    color: var(--ocean);
    box-shadow: none;
    font-size: 0.85rem;
    padding: 12px 28px;

    &:hover {
        background: var(--sky-pale);
        box-shadow: none;
        transform: none;
    }
}
</style>
