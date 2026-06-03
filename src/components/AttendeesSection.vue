<template>
    <section class="attendees section-base" ref="sectionRef">
        <div class="section-inner">
            <div class="text-center" ref="headerRef">
                <span class="section-label">👥 Senarai Hadir</span>
                <h2 class="section-title">Siapa Yang Pergi? 🐼</h2>
                <div class="wave-divider wave-divider-center"></div>
                <p class="section-subtitle">Daftar nama dan bersiap untuk pengalaman epic bersama!</p>
            </div>

            <div class="attendees__layout">
                <!-- VVIP -->
                <div class="attendees__group" ref="vvipRef">
                    <div class="attendees__group-title">
                        <span class="attendees__badge attendees__badge--vvip">👑 VVIP</span>
                    </div>
                    <div class="attendees__list">
                        <div v-for="person in vvipList" :key="person.id"
                            class="attendees__card tropical-card attendees__card--vvip"
                            @mousemove="tilt($event, 'v' + person.id)" @mouseleave="untilt('v' + person.id)"
                            :ref="el => (tiltRefs['v' + person.id] = el)">
                            <div class="attendees__card-emoji">{{ person.emoji }}</div>
                            <div class="attendees__card-info">
                                <input v-if="person.editing" v-model="person.name" class="attendees__edit-input"
                                    placeholder="Nama..." @keyup.enter="person.editing = false; saveVvip()"
                                    @blur="person.editing = false; saveVvip()" autofocus />
                                <strong v-else class="attendees__card-name" @click="person.editing = true">
                                    {{ person.name || 'Klik untuk edit' }}
                                </strong>
                                <input v-if="person.editing" v-model="person.title"
                                    class="attendees__edit-input attendees__edit-input--sm" placeholder="Jawatan..."
                                    @keyup.enter="person.editing = false; saveVvip()" />
                                <span v-else class="attendees__card-rank" @click="person.editing = true">{{ person.title
                                    }}</span>
                            </div>
                            <button class="attendees__remove" @click="removeVvip(person.id)" title="Buang">✕</button>
                            <div v-if="person.crown" class="attendees__crown">👑</div>
                        </div>

                        <!-- Add VVIP -->
                        <button class="attendees__add-btn btn-tropical attendees__add-btn--vvip" @click="addVvip">
                            <span>➕</span> Tambah VVIP
                        </button>
                    </div>
                </div>

                <!-- Tetamu Awam -->
                <div class="attendees__group" ref="tetamuRef">
                    <div class="attendees__group-title">
                        <span class="attendees__badge">🌟 Tetamu Awam</span>
                    </div>
                    <div class="attendees__list">
                        <div v-for="person in tetamuList" :key="person.id" class="attendees__card tropical-card"
                            @mousemove="tilt($event, person.id)" @mouseleave="untilt(person.id)"
                            :ref="el => (tiltRefs[person.id] = el)">
                            <div class="attendees__card-emoji">{{ person.emoji }}</div>
                            <div class="attendees__card-info">
                                <span class="attendees__card-rank">Tetamu</span>
                                <!-- Inline edit -->
                                <input v-if="person.editing" v-model="person.name" class="attendees__edit-input"
                                    placeholder="Nama..." @keyup.enter="person.editing = false; save()"
                                    @blur="person.editing = false; save()" autofocus />
                                <strong v-else class="attendees__card-name" @click="person.editing = true">
                                    {{ person.name || 'Klik untuk edit' }}
                                </strong>
                            </div>
                            <button class="attendees__remove" @click="removePerson(person.id)" title="Buang">✕</button>
                        </div>

                        <!-- Add new button -->
                        <button class="attendees__add-btn btn-tropical" @click="addNew">
                            <span>➕</span> Tambah Tetamu
                        </button>
                    </div>
                </div>
            </div>

            <!-- Quote -->
            <div class="attendees__quote" ref="quoteRef">
                <p>"Kita datang sebagai kawan, kita balik sebagai keluarga 🐼"</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { addTetamu, addVvip, removeTetamu, removeVvip, saveTetamu, saveVvip, tetamu as tetamuList, vvip as vvipList } from 'src/composables/useStore.js'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const sectionRef = ref(null)
const headerRef = ref(null)
const vvipRef = ref(null)
const tetamuRef = ref(null)
const quoteRef = ref(null)
const tiltRefs = reactive({})

