<template>
    <section class="hero" ref="sectionRef">
        <!-- Three.js warm sky canvas -->
        <canvas ref="canvasRef" class="hero__canvas"></canvas>

        <!-- Decorative floating leaves -->
        <div class="hero__leaves">
            <span v-for="i in 8" :key="i" class="hero__leaf" :style="leafStyle(i)">🌿</span>
        </div>

        <div class="hero__layout">
            <!-- LEFT: Invitation text -->
            <div class="hero__text" ref="textRef">
                <div class="hero__badge" ref="badgeRef">
                    <span>🎉</span>
                    <span>You're Invited!</span>
                    <span>🎉</span>
                </div>

                <h1 class="hero__title" ref="titleRef">
                    <span class="hero__title-panda" ref="linePanda">
                        <span v-for="(c, i) in 'PANDA'" :key="'p' + i" class="hero__char">{{ c }}</span>
                    </span>
                    <span class="hero__title-berpicnic" ref="lineBerpicnic">
                        <span v-for="(c, i) in 'BERPICNIC'" :key="'b' + i" class="hero__char">{{ c }}</span>
                    </span>
                </h1>

                <div class="hero__year-wrap" ref="yearRef">
                    <span class="hero__year">🌴 2026 🌴</span>
                </div>

                <div class="hero__chips" ref="chipsRef">
                    <div class="hero__chip">
                        <span>📍</span>
                        <div>
                            <strong>Pantai Masjid Tanah</strong>
                            <span>Melaka</span>
                        </div>
                    </div>
                    <div class="hero__chip">
                        <span>📅</span>
                        <div>
                            <strong>13 Jun 2026</strong>
                            <span>Sabtu · 8:00 Pagi</span>
                        </div>
                    </div>
                </div>

                <a href="#countdown" class="hero__cta" ref="ctaRef" @click.prevent="scrollNext" @mousemove="onCtaMagnet"
                    @mouseleave="onCtaLeave">
                    <span>Jelajah 🐼</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </a>
            </div>

            <!-- RIGHT: Official Poster -->
            <div class="hero__poster-wrap" ref="posterRef">
                <div class="hero__poster-frame">
                    <img src="/poster.jpeg" alt="PANDA BERPICNIC 2026 Official Poster" class="hero__poster-img"
                        @error="posterError = true" />
                    <!-- Fallback if image not placed yet -->
                    <div v-if="posterError" class="hero__poster-fallback">
                        <div>🐼</div>
                        <p>Place poster.jpeg in<br /><code>public/poster.jpeg</code></p>
                    </div>
                    <div class="hero__poster-badge">Official Poster ⭐</div>
                </div>
            </div>
        </div>

        <!-- Scroll progress indicator -->
        <div class="hero__scroll-hint" ref="scrollHint">
            <div class="hero__scroll-line"></div>
            <span>SCROLL</span>
            <div class="hero__scroll-line"></div>
        </div>
    </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { onBeforeUnmount, onMounted, ref } from 'vue'
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

const sectionRef = ref(null)
const canvasRef = ref(null)
const textRef = ref(null)
const titleRef = ref(null)
const badgeRef = ref(null)
const linePanda = ref(null)
const lineBerpicnic = ref(null)
const yearRef = ref(null)
const chipsRef = ref(null)
const ctaRef = ref(null)
const posterRef = ref(null)
const scrollHint = ref(null)
const posterError = ref(false)

let renderer, scene, camera, animId
let onMouseMove, mouseMoveBound = false

function leafStyle(i) {
    return {
        left: `${5 + i * 11}%`,
        top: `${10 + (i % 3) * 30}%`,
        fontSize: `${1.2 + (i % 3) * 0.5}rem`,
        animationDuration: `${3 + i * 0.5}s`,
        animationDelay: `${i * 0.4}s`,
        opacity: 0.5 + (i % 3) * 0.2,
    }
}

function scrollNext() {
    document.getElementById('countdown')?.scrollIntoView({ behavior: 'smooth' })
}

