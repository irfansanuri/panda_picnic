<template>
    <nav class="navbar" :class="{ 'navbar--scrolled': scrolled }">
        <div class="navbar__inner">
            <a href="#hero" class="navbar__logo" @click.prevent="scrollTo('hero')">
                <span class="navbar__logo-panda">🐼</span>
                <span class="navbar__logo-text">PANDA BERPICNIC</span>
            </a>

            <ul class="navbar__links">
                <li v-for="item in navItems" :key="item.id">
                    <a :href="`#${item.id}`" class="navbar__link" :class="{ active: active === item.id }"
                        @click.prevent="scrollTo(item.id)">{{ item.label }}</a>
                </li>
            </ul>

            <button class="navbar__burger" @click="open = !open" aria-label="Menu">
                <span :class="{ opened: open }"></span>
            </button>
        </div>

        <!-- Scroll progress -->
        <div class="navbar__progress" ref="progressRef"></div>

        <transition name="drop">
            <div v-if="open" class="navbar__mobile">
                <a v-for="item in navItems" :key="item.id" :href="`#${item.id}`" class="navbar__mobile-link"
                    @click.prevent="scrollTo(item.id); open = false">
                    {{ item.icon }} {{ item.label }}
                </a>
            </div>
        </transition>
    </nav>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onBeforeUnmount, onMounted, ref } from 'vue'
gsap.registerPlugin(ScrollTrigger)

const progressRef = ref(null)
const scrolled = ref(false)
const open = ref(false)
const active = ref('hero')

const navItems = [
    { id: 'countdown', label: 'Countdown', icon: '⏳' },
    { id: 'details', label: 'Butiran', icon: '📍' },
    { id: 'attendees', label: 'Tetamu', icon: '👥' },
    { id: 'bringlist', label: 'Bawa Apa?', icon: '🎒' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'timeline', label: 'Jadual', icon: '📅' },
]

function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function onScroll() {
    scrolled.value = window.scrollY > 60
    const ids = ['hero', ...navItems.map(n => n.id)]
    for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) { active.value = id; break }
    }
}

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    gsap.to(progressRef.value, {
        scaleX: 1, ease: 'none',
        scrollTrigger: { start: 'top top', end: 'bottom bottom', scrub: 0.3 }
    })
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.navbar__progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, var(--sky), var(--rust), var(--forest), var(--sky));
    transform-origin: left;
    transform: scaleX(0);
}

.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 16px 0;
    transition: all 0.35s ease;

    &--scrolled {
        padding: 10px 0;
        background: rgba(254, 252, 245, 0.95);
        backdrop-filter: blur(16px);
        box-shadow: 0 2px 20px rgba(27, 58, 107, 0.12);
        border-bottom: 2px solid rgba(91, 191, 232, 0.3);
    }
}

.navbar__inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 768px) {
        padding: 0 20px;
    }
}

.navbar__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
}

.navbar__logo-panda {
    font-size: 1.8rem;
    animation: wave-bob 3s ease-in-out infinite;
    display: inline-block;
}

.navbar__logo-text {
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--navy);
    letter-spacing: 1px;

    @media (max-width: 500px) {
        display: none;
    }
}

.navbar__links {
    display: flex;
    gap: 28px;
    list-style: none;

    @media (max-width: 768px) {
        display: none;
    }
}

.navbar__link {
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-light);
    text-decoration: none;
    transition: color 0.25s;
    position: relative;
    padding-bottom: 4px;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        border-radius: 1px;
        background: var(--sky);
        transform: scaleX(0);
        transition: transform 0.25s;
        transform-origin: left;
    }

    &:hover,
    &.active {
        color: var(--navy);

        &::after {
            transform: scaleX(1);
        }
    }
}

.navbar__burger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;

    @media (max-width: 768px) {
        display: block;
    }

    span {
        display: block;
        width: 22px;
        height: 2px;
        background: var(--navy);
        position: relative;
        transition: 0.3s;

        &::before,
        &::after {
            content: '';
            position: absolute;
            width: 22px;
            height: 2px;
            background: var(--navy);
            transition: 0.3s;
        }

        &::before {
            top: -7px;
        }

        &::after {
            top: 7px;
        }

        &.opened {
            background: transparent;

            &::before {
                top: 0;
                transform: rotate(45deg);
            }

            &::after {
                top: 0;
                transform: rotate(-45deg);
            }
        }
    }
}

.navbar__mobile {
    display: flex;
    flex-direction: column;
    background: rgba(254, 252, 245, 0.98);
    backdrop-filter: blur(16px);
    border-top: 2px solid rgba(91, 191, 232, 0.2);
    padding: 8px 0 16px;
}

.navbar__mobile-link {
    padding: 14px 24px;
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 700;
    color: var(--navy);
    text-decoration: none;
    border-bottom: 1px solid rgba(91, 191, 232, 0.1);
    transition: background 0.2s;

    &:hover {
        background: var(--sky-pale);
    }
}

.drop-enter-active,
.drop-leave-active {
    transition: all 0.3s ease;
}

.drop-enter-from,
.drop-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