function addNew() { addTetamu() }
function removePerson(id) { removeTetamu(id) }
function save() { saveTetamu() }

function tilt(e, id) {
    const card = tiltRefs[id]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 600, scale: 1.05, duration: 0.3 })
}
function untilt(id) {
    gsap.to(tiltRefs[id], { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'elastic.out(1,0.6)' })
}

onMounted(() => {
    ScrollTrigger.create({
        trigger: sectionRef.value, start: 'top 80%',
        onEnter: () => {
            gsap.fromTo(headerRef.value, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 })
            gsap.fromTo(vvipRef.value, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.9, delay: 0.2 })
            gsap.fromTo(tetamuRef.value, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.9, delay: 0.3 })
            gsap.fromTo(quoteRef.value, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.6 })
        },
        once: true
    })
})

onBeforeUnmount(() => ScrollTrigger.getAll().forEach(st => st.kill()))
</script>

<style scoped lang="scss">
.attendees {
    background: linear-gradient(160deg, var(--cream) 0%, var(--sky-pale) 100%);
}

.attendees__layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 50px;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
}

.attendees__group {
    opacity: 0;
}

.attendees__group-title {
    margin-bottom: 20px;
    text-align: center;
}

.attendees__badge {
    display: inline-block;
    background: var(--sky-pale);
    border: 2px solid var(--sky);
    border-radius: 50px;
    padding: 8px 24px;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--navy);

    &--vvip {
        background: linear-gradient(135deg, #FFF8DC, #FFEAA0);
        border-color: var(--sunshine);
        color: var(--wood-dark);
        box-shadow: 0 0 20px rgba(245, 197, 24, 0.3);
        animation: sunPulse 3s ease-in-out infinite;
    }
}

.attendees__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.attendees__card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    position: relative;
    transform-style: preserve-3d;

    &--vvip {
        border-color: rgba(245, 197, 24, 0.5);
        background: linear-gradient(135deg, #FFFDF0, var(--warm-white));
        box-shadow: 0 4px 20px rgba(245, 197, 24, 0.15);
    }
}

.attendees__card-emoji {
    font-size: 2.2rem;
    flex-shrink: 0;
    filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.1));
}

.attendees__card-info {
    flex: 1;
}

.attendees__card-rank {
    display: block;
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--ocean);
    margin-bottom: 2px;
}

.attendees__card-name {
    display: block;
    font-family: var(--font-display);
    font-size: 1.15rem;
    color: var(--navy);
    cursor: pointer;

    &:hover {
        color: var(--rust);
    }
}

.attendees__edit-input {
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--navy);
    border: 2px solid var(--sky);
    border-radius: var(--radius-sm);
    padding: 4px 10px;
    outline: none;
    background: var(--sky-pale);
    width: 100%;

    &:focus {
        border-color: var(--ocean);
    }

    &--sm {
        font-family: var(--font-body);
        font-size: 0.75rem;
        font-weight: 800;
        margin-top: 4px;
        color: var(--ocean);
        background: rgba(91, 191, 232, 0.08);
    }
}

.attendees__crown {
    position: absolute;
    top: -10px;
    right: 14px;
    font-size: 1.3rem;
    animation: float 2.5s ease-in-out infinite;
}

.attendees__remove {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--rust);
    font-size: 0.9rem;
    font-weight: 700;
    padding: 6px 8px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s, background 0.2s;

    .attendees__card:hover & {
        opacity: 1;
    }

    &:hover {
        background: rgba(200, 75, 46, 0.1);
    }
}

.attendees__add-btn {
    border: 2px dashed rgba(91, 191, 232, 0.5);
    background: transparent;
    color: var(--ocean);
    box-shadow: none;
    font-size: 0.85rem;
    padding: 12px 20px;
    justify-content: center;

    &:hover {
        background: var(--sky-pale);
        box-shadow: none;
    }

    &--vvip {
        border-color: rgba(245, 197, 24, 0.5);
        color: var(--wood-dark);

        &:hover {
            background: #FFFDF0;
        }
    }
}

.attendees__quote {
    text-align: center;
    margin-top: 50px;
    opacity: 0;

    p {
        font-family: var(--font-serif);
        font-size: clamp(1.1rem, 2.5vw, 1.4rem);
        font-style: italic;
        color: var(--text-mid);
        border-left: 4px solid var(--sky);
        padding: 12px 24px;
        display: inline-block;
        text-align: left;
    }
}
</style>