// ── Three.js warm sky ──────────────────────────────────
function initThree() {
    const canvas = canvasRef.value
    const W = window.innerWidth
    const H = window.innerHeight

    scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xD4EBF5, 20, 80)

    camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 200)
    camera.position.set(0, 0, 18)

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xC8E8F5, 1) // soft tropical sky blue

    // Warm pollen/dandelion particles
    const COUNT = 600
    const pos = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 60
        pos[i * 3 + 1] = (Math.random() - 0.5) * 40
        pos[i * 3 + 2] = (Math.random() - 0.5) * 30
        speeds[i] = 0.01 + Math.random() * 0.02
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

    // Two particle layers: warm cream + sky blue
    const matCream = new THREE.PointsMaterial({
        color: 0xF5E8C0, size: 0.14, transparent: true, opacity: 0.7,
        blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true,
    })
    const matBlue = new THREE.PointsMaterial({
        color: 0xA8DDF0, size: 0.08, transparent: true, opacity: 0.5,
        blending: THREE.NormalBlending, depthWrite: false, sizeAttenuation: true,
    })

    const pts1 = new THREE.Points(geo, matCream)
    const pts2 = new THREE.Points(geo.clone(), matBlue)
    scene.add(pts1, pts2)

    let mx = 0, my = 0
    onMouseMove = e => {
        mx = (e.clientX / window.innerWidth - 0.5) * 2
        my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)
    mouseMoveBound = true

    let t = 0
    function animate() {
        animId = requestAnimationFrame(animate)
        t += 0.004

        const p = geo.attributes.position.array
        for (let i = 0; i < COUNT; i++) {
            p[i * 3 + 1] += speeds[i]
            p[i * 3] += Math.sin(t + i * 0.2) * 0.002
            if (p[i * 3 + 1] > 22) {
                p[i * 3 + 1] = -22
                p[i * 3] = (Math.random() - 0.5) * 60
            }
        }
        geo.attributes.position.needsUpdate = true

        pts1.rotation.y += 0.0002
        pts2.rotation.y -= 0.0001
        camera.position.x += (mx * 1.2 - camera.position.x) * 0.03
        camera.position.y += (-my * 0.8 - camera.position.y) * 0.03
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
    }
    animate()

    window.addEventListener('resize', onResize)
}

function onResize() {
    const W = window.innerWidth, H = window.innerHeight
    camera.aspect = W / H
    camera.updateProjectionMatrix()
    renderer.setSize(W, H)
}

