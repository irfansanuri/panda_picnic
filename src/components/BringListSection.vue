<template>
    <section class="bringlist section-base" ref="sectionRef">
        <div class="section-inner">
            <div class="text-center" ref="headerRef">
                <span class="section-label">🎒 Senarai Bawa</span>
                <h2 class="section-title">Siapa Bawa Apa? 🧺</h2>
                <div class="wave-divider wave-divider-center"></div>
                <p class="section-subtitle">Klik nama untuk edit, pilih siapa yang bertanggungjawab</p>
            </div>

            <!-- Category tabs -->
            <div class="bringlist__tabs">
                <button v-for="cat in categories" :key="cat.id" class="bringlist__tab"
                    :class="{ 'bringlist__tab--active': activeTab === cat.id }" @click="activeTab = cat.id">
                    <span>{{ cat.icon }}</span>
                    <span>{{ cat.label }}</span>
                    <span class="bringlist__tab-count">{{ cat.items.length }}</span>
                </button>
            </div>

            <!-- Active category -->
            <div v-for="cat in categories" v-show="activeTab === cat.id" :key="cat.id" class="bringlist__panel"
                :ref="el => (panelRefs[cat.id] = el)">
                <!-- Progress bar -->
                <div class="bringlist__progress-wrap">
                    <div class="bringlist__progress-label">
                        <span>{{ assignedCount(cat) }}/{{ cat.items.length }} dah ada orang bawa</span>
                        <span>{{ Math.round(progressPct(cat)) }}%</span>
                    </div>
                    <div class="bringlist__progress-bar">
                        <div class="bringlist__progress-fill" :style="{ width: progressPct(cat) + '%' }"></div>
                    </div>
                </div>

                <!-- Items -->
                <transition-group name="list-fade" tag="div" class="bringlist__list">
                    <div v-for="item in cat.items" :key="item.id" class="bringlist__item tropical-card">
                        <!-- Name (editable) -->
                        <div class="bringlist__item-name-wrap">
                            <input v-if="item.editing" v-model="item.name" class="bringlist__item-input"
                                @keyup.enter="confirmEdit(item)" @blur="confirmEdit(item)" autofocus />
                            <span v-else class="bringlist__item-name" @click="item.editing = true">
                                {{ item.name }}
                            </span>
                        </div>

                        <!-- Assigned person dropdown -->
                        <select class="bringlist__item-select" :value="item.person"
                            @change="e => { item.person = e.target.value; saveItem(item) }">
                            <option value="">— Pilih —</option>
                            <option v-for="p in allPeople()" :key="p" :value="p">{{ p }}</option>
                        </select>

                        <!-- Person chip -->
                        <div v-if="item.person" class="bringlist__person-chip" :class="personClass(item.person)">
                            {{ personEmoji(item.person) }} {{ item.person }}
                        </div>

                        <!-- Delete -->
                        <button class="bringlist__delete" @click="deleteItem(cat.id, item.id)"
                            title="Padam">🗑️</button>
                    </div>
                </transition-group>

                <!-- Add item -->
                <button class="bringlist__add btn-tropical" @click="addItem(cat.id)">
                    ➕ Tambah Item
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { addItem, allPeople, categories, deleteItem, saveItem } from 'src/composables/useStore.js'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const sectionRef = ref(null)
const headerRef = ref(null)
const panelRefs = reactive({})
const activeTab = ref('basic')

function assignedCount(cat) {
    return cat.items.filter(i => i.person).length
}
function progressPct(cat) {
    if (!cat.items.length) return 0
    return (assignedCount(cat) / cat.items.length) * 100
}
function confirmEdit(item) {
    item.editing = false
    saveItem(item)
}

const PERSON_COLORS = {
    'Fathur': 'chip--fathur',
    'Dato\' Haikal': 'chip--haikal',
    'Luqman': 'chip--luqman',
    'Aisyah': 'chip--aisyah',
}
const PERSON_EMOJIS = {
    'Fathur': '👑',
    'Dato\' Haikal': '🎩',
    'Luqman': '🎯',
    'Aisyah': '🌸',
}
function personClass(name) { return PERSON_COLORS[name] || 'chip--default' }
function personEmoji(name) { return PERSON_EMOJIS[name] || '😊' }

