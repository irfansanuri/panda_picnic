<template>
    <section class="bringlist section-base" ref="sectionRef">
        <div class="section-inner">
            <div class="text-center" ref="headerRef">
                <span class="section-label">🎒 Senarai Bawa</span>
                <h2 class="section-title">Siapa Bawa Apa? 🧺</h2>
                <div class="wave-divider wave-divider-center"></div>
                <p class="section-subtitle">Klik nama untuk edit, pilih siapa yang bertanggungjawab (boleh lebih dari seorang)</p>
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

                <!-- Items (Draggable) -->
                <div class="bringlist__list" @drop="onDrop(cat.id, $event)" @dragover.prevent
                    @dragenter.prevent>
                    <transition-group name="list-fade" tag="div" class="bringlist__list-inner">
                        <div v-for="(item, index) in cat.items" :key="item.id" class="bringlist__item tropical-card"
                            :data-item-id="item.id"
                            draggable="true" @dragstart="onDragStart(cat.id, index, $event)"
                            @dragend="onDragEnd" @dragover.prevent @dragenter.prevent
                            :class="{ 'bringlist__item--dragging': dragState.dragging && dragState.catId === cat.id && dragState.itemId === item.id }">

                            <div class="bringlist__item-main">
                                <!-- Drag handle (subtle) -->
                                <div class="bringlist__drag-handle" :title="dragState.dragging ? 'Angkat item ini' : 'Tekan dan seret untuk susun'">
                                    ≡
                                </div>

                                <!-- Name (editable) -->
                                <div class="bringlist__item-name-wrap">
                                    <input v-if="item.editing" v-model="item.name" class="bringlist__item-input"
                                        @keyup.enter="confirmEdit(item)" @blur="confirmEdit(item)" autofocus />
                                    <span v-else class="bringlist__item-name" @click="item.editing = true">
                                        {{ item.name }}
                                    </span>
                                </div>

                                <div class="bringlist__item-actions">
                                    <!-- Dropdown for selecting people -->
                                    <select class="bringlist__item-select"
                                        @change="e => { if (e.target.value) { addPerson(item, e.target.value); e.target.value = '' } }">
                                        <option value="">— Pilih —</option>
                                        <option v-for="p in availablePeople(item)" :key="p" :value="p">{{ p }}</option>
                                    </select>

                                    <!-- Delete -->
                                    <button class="bringlist__delete" @click="deleteItem(cat.id, item.id)"
                                        title="Padam">🗑️</button>
                                </div>
                            </div>

                            <!-- Assigned people chips (separate row) -->
                            <div v-if="(item.people || []).length > 0" class="bringlist__people-chips">
                                <div v-for="person in item.people" :key="person" class="bringlist__person-chip"
                                    :class="personClass(person)">
                                    {{ personEmoji(person) }} {{ person }}
                                    <button class="bringlist__person-remove" @click.stop="removePerson(item, person)"
                                        title="Buang">✕</button>
                                </div>
                            </div>
                        </div>
                    </transition-group>
                </div>

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
import { addItem, allPeople, categories, deleteItem, reorderItems, saveItem } from 'src/composables/useStore.js'
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'

const sectionRef = ref(null)
const headerRef = ref(null)
const panelRefs = reactive({})
const activeTab = ref('basic')

const dragState = reactive({
    dragging: false,
    catId: null,
    itemId: null,
    fromIndex: null,
})