// ── Magnetic CTA ───────────────────────────────────────
function onCtaMagnet(e) {
    const el = ctaRef.value
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.38
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.38
    gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out', overwrite: 'auto' })
}
function onCtaLeave() {
    gsap.to(ctaRef.value, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' })
}

// ── GSAP: Instant entry on load + pinned exit on scroll ──
function initGSAP() {
    const pandaChars = linePanda.value.querySelectorAll('.hero__char')
    const berpicnicChars = lineBerpicnic.value.querySelectorAll('.hero__char')
    const allChars = [...pandaChars, ...berpicnicChars]
    const chipItems = [...(chipsRef.value?.children ?? [])]

    // rainbow slam-in colours → final colour
    const rainbowP = ['#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF9FF3', '#54A0FF']
    const rainbowB = ['#54A0FF', '#5F27CD', '#FF6B6B', '#48DBFB', '#FF9F43', '#FECA57', '#FF6B6B', '#54A0FF', '#FF9F43']

    // ── ENTRY ──────────────────────────────────────────
    const entry = gsap.timeline()
    entry
        .fromTo(badgeRef.value,
            { opacity: 0, scale: 0.4, rotation: -12, y: -20 },
            { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)' }, 0.15)
        .fromTo(pandaChars,
            { opacity: 0, y: 120, rotationX: -90, color: (i) => rainbowP[i % rainbowP.length], transformPerspective: 500 },
            { opacity: 1, y: 0, rotationX: 0, color: '#1B3A6B', stagger: 0.09, duration: 0.7, ease: 'back.out(3)' }, 0.4)
        .fromTo(berpicnicChars,
            { opacity: 0, y: 90, rotationX: -80, color: (i) => rainbowB[i % rainbowB.length], transformPerspective: 500 },
            { opacity: 1, y: 0, rotationX: 0, color: '#C84B2E', stagger: 0.07, duration: 0.6, ease: 'back.out(2.5)' }, 0.7)
        .fromTo(yearRef.value,
            { opacity: 0, scale: 0.4, rotation: -8 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' }, 0.98)
        .fromTo(chipItems,
            { opacity: 0, x: -70, rotation: -5 },
            { opacity: 1, x: 0, rotation: 0, stagger: 0.14, duration: 0.55, ease: 'back.out(2)' }, 1.08)
        .fromTo(ctaRef.value,
            { opacity: 0, scale: 0.6, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, 1.28)
        .fromTo(posterRef.value,
            { opacity: 0, rotateY: 90, x: 130, transformPerspective: 1000 },
            { opacity: 1, rotateY: 0, x: 0, duration: 1, ease: 'power3.out' }, 0.35)
        .fromTo(scrollHint.value,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4 }, 1.45)

    // Continuous ambient animations
    gsap.to(posterRef.value, { y: -14, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 })
    gsap.to(badgeRef.value, { rotation: 2, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 })
    gsap.to(scrollHint.value, { y: 8, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.8 })

    // ── EXIT: pinned, chars SCATTER ────────────────────
    const exitTl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionRef.value,
            pin: true, scrub: 1.5,
            start: 'top top', end: '+=1200',
            anticipatePin: 1, invalidateOnRefresh: true,
        }
    })

    // subtle poster breathe while holding
    exitTl.to(posterRef.value, { y: -16, duration: 0.35, ease: 'sine.inOut', overwrite: false }, 0)
    exitTl.to(posterRef.value, { y: 0, duration: 0.35, ease: 'sine.inOut', overwrite: false }, 0.35)

    // EXIT (60–100%): chars scatter in all directions
    exitTl
        .to(allChars, {
            x: () => gsap.utils.random(-500, 500),
            y: () => gsap.utils.random(-350, 350),
            rotation: () => gsap.utils.random(-540, 540),
            scale: () => gsap.utils.random(0, 2),
            opacity: 0,
            stagger: { each: 0.018, from: 'random' },
            duration: 0.38,
        }, 0.6)
        .to([...chipItems, yearRef.value, badgeRef.value],
            { y: -120, opacity: 0, stagger: 0.04, duration: 0.22 }, 0.62)
        .fromTo(posterRef.value,
            { rotateY: 0, x: 0, scale: 1, opacity: 1, transformPerspective: 1000 },
            { rotateY: -90, x: 180, scale: 1.15, opacity: 0, duration: 0.32 }, 0.65)
        .to(scrollHint.value, { opacity: 0, duration: 0.12 }, 0.62)
}

onMounted(() => {
    initThree()
    initGSAP()
})

onBeforeUnmount(() => {
    if (animId) cancelAnimationFrame(animId)
    if (renderer) {
        renderer.dispose()
        renderer = null
    }
    if (mouseMoveBound && onMouseMove) {
        window.removeEventListener('mousemove', onMouseMove)
        mouseMoveBound = false
    }
    window.removeEventListener('resize', onResize)
    ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.hero {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 650px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.hero__canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.hero__leaves {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
    overflow: hidden;
}

.hero__leaf {
    position: absolute;
    animation: leaf-fall linear infinite;
    filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.15));
}

// ── Layout ─────────────────────────────────────────────
.hero__layout {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 1200px;
    padding: 80px 40px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;

    @media (max-width: 900px) {
        flex-direction: column;
        text-align: center;
        padding: 80px 20px 40px;
    }
}

// ── Text Side ──────────────────────────────────────────
.hero__text {
    flex: 1;
    max-width: 520px;
}

.hero__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: white;
    border: 2px solid rgba(91, 191, 232, 0.4);
    border-radius: 50px;
    padding: 8px 20px;
    font-family: var(--font-body);
    font-size: 0.85rem;
    font-weight: 800;
    color: var(--navy);
    margin-bottom: 20px;
    box-shadow: var(--shadow-sm);
}

.hero__title {
    display: flex;
    flex-direction: column;
    line-height: 1;
    margin-bottom: 12px;
}

.hero__title-panda {
    font-family: var(--font-display);
    font-size: clamp(3.5rem, 9vw, 7rem);
    color: var(--navy);
    text-shadow: 3px 4px 0 rgba(27, 58, 107, 0.15);
    display: block;
    will-change: transform, opacity;
}

.hero__title-berpicnic {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 7vw, 5.5rem);
    color: var(--rust);
    text-shadow: 3px 4px 0 rgba(200, 75, 46, 0.2);
    display: block;
    will-change: transform, opacity;
}