onMounted(() => {
    ScrollTrigger.create({
        trigger: sectionRef.value, start: 'top 75%',
        onEnter: () => {
            gsap.fromTo(headerRef.value, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8 })
        },
        once: true
    })
})

onBeforeUnmount(() => ScrollTrigger.getAll().forEach(st => st.kill()))
</script>

<style scoped lang="scss">
.bringlist {
    background: linear-gradient(160deg, var(--sand-light) 0%, var(--cream) 100%);
}

.bringlist__tabs {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 40px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.bringlist__tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    border: 2px solid rgba(91, 191, 232, 0.3);
    border-radius: 50px;
    background: white;
    font-family: var(--font-body);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-mid);
    cursor: pointer;
    transition: all 0.25s;
    box-shadow: var(--shadow-xs);

    &:hover {
        border-color: var(--sky);
        color: var(--navy);
        transform: translateY(-2px);
    }

    &--active {
        background: var(--sky);
        border-color: var(--sky);
        color: white;
        box-shadow: var(--shadow-sm), 0 0 20px rgba(91, 191, 232, 0.3);
        transform: translateY(-2px);
    }
}

.bringlist__tab-count {
    background: rgba(0, 0, 0, 0.12);
    border-radius: 50px;
    padding: 1px 8px;
    font-size: 0.75rem;

    .bringlist__tab--active & {
        background: rgba(255, 255, 255, 0.3);
    }
}

.bringlist__panel {
    max-width: 800px;
    margin: 0 auto;
}

.bringlist__progress-wrap {
    margin-bottom: 24px;
}

.bringlist__progress-label {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-light);
    margin-bottom: 8px;
}

.bringlist__progress-bar {
    height: 8px;
    background: rgba(91, 191, 232, 0.15);
    border-radius: 50px;
    overflow: hidden;
}

.bringlist__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sky), var(--forest));
    border-radius: 50px;
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bringlist__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
}

.bringlist__item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 18px;
    flex-wrap: wrap;
}

.bringlist__item-name-wrap {
    flex: 1;
    min-width: 120px;
}

.bringlist__item-name {
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--navy);
    cursor: pointer;

    &:hover {
        color: var(--ocean);
        text-decoration: underline;
    }
}

.bringlist__item-input {
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--navy);
    border: 2px solid var(--sky);
    border-radius: var(--radius-sm);
    padding: 4px 10px;
    outline: none;
    background: var(--sky-pale);
    width: 100%;
}

.bringlist__item-select {
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--text-mid);
    border: 2px solid rgba(91, 191, 232, 0.3);
    border-radius: var(--radius-sm);
    padding: 6px 12px;
    background: white;
    cursor: pointer;
    outline: none;
    max-width: 160px;

    &:focus {
        border-color: var(--sky);
    }
}

.bringlist__person-chip {
    padding: 4px 12px;
    border-radius: 50px;
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 800;
    white-space: nowrap;

    &.chip--fathur {
        background: #FFF0D0;
        color: #8B5E00;
        border: 1.5px solid #F5C518;
    }

    &.chip--haikal {
        background: #E8F0FF;
        color: #1B3A6B;
        border: 1.5px solid #5B8DE8;
    }

    &.chip--luqman {
        background: #E8FFE8;
        color: #1E5C1E;
        border: 1.5px solid #4CAF50;
    }

    &.chip--aisyah {
        background: #FFE8F0;
        color: #8B2040;
        border: 1.5px solid #F06080;
    }

    &.chip--default {
        background: var(--sky-pale);
        color: var(--navy);
        border: 1.5px solid var(--sky);
    }
}

.bringlist__delete {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 6px;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.2s, background 0.2s;

    .bringlist__item:hover & {
        opacity: 1;
    }

    &:hover {
        background: rgba(200, 75, 46, 0.1);
    }
}

.bringlist__add {
    font-size: 0.9rem;
    padding: 12px 28px;
    border: 2px dashed rgba(91, 191, 232, 0.5);
    background: transparent;
    color: var(--ocean);
    box-shadow: none;
    width: 100%;
    justify-content: center;

    &:hover {
        background: var(--sky-pale);
        box-shadow: none;
    }
}

// List transition
.list-fade-enter-active,
.list-fade-leave-active {
    transition: all 0.3s ease;
}

.list-fade-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.list-fade-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}
</style>