function assignedCount(cat) {
    return cat.items.filter(i => i.people && Array.isArray(i.people) && i.people.length > 0).length
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

function availablePeople(item) {
    // Show only people not already assigned to this item
    const assignedPeople = item.people || []
    return allPeople().filter(p => !assignedPeople.includes(p))
}

function addPerson(item, person) {
    if (!item.people) {
        item.people = []
    }
    if (person && !item.people.includes(person)) {
        item.people.push(person)
        saveItem(item)
    }
}

function removePerson(item, person) {
    if (!item.people) return
    item.people = item.people.filter(p => p !== person)
    saveItem(item)
}

// Drag and drop handlers
function onDragStart(catId, index, event) {
    dragState.dragging = true
    dragState.catId = catId
    dragState.fromIndex = index
    dragState.itemId = categories.value.find(c => c.id === catId)?.items[index]?.id

    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/html', event.target.innerHTML)
}

function onDragEnd(event) {
    dragState.dragging = false
}

function onDrop(catId, event) {
    event.preventDefault()
    if (dragState.catId !== catId || dragState.fromIndex === null) return

    const cat = categories.value.find(c => c.id === catId)
    if (!cat) return

    const dropTarget = event.target.closest('.bringlist__item')
    if (!dropTarget) return

    const targetItemId = parseInt(dropTarget.dataset.itemId)
    const toIndex = cat.items.findIndex(item => item.id === targetItemId)
    if (toIndex === -1) return

    // Reorder items
    const items = cat.items
    const [movedItem] = items.splice(dragState.fromIndex, 1)
    items.splice(toIndex, 0, movedItem)

    reorderItems(catId, items)
    dragState.fromIndex = null
}

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
    margin-bottom: 20px;
    min-height: 60px;
    background: transparent;
}

.bringlist__list-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
}

.bringlist__item {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 14px 18px;
    cursor: grab;
    transition: all 0.2s;
    border: 2px solid transparent;

    &:active {
        cursor: grabbing;
    }

    &--dragging {
        opacity: 0.6;
        transform: scale(0.95);
        border-color: var(--sky);
        background: rgba(91, 191, 232, 0.1);
    }
}

.bringlist__item-main {
    display: flex;
    align-items: center;
    gap: 12px;
}

.bringlist__drag-handle {
    flex-shrink: 0;
    font-size: 0.7rem;
    color: var(--text-light);
    opacity: 0;
    transition: opacity 0.2s;
    user-select: none;
    cursor: grab;
    letter-spacing: 2px;

    .bringlist__item:hover & {
        opacity: 0.5;
    }
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

.bringlist__item-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
}

.bringlist__people-chips {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    align-items: center;
    margin-left: 22px;
}

.bringlist__person-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 50px;
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 800;
    white-space: nowrap;
    position: relative;
    transition: all 0.2s;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

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

.bringlist__person-remove {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.65rem;
    padding: 0 2px;
    color: inherit;
    opacity: 0.6;
    transition: opacity 0.2s;
    margin-left: 2px;

    &:hover {
        opacity: 1;
    }
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
    transition: all 0.2s;
    flex-shrink: 0;
    min-width: 130px;

    &:hover {
        border-color: var(--sky);
        background: var(--sky-pale);
    }

    &:focus {
        border-color: var(--sky);
        box-shadow: 0 0 0 3px rgba(91, 191, 232, 0.2);
    }
}

.bringlist__delete {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    padding: 6px;
    border-radius: 50%;
    opacity: 0.75;
    transition: opacity 0.2s, background 0.2s;
    flex-shrink: 0;

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

// Responsive
@media (max-width: 768px) {
    .bringlist__item {
        gap: 8px;
        padding: 12px 14px;
    }

    .bringlist__item-main {
        display: grid;
        grid-template-columns: 16px 1fr;
        grid-template-areas:
            'drag name'
            'actions actions';
        row-gap: 8px;
        column-gap: 8px;
    }

    .bringlist__drag-handle {
        grid-area: drag;
        opacity: 0.5;
        align-self: center;
    }

    .bringlist__item-name-wrap {
        grid-area: name;
        min-width: 0;
    }

    .bringlist__item-actions {
        grid-area: actions;
        justify-content: flex-end;
        width: 100%;
    }

    .bringlist__person-chip {
        font-size: 0.7rem;
        padding: 3px 6px;
    }

    .bringlist__people-chips {
        margin-left: 0;
    }

    .bringlist__item-select {
        min-width: 120px;
    }
}
</style>