.hero__char {
    display: inline-block;
    will-change: transform, opacity, color;
}

.hero__year-wrap {
    margin-bottom: 24px;
    will-change: transform, opacity;
}

.hero__year {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    color: var(--forest);
    display: inline-block;
    background: rgba(45, 107, 30, 0.08);
    border: 2px solid rgba(45, 107, 30, 0.2);
    padding: 6px 24px;
    border-radius: var(--radius-xl);
}

.hero__chips {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
    will-change: transform, opacity;

    @media (max-width: 900px) {
        align-items: center;
    }
}

.hero__chip {
    display: flex;
    align-items: center;
    gap: 12px;
    background: white;
    border: 2px solid rgba(91, 191, 232, 0.3);
    border-radius: var(--radius-md);
    padding: 10px 18px;
    box-shadow: var(--shadow-sm);
    max-width: 320px;

    span:first-child {
        font-size: 1.3rem;
        flex-shrink: 0;
    }

    strong {
        display: block;
        font-family: var(--font-body);
        font-size: 0.9rem;
        font-weight: 800;
        color: var(--navy);
    }

    span:last-child {
        font-family: var(--font-body);
        font-size: 0.78rem;
        color: var(--text-light);
    }
}

.hero__cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, var(--sky) 0%, var(--ocean) 100%);
    color: #fff;
    font-family: var(--font-body);
    font-weight: 700;
    border: none;
    cursor: pointer;
    border-radius: var(--radius-xl);
    box-shadow: 0 4px 15px rgba(45, 142, 181, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
    font-size: 1rem;
    padding: 14px 32px;
    animation: float 2.5s ease-in-out infinite;
    will-change: transform, opacity;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(45, 142, 181, 0.5);
    }

    svg {
        width: 18px;
        height: 18px;
    }
}

// ── Poster Side ────────────────────────────────────────
.hero__poster-wrap {
    flex-shrink: 0;
    will-change: transform, opacity;

    @media (max-width: 900px) {
        order: -1;
    }
}

.hero__poster-frame {
    position: relative;
    width: clamp(260px, 35vw, 380px);
    border-radius: var(--radius-lg);
    border: 4px solid var(--wood-sign);
    box-shadow:
        6px 8px 0 var(--wood-border),
        0 20px 60px rgba(27, 58, 107, 0.25);
    background: var(--cream);
    overflow: hidden;
    transform: rotate(-2deg);

    &:hover {
        transform: rotate(0deg) scale(1.02);
        transition: transform 0.4s ease;
    }
}

.hero__poster-img {
    width: 100%;
    height: auto;
    display: block;
}

.hero__poster-fallback {
    width: 100%;
    aspect-ratio: 3/4;
    background: linear-gradient(160deg, var(--sky-pale), var(--sky-light));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 4rem;

    p {
        font-family: var(--font-body);
        font-size: 0.85rem;
        color: var(--text-mid);
        text-align: center;

        code {
            background: rgba(27, 58, 107, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.8rem;
        }
    }
}

.hero__poster-badge {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, var(--wood-mid), var(--wood-dark));
    color: var(--sand-light);
    font-family: var(--font-display);
    font-size: 0.85rem;
    text-align: center;
    padding: 8px;
    letter-spacing: 1px;
}

// ── Scroll hint ────────────────────────────────────────
.hero__scroll-hint {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--navy);
    will-change: opacity;
}

.hero__scroll-line {
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--sky), transparent);
}
</style>
