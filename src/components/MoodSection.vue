<template>
    <section class="mood section-base" ref="sectionRef">
        <div class="section-inner">
            <div class="text-center" ref="headerRef">
                <span class="section-label">🌈 Mood Board</span>
                <h2 class="section-title">Vibes Yang Kita Cari 🌊</h2>
                <div class="wave-divider wave-divider-center"></div>
                <p class="section-subtitle">Healing · Relax · Enjoy · Together</p>
            </div>

            <div class="mood__grid" ref="gridRef">
                <div v-for="(card, i) in moods" :key="i" class="mood__card" :class="'mood__card--' + card.accent"
                    :ref="el => (cardRefs[i] = el)">
                    <div class="mood__card-bg">{{ card.bg }}</div>
                    <div class="mood__card-content">
                        <div class="mood__card-icon">{{ card.icon }}</div>
                        <h3 class="mood__card-title">{{ card.title }}</h3>
                        <p class="mood__card-desc">{{ card.desc }}</p>
                    </div>
                </div>
            </div>

            <div class="mood__quote" ref="quoteRef">
                <div class="mood__quote-inner">
                    <span class="mood__quote-panda">🐼</span>
                    <p>"HEALING RELAX ENJOY — Itulah spirit Panda Berpicnic 2026!"</p>
                    <span class="mood__quote-panda">🐼</span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const sectionRef = ref(null)
const headerRef = ref(null)
const gridRef = ref(null)
const quoteRef = ref(null)
const cardRefs = reactive({})

const moods = [
    { icon: '🏖️', title: 'Tepi Pantai', desc: 'Pasir putih, ombak tenang, angin laut menyegarkan', accent: 'blue', bg: '🌊' },
    { icon: '🔥', title: 'BBQ Heaven', desc: 'Bau asap BBQ, ayam bakar, sotong, dan semua benda sedap', accent: 'orange', bg: '🌶️' },
    { icon: '🎮', title: 'Game On!', desc: 'Uno, Monopoly, Saidina — siapa yang menang dapat gelak!', accent: 'green', bg: '🎲' },
    { icon: '📸', title: 'Memory Maker', desc: 'Tangkap setiap moment, simpan kenangan, hidup selamanya', accent: 'purple', bg: '✨' },
    { icon: '💙', title: 'Friendship', desc: 'Bukan sekadar kawan — ini keluarga pilihan kita sendiri', accent: 'sky', bg: '🤝' },
]

onMounted(() => {
    const cards = Object.values(cardRefs)

    ScrollTrigger.create({
        trigger: sectionRef.value, start: 'top 75%',
        onEnter: () => {
            gsap.fromTo(headerRef.value, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 })
            gsap.fromTo(cards, {
                opacity: 0, y: 80, rotation: () => (Math.random() - 0.5) * 20,
            }, {
                opacity: 1, y: 0, rotation: 0,
                stagger: 0.12, duration: 0.7, ease: 'back.out(1.5)',
                delay: 0.2,
            })
            gsap.fromTo(quoteRef.value, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.8, delay: 0.9 })
        },
        once: true
    })
})

onBeforeUnmount(() => ScrollTrigger.getAll().forEach(st => st.kill()))
</script>

<style scoped lang="scss">
.mood {
    background: linear-gradient(160deg, var(--cream) 0%, var(--sky-pale) 50%, #E0F5E0 100%);
}

.mood__grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-top: 50px;

    @media (max-width: 1000px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
    }
}

.mood__card {
    border-radius: var(--radius-lg);
    padding: 28px 18px;
    text-align: center;
    position: relative;
    overflow: hidden;
    opacity: 0;
    box-shadow: var(--shadow-md);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-8px);
        box-shadow: var(--shadow-lg);
    }

    &--blue {
        background: linear-gradient(160deg, #E8F7FF, #C8E8F5);
        border: 2px solid rgba(91, 191, 232, 0.3);
    }

    &--orange {
        background: linear-gradient(160deg, #FFF3E0, #FFE0B0);
        border: 2px solid rgba(255, 160, 40, 0.3);
    }

    &--green {
        background: linear-gradient(160deg, #E8FFE8, #C8F0C8);
        border: 2px solid rgba(45, 107, 30, 0.2);
    }

    &--purple {
        background: linear-gradient(160deg, #F5E8FF, #E8D0FF);
        border: 2px solid rgba(160, 80, 200, 0.2);
    }

    &--sky {
        background: linear-gradient(160deg, #E0FAFF, #B8ECFF);
        border: 2px solid rgba(0, 160, 200, 0.2);
    }
}

.mood__card-bg {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 4rem;
    opacity: 0.12;
    transform: rotate(15deg);
    pointer-events: none;
}

.mood__card-content {
    position: relative;
    z-index: 1;
}

.mood__card-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    transition: transform 0.3s;

    .mood__card:hover & {
        transform: scale(1.25) rotate(-8deg);
    }
}

.mood__card-title {
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--navy);
    margin-bottom: 8px;
}

.mood__card-desc {
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-mid);
    line-height: 1.5;
}

.mood__quote {
    text-align: center;
    margin-top: 50px;
    opacity: 0;
}

.mood__quote-inner {
    display: inline-flex;
    align-items: center;
    gap: 20px;
    background: white;
    border: 2px solid var(--sky);
    border-radius: var(--radius-xl);
    padding: 20px 36px;
    box-shadow: var(--shadow-md);

    p {
        font-family: var(--font-display);
        font-size: clamp(1rem, 2.5vw, 1.3rem);
        color: var(--navy);
        font-style: italic;
    }
}

.mood__quote-panda {
    font-size: 2rem;
    animation: wave-bob 3s ease-in-out infinite;

    &:last-child {
        animation-delay: 0.5s;
    }
}
</style>
