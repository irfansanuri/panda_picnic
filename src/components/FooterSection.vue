<template>
    <footer class="footer">
        <!-- Wave transition top -->
        <div class="footer__wave-top">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#1B3A6B" />
            </svg>
        </div>

        <div class="footer__main">
            <!-- Big panda + slogan -->
            <div class="footer__hero">
                <div class="footer__panda" ref="pandaRef">
                    <span class="footer__panda-emoji">🐼</span>
                    <div class="footer__sign wood-sign-banner">HEALING · RELAX · ENJOY</div>
                </div>

                <h2 class="footer__brand">PANDA BERPICNIC 2026</h2>
                <p class="footer__tagline">See you at the beach! 🌊🏖️</p>
            </div>

            <!-- Nav links -->
            <nav class="footer__nav">
                <a v-for="link in links" :key="link.label" :href="link.href" class="footer__nav-link">
                    {{ link.icon }} {{ link.label }}
                </a>
            </nav>

            <!-- Event recap -->
            <div class="footer__recap">
                <div class="footer__recap-item">
                    <span>📍</span>
                    <div>
                        <strong>Pantai Kuala Sungai Baru</strong>
                        <span>Melaka</span>
                    </div>
                </div>
                <div class="footer__recap-divider">·</div>
                <div class="footer__recap-item">
                    <span>📅</span>
                    <div>
                        <strong>13 Jun 2026</strong>
                        <span>Sabtu · 8:00 Pagi</span>
                    </div>
                </div>
                <div class="footer__recap-divider">·</div>
                <div class="footer__recap-item">
                    <span>👥</span>
                    <div>
                        <strong>Squad Panda</strong>
                        <span>Kawan untuk selamanya</span>
                    </div>
                </div>
            </div>

            <!-- Cute message -->
            <div class="footer__bottom">
                <p class="footer__bottom-text">
                    Made with 🐼 and lots of 💙 by squad Panda Berpicnic
                </p>
                <p class="footer__bottom-sub">
                    © 2026 Panda Berpicnic · Semua hak terpelihara (especially the BBQ spot 🔥)
                </p>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const pandaRef = ref(null)

const links = [
    { icon: '⏳', label: 'Countdown', href: '#countdown' },
    { icon: '📋', label: 'Butiran', href: '#details' },
    { icon: '👥', label: 'Tetamu', href: '#attendees' },
    { icon: '🎒', label: 'Senarai Bawa', href: '#bringlist' },
    { icon: '🎮', label: 'Permainan', href: '#games' },
    { icon: '⏱️', label: 'Timeline', href: '#timeline' },
]

onMounted(() => {
    ScrollTrigger.create({
        trigger: pandaRef.value, start: 'top 80%',
        onEnter: () => {
            gsap.fromTo(pandaRef.value,
                { opacity: 0, scale: 0.5, y: 60 },
                { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.5)' })
        },
        once: true
    })
})

onBeforeUnmount(() => ScrollTrigger.getAll().forEach(st => st.kill()))
</script>

<style scoped lang="scss">
.footer {
    position: relative;
    background: var(--navy);
    color: white;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
            radial-gradient(circle at 20% 50%, rgba(91, 191, 232, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(45, 107, 30, 0.08) 0%, transparent 40%);
        pointer-events: none;
    }
}

.footer__wave-top {
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;

    svg {
        width: 100%;
        height: 80px;
        display: block;
    }
}

.footer__main {
    position: relative;
    z-index: 1;
    padding: 100px 40px 60px;
    max-width: 1100px;
    margin: 0 auto;
    text-align: center;
}

// Hero panda
.footer__hero {
    margin-bottom: 50px;
}

.footer__panda {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;
    opacity: 0;
}

.footer__panda-emoji {
    font-size: 5rem;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
    animation: wave-bob 3s ease-in-out infinite;
    display: block;
}

.footer__sign {
    display: inline-block;
}

.wood-sign-banner {
    background: linear-gradient(135deg, var(--wood-dark), var(--wood-mid));
    border: 3px solid var(--wood-border);
    border-radius: var(--radius-md);
    padding: 10px 28px;
    font-family: var(--font-display);
    font-size: 1rem;
    color: var(--sand-light);
    letter-spacing: 3px;
    box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    animation: wiggle 4s ease-in-out infinite 1s;
}

.footer__brand {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 5vw, 3rem);
    color: white;
    letter-spacing: 2px;
    margin-bottom: 12px;
    text-shadow: 2px 3px 8px rgba(0, 0, 0, 0.3);
}

.footer__tagline {
    font-family: var(--font-body);
    font-size: 1.1rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.7);
}

// Nav
.footer__nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-bottom: 40px;
}

.footer__nav-link {
    padding: 8px 20px;
    background: rgba(255, 255, 255, 0.07);
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    border-radius: 50px;
    color: rgba(255, 255, 255, 0.75);
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.25s;

    &:hover {
        background: rgba(91, 191, 232, 0.2);
        border-color: var(--sky);
        color: white;
        transform: translateY(-2px);
    }
}

// Recap
.footer__recap {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-bottom: 40px;
    flex-wrap: wrap;
}

.footer__recap-item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-body);

    span:first-child {
        font-size: 1.4rem;
    }

    strong {
        display: block;
        font-size: 0.9rem;
        color: white;
    }

    span:last-child {
        display: block;
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.55);
    }
}

.footer__recap-divider {
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.2);

    @media (max-width: 600px) {
        display: none;
    }
}

// Bottom
.footer__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
}

.footer__bottom-text {
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 6px;
}

.footer__bottom-sub {
    font-family: var(--font-body);
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.4);
}
</style>
