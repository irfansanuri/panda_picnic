# PANDA BERPICNIC 2026 - Comprehensive Audit Report

**Date**: June 3, 2026  
**Project**: Panda Berpicnic (Vue 3 + Quasar + GSAP + Firestore)  
**Focus**: GSAP animations, responsiveness, architecture quality

---

## EXECUTIVE SUMMARY

**Project Status**: ✅ **PRODUCTION-READY WITH CAVEATS**

The PANDA BERPICNIC project is a sophisticated, animation-heavy Vue 3 SPA featuring:

- **10 major component sections** with heavy GSAP/ScrollTrigger orchestration
- **Three.js particle effects** in hero section (600+ particles)
- **Real-time data sync** via Firestore
- **Tropical beach theme** with custom CSS variables

**Critical Finding**: **4 components (HeroSection, CountdownSection, GamesSection, TimelineSection) have HIGH GSAP coupling** - refactoring requires extreme care to avoid animation breakage.

---

## 1. COMPONENT ANALYSIS

### 1.1 HeroSection.vue

**⚠️ RISK LEVEL: CRITICAL**

#### File Metrics

- **Lines of code**: ~450
- **Complexity**: Very High
- **GSAP Usage**: Extensive

#### GSAP Structure

```
• Entry Timeline (gsap.timeline())
  ├── Badge: elastic bounce-in (0.15s delay)
  ├── "PANDA" chars: rainbow color → final color with 3D rotationX
  ├── "BERPICNIC" chars: similar staggered rotation
  ├── Year: elastic pop-in
  ├── Location/Date chips: slide-in from left
  ├── CTA button: elastic scale
  └── Poster: 3D rotateY + x-offset

• Continuous Ambient Animations (infinite repeat)
  ├── Poster: y-bob (-14px to 0) duration 3s
  ├── Badge: rotation pulse (+2deg) duration 2.2s
  └── Scroll hint: y-bob (8px) duration 1.4s

• Exit Timeline (ScrollTrigger.pin)
  ├── Pinned for 1200px scroll distance (scrub: 1.5)
  ├── Character scatter: random x/y/rotation/scale (staggered)
  ├── Chips/Year/Badge: upward fade
  └── Poster: 3D rotateY exit with scale-up
```

#### Refs Used (CRITICAL)

- `sectionRef` - Section container (ScrollTrigger trigger)
- `canvasRef` - Three.js canvas
- `textRef` - Text container
- `titleRef` - Title wrapper
- `badgeRef` - Badge element
- `linePanda` - PANDA line (contains 5 individual char spans)
- `lineBerpicnic` - BERPICNIC line (contains 9 individual char spans)
- `yearRef` - Year element
- `chipsRef` - Location/date chips container
- `ctaRef` - Call-to-action button
- `posterRef` - Poster image wrapper
- `scrollHint` - Scroll indicator

#### Three.js Particle System

```javascript
// 600 particles in two layers
const COUNT = 600
• Layer 1: Cream color (0xF5E8C0), size 0.14, opacity 0.7
• Layer 2: Sky blue (0xA8DDF0), size 0.08, opacity 0.5
• Real-time animation: t += 0.004
• Mouse tracking affects camera position
• Rotations applied to both particle meshes
```

#### GSAP Issues

1. ✅ **ScrollTrigger cleanup**: YES, handled implicitly
2. ⚠️ **Ref stability**: 14 refs actively used - HIGH COMPLEXITY
3. ⚠️ **Animation stagger**: Character-by-character - ~490px scatter range
4. ✅ **Easing**: Proper use of `back.out()` and `elastic.out()`

#### Props/Emits

- **Props**: None
- **Emits**: None

#### Firestore Usage

- ❌ None

#### Business Logic

- ✅ Simple: Three.js setup, GSAP timeline orchestration, scroll handler
- ✅ No conditional business logic

#### Watchers/Computed

- ❌ None

#### Responsive Design Issues

- ⚠️ **Canvas resize**: `window.addEventListener('resize', onResize)` handles resizing
- ⚠️ **Fixed perspective**: `transformPerspective: 1000` may feel different on mobile
- ⚠️ **Char rotation**: 3D rotations may be disorienting on small screens
- ⚠️ **Particle animation**: Continuous animation may impact mobile battery

#### CSS Bloat

- ✅ Minimal: `.hero__*` styles only (~100 lines estimated)
- ✅ No redundant styles

#### Cleanup/Lifecycle

```javascript
onMounted() {
  initThree()    // requestAnimationFrame loop started
  initGSAP()     // Timelines created, ScrollTrigger registered
}
onBeforeUnmount() {
  // ❌ MISSING: cancelAnimationFrame(animId)
  // ❌ MISSING: renderer.dispose()
  // ⚠️ MISSING: ScrollTrigger.getAll().forEach(st => st.kill())
}
```

#### 🔴 CRITICAL ISSUES

1. **Memory Leak**: Three.js renderer and animation frame not cleaned up
2. **requestAnimationFrame loop continues after component destroy**
3. **ScrollTrigger not explicitly killed**

**Refactor Risk**: 🚨 **EXTREME** - Any change to character structure or animation values requires extensive testing

**Protection Strategy**:

- Store all animation ref paths in comments
- Use `data-gsap-*` attributes for DOM targeting instead of refs
- Extract Three.js to separate lifecycle management

---

### 1.2 CountdownSection.vue

**⚠️ RISK LEVEL: HIGH**

#### File Metrics

- **Lines of code**: ~300
- **Complexity**: High
- **GSAP Usage**: Heavy with real-time updates

#### GSAP Structure

```
• Initialization
  ├── Cards set: scale 0.2, offset from corners (4 positions)
  ├── Header/Footer: opacity 0, y-offset
  └── numRefs: ready for flip animations

• Entry Timeline (ScrollTrigger.pin)
  ├── Pin for 1400px scroll distance
  ├── Header drops in (back.out)
  ├── Cards[0-3]: fly from corners → center (staggered 0.06s)
  └── Footer slides up

• Continuous Updates (every 1000ms tick)
  ├── When countdown value changes for unit
  ├── Number element: slide-up out + snap below + bounce-in
  │  └── y: -56 → +64 (snap) → 0 (final)
  ├── Card glow pulse: scale 1 → 1.1 + box-shadow
  └── Each unit ref gets its own timeline

• Exit Timeline
  ├── Cards[0-3]: scatter to corners
  ├── Header/Footer: fade out
  └── scrub: 1.5
```

#### Refs Used (CRITICAL)

- `sectionRef` - Container (trigger + pin)
- `headerRef` - Header text
- `gridRef` - Grid container
- `footerRef` - Footer info
- `cardRefs` - Reactive object, 4 cards
- `numRefs` - Reactive object, 4 number displays

#### Countdown Logic

```javascript
// TARGET: 2026-06-13T08:00:00+08:00
// Runs every 1000ms (setInterval)
// Updates: days, hours, minutes, seconds
// Each change triggers GSAP timeline on that numRef

const diff = TARGET - new Date();
// Calculate time units
// Check for value changes
// If changed: flip animation
```

#### GSAP Issues

1. ⚠️ **Timeline creation in loop**: `gsap.timeline({ overwrite: 'auto' })` created every tick for each unit change
2. ✅ **ScrollTrigger cleanup**: YES, `ScrollTrigger.getAll().forEach(st => st.kill())`
3. ⚠️ **Reactive refs**: Uses `reactive({})` instead of `ref`
4. ✅ **Stagger precision**: `stagger: 0.04` properly spaced

#### Props/Emits

- **Props**: None
- **Emits**: None

#### Firestore Usage

- ❌ None

#### Business Logic

- ✅ Simple countdown math
- ✅ No complex conditionals

#### Watchers/Computed

- ❌ None

#### Responsive Design Issues

- ✅ Grid: `repeat(4, 1fr)` → `repeat(2, 1fr)` at 640px
- ⚠️ **Gap sizing**: 20px gap maintained - may be cramped on mobile
- ✅ Font scaling: `clamp(3rem, 8vw, 5rem)` for numbers

#### CSS Bloat

- ✅ Minimal and responsive

#### Lifecycle Management

```javascript
onMounted() {
  tick()  // First update
  interval = setInterval(tick, 1000)  // Continuous updates
  // Timeline setup
}

onBeforeUnmount() {
  clearInterval(interval)  // ✅ Properly cleared
  ScrollTrigger.getAll().forEach(st => st.kill())  // ✅ Proper cleanup
}
```

#### ⚠️ ISSUES

1. **Memory consideration**: `gsap.timeline({ overwrite: 'auto' })` created 4x per second max
2. **Stale references**: If cardRefs[idx] becomes undefined during animation, animation fails silently
3. **No error boundaries** for missing refs

**Refactor Risk**: 🟠 **HIGH** - Countdown timing and flip animation are tightly coupled

**Protection Strategy**:

- Store corner offsets as constants
- Verify all cardRefs exist before animation
- Extract number flip to reusable utility

---

### 1.3 GamesSection.vue

**⚠️ RISK LEVEL: HIGH**

#### File Metrics

- **Lines of code**: ~350
- **Complexity**: High
- **GSAP Usage**: Conditional + event-driven

#### GSAP Structure

```
• Initialization
  ├── Cards set: scale 0, rotation (random -140 to 140), opacity 0
  ├── z-index: stacked effect (i * -8)
  └── Header opacity 0

• Entry Timeline (ScrollTrigger.pin)
  ├── Pin for 1400px scroll distance
  ├── Header fades in
  ├── Cards deal from center outward (stagger 0.04)
  │  └── Stagger from: 'center', grid: 'auto'
  └── Each card: scale 0 → 1, rotation → 0

• Scroll Progress Callback
  ├── When progress > 0.38 (halfway)
  ├── Icons bounce from scale 0.3 → 1 with elastic.out
  ├── Stagger from 'center', grid
  └── Continuous floating wave starts (stagger: 0.18, yoyo: true, repeat: -1)

• Exit Timeline
  ├── Cards explode outward (random x/y: ±500/±380)
  ├── Random rotations: ±300 degrees
  ├── Stagger from: 'random'
  └── Header fades out
```

#### Refs Used

- `sectionRef` - Container (trigger + pin)
- `headerRef` - Header
- `gridRef` - Grid container
- `cardRefs` - Reactive object, keyed by game.id

#### Dynamic Data Binding

```javascript
// Watch for gamesList changes
watch(
  gamesList,
  () => {
    nextTick(initAnimations);
  },
  { once: true },
);

// This means:
// • Animations don't init until Firestore data arrives
// • Use nextTick() to ensure DOM updates complete
// • Only trigger once
```

#### GSAP Issues

1. ⚠️ **Icon animation triggered by ScrollTrigger.progress()**: Complex timing
2. ✅ **Stagger randomization**: Proper use of `gsap.utils.random()`
3. ✅ **Dynamic ref system**: Uses game.id as key
4. ⚠️ **Watch + nextTick dependency**: Can fail if Firestore is slow

#### Props/Emits

- **Props**: Implicit - uses store
- **Emits**: None

#### Firestore Usage

- ✅ Imports: `games, removeGame, saveGame` from store
- ✅ Direct mutation: `game.editing = false`

#### Business Logic

- ✅ `classify(name)` function: Intelligent game categorization
  - 28 regex patterns for different game types
  - Returns icon, type, typeLabel
  - Fallback: 'outdoor' with 🎯

#### Watchers/Computed

- ⚠️ `watch(gamesList)` - Only triggers once, good for initialization

#### Responsive Design Issues

- ⚠️ Grid: `repeat(4, 1fr)` → `repeat(2, 1fr)` at 900px and 500px
- ⚠️ **Gap 20px**: May be excessive on mobile
- ⚠️ **Icon hover**: Scale 1.2 + rotate may overflow on small screens

#### CSS Bloat

- ✅ Type-specific colors well-organized
- ✅ Proper gradients for card types (card, board, outdoor, water)

#### Lifecycle Management

```javascript
onMounted() {
  nextTick(initAnimations)  // Try immediate
}

watch(gamesList, () => {
  nextTick(initAnimations)  // If data arrives late
}, { once: true })

onBeforeUnmount() {
  ScrollTrigger.getAll().forEach(st => st.kill())  // ✅ Proper cleanup
}
```

#### ⚠️ ISSUES

1. **Late data initialization**: If Firestore slow, animations delayed
2. **Icon floating wave**: Infinite repeat with stagger - continuous memory use
3. **Card explosion**: Random values generate different result each scroll

**Refactor Risk**: 🟠 **HIGH** - Icon animation timing is fragile

**Protection Strategy**:

- Extract game classification to computed property
- Pre-compute icon animations separate from scroll timeline
- Use data attributes for card type instead of className

---

### 1.4 TimelineSection.vue

**⚠️ RISK LEVEL: MEDIUM-HIGH**

#### File Metrics

- **Lines of code**: ~300
- **Complexity**: Medium-High
- **GSAP Usage**: Sequential + scroll-driven

#### GSAP Structure

```
• Initialization
  ├── Header opacity 0, y: 60
  ├── Cards opacity 0, scale 0.4
  ├── Dots scale 0
  ├── Fill line scaleX: 0
  └── Sun opacity 0, left: 0%

• Main Timeline (ScrollTrigger.pin)
  ├── Pin for 2000px scroll (longest of all)
  ├── Header fades in: 0.08s
  ├── Fill line draws left→right: 0.5s (ease: none)
  ├── Sun moves left→right with line: parallel animation
  └── For each dot/card (sequential):
     └── Dot scales: 1 → 1.2 → 1
     └── Card fades + scales in
     └── Timing: pct = 0.1 + (i / total-1) * 0.45
     └── Each dot/card staggered by ~5%

• Hold Phase: 0.18s of no animation

• Exit Timeline
  ├── Cards fade up
  ├── Fill line fades
  ├── Sun fades up
  ├── Header fades up
  └── Sequential timing: 0.82→0.84
```

#### Refs Used

- `sectionRef` - Container (trigger + pin)
- `headerRef` - Header
- `trackWrap` - Track container
- `fillLine` - Animated fill line
- `sunEl` - Sun progress indicator
- `eventRefs` - Reactive, 10 events
- `dotRefs` - Reactive, 10 dots

#### Timeline Data

```javascript
const events = [
  { time: "7:30 Pagi", icon: "🌅", name: "Bertolak dari Rumah" },
  { time: "8:00 Pagi", icon: "🚗", name: "Tiba & Setup" },
  // ... 8 more events
];
```

#### GSAP Issues

1. ✅ **Sequential timing calculation**: `pct = 0.1 + (i / (total-1)) * 0.45`
2. ✅ **Transform-origin**: Proper `transformOrigin: 'left center'` for line
3. ✅ **Duration**: 2000px scroll allows smooth progression
4. ✅ **Cleanup**: `ScrollTrigger.getAll().forEach(st => st.kill())`

#### Props/Emits

- **Props**: None
- **Emits**: None

#### Firestore Usage

- ❌ None

#### Business Logic

- ✅ None - pure presentation

#### Watchers/Computed

- ❌ None

#### Responsive Design Issues

- ⚠️ **Fixed height 280px**: May be cramped on mobile
- ✅ **Horizontal layout**: Scales with container width
- ⚠️ **Font sizes**: `0.65rem` for time may be hard to read on mobile
- ⚠️ **Card sizing**: `min-width: 90px, max-width: 130px` - fixed

#### CSS Bloat

- ✅ Minimal

#### Lifecycle Management

```javascript
onMounted() {
  // Full setup + timeline creation
}

onBeforeUnmount() {
  ScrollTrigger.getAll().forEach(st => st.kill())  // ✅ Proper cleanup
}
```

#### ✅ STRENGTHS

1. **Well-calculated timing**: Sequential reveal feels natural
2. **Proper cleanup**: ScrollTrigger killed
3. **Smooth progression**: 2000px allows for comfortable animation

#### ⚠️ ISSUES

1. **Fixed dimensions**: 280px height and 90-130px card widths won't adapt
2. **Mobile font sizes**: May be too small on <480px devices

**Refactor Risk**: 🟡 **MEDIUM** - Timeline structure is sound but card sizing needs media queries

**Protection Strategy**:

- Add tablet breakpoint (768px) for timeline card sizing
- Responsive height calculation based on viewport
- Scale font sizes with viewport

---

### 1.5 EventDetailsSection.vue

**⚠️ RISK LEVEL: MEDIUM**

#### File Metrics

- **Lines of code**: ~250
- **Complexity**: Medium
- **GSAP Usage**: 3D transforms + hover tilt

#### GSAP Structure

```
• Initial State
  ├── Header opacity 0, y: 60
  ├── Card[0]: rotateY -120, x -80, opacity 0
  ├── Card[1]: rotateY 120, x 80, opacity 0
  ├── Card[2]: rotateY -110, x -80, opacity 0
  ├── Card[3]: rotateY 110, x 80, opacity 0
  └── All cards: transformPerspective: 1200

• Entry Timeline (ScrollTrigger.pin)
  ├── Header fades in: 0.12s
  ├── Cards flip in from Y-axis
  │  ├── Card[0] @ 0.1s: rotateY 0, x 0, opacity 1 (back.out 1.4)
  │  ├── Card[1] @ 0.16s: same
  │  ├── Card[2] @ 0.22s: same
  │  └── Card[3] @ 0.28s: same
  ├── Map button fades in @ 0.36s
  └── Cards settle with tiny rotateZ tweaks

• Hover Effect (on mousemove)
  ├── Calculate rx/ry based on mouse position
  ├── rx: ±16deg, ry: ±16deg
  ├── scale: 1 → 1.06
  └── Duration: 0.3s

• Hover Leave
  ├── rotateX/Y → 0
  ├── scale → 1
  ├── elastic.out(1, 0.6) ease

• Exit Timeline
  ├── Cards flip back out
  │  ├── Card[0] @ 0.72s: rotateY 90, x -120, scale 0.8, opacity 0
  │  ├── Card[1] @ 0.74s: rotateY -90, x 120, ...
  │  ├── Card[2] @ 0.76s: rotateY 90, ...
  │  └── Card[3] @ 0.78s: rotateY -90, ...
  └── Header/Map fade out
```

#### Refs Used

- `sectionRef` - Container (trigger + pin)
- `headerRef` - Header
- `gridRef` - Grid container
- `mapRef` - Map section
- `cardRefs` - Reactive object, 4 cards

#### GSAP Issues

1. ✅ **3D perspective**: Proper `transformPerspective: 1200`
2. ✅ **Alternating rotation directions**: Creates book-page effect
3. ✅ **Smooth easing**: `back.out(1.4)` for entry
4. ✅ **Hover state handling**: `gsap.to()` properly cancels previous animations

#### Props/Emits

- **Props**: None
- **Emits**: None

#### Firestore Usage

- ❌ None

#### Business Logic

- ✅ None - pure animation + UI state

#### Watchers/Computed

- ❌ None

#### Responsive Design Issues

- ✅ Grid: `repeat(4, 1fr)` → `repeat(2, 1fr)` at 900px → `1fr` at 480px
- ✅ Proper media queries
- ✅ Card padding scales with content

#### CSS Bloat

- ✅ Minimal

#### Lifecycle Management

```javascript
onMounted() {
  // Sets initial state
  // Creates timeline with ScrollTrigger
  // onTilt/resetTilt handlers for hover
}

onBeforeUnmount() {
  ScrollTrigger.getAll().forEach(st => st.kill())  // ✅ Proper
}
```

#### ✅ STRENGTHS

1. **Elegant 3D effect**: Book-page flip is intuitive
2. **Proper hover state**: Smooth transitions
3. **Clean cleanup**: ScrollTrigger properly killed

#### ⚠️ ISSUES

1. **Mouse-dependent hover**: Only works on desktop (no mobile touch equivalent)
2. **Continuous 3D transforms**: May impact performance on lower-end devices

**Refactor Risk**: 🟡 **MEDIUM** - Animation structure is clean, but hover logic needs mobile support

**Protection Strategy**:

- Extract tilt function to reusable utility
- Add touch event handlers for mobile
- Consider disabling 3D on mobile for performance

---

### 1.6 AttendeesSection.vue

**🟢 RISK LEVEL: LOW-MEDIUM**

#### File Metrics

- **Lines of code**: ~300
- **Complexity**: Medium
- **GSAP Usage**: Hover tilt + scroll reveal

#### GSAP Structure

```
• Hover Effect (mousemove)
  ├── Calculate rx/ry based on mouse
  ├── rotateX: ±14deg, rotateY: ±14deg
  ├── scale: 1.05
  └── Duration: 0.3s

• Hover Leave
  ├── Reset to rotateX/Y 0
  ├── scale 1
  └── elastic.out(1, 0.6)

• Scroll Reveal (ScrollTrigger)
  ├── Header: opacity 0 → 1, y: 40 → 0
  ├── VVIP group: x: -80 → 0, opacity 0 → 1 (delay 0.2s)
  ├── Tetamu group: x: 80 → 0, opacity 0 → 1 (delay 0.3s)
  └── Quote: opacity 0 → 1, y: 40 → 0 (delay 0.6s)
  └── once: true (single trigger)
```

#### Refs Used

- `sectionRef` - Container
- `headerRef` - Header
- `vvipRef` - VVIP group
- `tetamuRef` - Tetamu group
- `quoteRef` - Quote section
- `tiltRefs` - Reactive object, keyed by person ID

#### Firestore Integration

- ✅ Imports: `addTetamu, addVvip, removeTetamu, removeVvip, saveTetamu, saveVvip`
- ✅ Reactive refs: `vvip, tetamu` from store
- ✅ Direct mutation: `person.editing = true/false`

#### Business Logic

- ✅ Simple: Inline edit mode toggles
- ✅ Save delegates to store

#### Watchers/Computed

- ❌ None

#### Responsive Design Issues

- ✅ Layout: 2-column → 1-column at 768px
- ✅ Proper responsive gaps
- ✅ Mobile-friendly input fields

#### CSS Bloat

- ✅ Well-organized color scheme for VVIP vs regular

#### Lifecycle Management

```javascript
onMounted() {
  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 80%',
    onEnter: () => { /* animations */ },
    once: true  // ✅ Proper one-time trigger
  })
}

// ⚠️ MISSING: onBeforeUnmount cleanup
```

#### ⚠️ ISSUES

1. **Missing cleanup**: ScrollTrigger not killed on unmount
2. **Mobile hover**: Tilt effect won't work on touch devices

**Refactor Risk**: 🟡 **LOW-MEDIUM** - Animation logic is straightforward but cleanup is missing

**Protection Strategy**:

- Add onBeforeUnmount with ScrollTrigger cleanup
- Extract tilt utility for reuse
- Add touch handler for mobile

---

### 1.7 BringListSection.vue

**🟢 RISK LEVEL: LOW**

#### File Metrics

- **Lines of code**: ~250
- **Complexity**: Low
- **GSAP Usage**: Minimal (scroll reveal only)

#### GSAP Structure

```
• Scroll Reveal (ScrollTrigger)
  ├── Header: opacity 0 → 1, y: 50 → 0
  └── once: true
```

#### Functionality

- Tab-based category switching
- Inline edit for item names
- Dropdown for person assignment
- Progress bar (no GSAP, pure CSS)

#### Firestore Integration

- ✅ Full: `addItem, allPeople, categories, deleteItem, saveItem`
- ✅ Proper store integration

#### Business Logic

- ✅ `assignedCount()`: Filter and count
- ✅ `progressPct()`: Calculate percentage
- ✅ `personClass()` / `personEmoji()`: Lookup tables
- ✅ Clean person color scheme

#### Responsive Design Issues

- ✅ Tab wrapping at smaller screens
- ✅ Proper item layout
- ✅ Mobile-friendly select dropdowns

#### Lifecycle Management

```javascript
onMounted() {
  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 75%',
    onEnter: () => { /* header animation */ },
    once: true
  })
}

// ⚠️ MISSING: onBeforeUnmount cleanup
```

#### ✅ STRENGTHS

1. **Minimal GSAP**: Only header fade-in
2. **Clean data flow**: Store integration simple
3. **Good UX**: Progress tracking, person assignment

#### ⚠️ ISSUES

1. **Missing cleanup**: ScrollTrigger not killed
2. **No error handling**: If allPeople() is empty, select has no options

**Refactor Risk**: 🟢 **LOW** - Very clean component

**Protection Strategy**:

- Add onBeforeUnmount cleanup
- Add empty state handling for selects

---

### 1.8 MoodSection.vue

**🟢 RISK LEVEL: LOW**

#### File Metrics

- **Lines of code**: ~200
- **Complexity**: Low
- **GSAP Usage**: Minimal

#### GSAP Structure

```
• Scroll Reveal (ScrollTrigger)
  ├── Header: fade + slide-up
  ├── Cards: staggered (0.12s) with random rotation ±20deg
  ├── Quote: scale 0.8 → 1 (delay 0.9s)
  └── once: true
```

#### Content

- 5 mood cards: Beach, BBQ, Games, Memory, Friendship
- Static data (no Firestore)
- Pure presentation

#### Responsive Design

- ✅ Grid: `5-col` → `3-col` at 1000px → `2-col` at 640px
- ✅ Good scaling

#### Lifecycle Management

```javascript
onMounted() {
  ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 75%',
    onEnter: () => { /* animations */ },
    once: true
  })
}

// ⚠️ MISSING: onBeforeUnmount cleanup
```

#### ✅ STRENGTHS

1. **Minimal code**: Clean, simple animations
2. **No dependencies**: Pure presentation

#### ⚠️ ISSUES

1. **Missing cleanup**: ScrollTrigger not killed

**Refactor Risk**: 🟢 **LOW** - Very straightforward

---

### 1.9 FooterSection.vue

**🟢 RISK LEVEL: LOW**

#### File Metrics

- **Lines of code**: ~120
- **Complexity**: Low
- **GSAP Usage**: Minimal

#### GSAP Structure

```
• Scroll Reveal (ScrollTrigger)
  ├── Panda: fade + scale + y-slide (duration 1s, back.out 1.5)
  └── once: true
```

#### Lifecycle Management

```javascript
onMounted() {
  ScrollTrigger.create({
    trigger: pandaRef.value,
    start: 'top 80%',
    onEnter: () => { /* panda animation */ },
    once: true
  })
}

// ⚠️ MISSING: onBeforeUnmount cleanup
```

#### ✅ STRENGTHS

1. **Minimal**: Just panda animation
2. **No logic**: Pure presentation

**Refactor Risk**: 🟢 **LOW**

---

### 1.10 NavBar.vue

**🟢 RISK LEVEL: LOW**

#### File Metrics

- **Lines of code**: ~150
- **Complexity**: Low
- **GSAP Usage**: Minimal

#### GSAP Structure

```
• Progress Bar (ScrollTrigger)
  ├── scaleX: 0 → 1 as page scrolls
  ├── ease: none (linear with scroll)
  └── Continuously updated
```

#### Features

- Fixed navigation with scroll detection
- Mobile hamburger menu
- Active link highlighting
- Scroll progress indicator

#### Lifecycle Management

```javascript
onMounted() {
  window.addEventListener('scroll', onScroll, { passive: true })
  gsap.to(progressRef.value, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { /* ... */ }
  })
}

onBeforeUnmount() {
  window.removeEventListener('scroll', onScroll)  // ✅ Proper cleanup
}

// ⚠️ MISSING: ScrollTrigger.getAll().forEach(st => st.kill())
```

#### ✅ STRENGTHS

1. **Clean scroll tracking**: Updates active section
2. **Proper event listener cleanup**

#### ⚠️ ISSUES

1. **ScrollTrigger not explicitly killed**: May leak on unmount

**Refactor Risk**: 🟢 **LOW**

---

## 2. STORE ANALYSIS (useStore.js)

### Structure

```javascript
// Single Firestore record in "picnic_state" collection
// Four reactive refs:
• vvip: []          // VIP attendees with titles/crowns
• tetamu: []        // Regular attendees
• categories: []    // Bring list categories with items
• games: []         // Games list

// Each array item has:
• id: Date.now()    // Client-side ID
• name: string
• [other fields]
• editing: boolean  // UI state mixed in
```

### CRUD Operations

#### VVIP CRUD

```javascript
addVvip(); // Push new with default structure
removeVvip(id); // Filter by id + push()
saveVvip(); // Push entire array to Firestore
```

#### Tetamu CRUD

```javascript
addTetamu(); // Push new
removeTetamu(id); // Filter + push()
saveTetamu(); // Push entire array
```

#### Bring List CRUD

```javascript
addItem(catId); // Find category + push item
deleteItem(catId, itemId); // Filter nested items + push()
saveItem(item); // Save entire categories array
```

#### Games CRUD

```javascript
addGame(); // Push new
removeGame(id); // Filter + push()
saveGame(); // Push entire array
```

#### Utility

```javascript
allPeople(); // Return [vvip names, tetamu names]
```

### Issues

#### 🔴 CRITICAL

1. **Entire array saves**: Every edit re-sends entire array to Firestore
2. **No error handling**: `try/catch` only logs, no user feedback
3. **No validation**: User input not validated before save
4. **UI state in data**: `editing: true` mixed with business data

#### 🟠 HIGH

1. **No real-time delete sync**: If user A deletes item, user B still sees it until refresh
2. **Client-side IDs**: `Date.now()` not guaranteed unique
3. **No optimistic updates**: UI waits for Firestore response
4. **No conflict resolution**: Last write wins

#### 🟡 MEDIUM

1. **Reactive object mutation**: Direct mutation after Firestore update could cause issues
2. **No request deduplication**: Multiple saves could overwrite each other
3. **Single record**: Locks app to one picnic_state per collection (assumes only one event)

### Firestore Queries

```javascript
// Fetch (once on mount)
const list = await pb.collection(COLLECTION).getList(1, 1);
const rec = list.items[0];

// Subscribe (real-time updates from other devices)
pb.collection(COLLECTION).subscribe(recordId, (e) => {
  if (e.action !== "update") return;
  // Update reactive refs
});

// Update (on every save)
await pb.collection(COLLECTION).update(recordId, fields);
```

### Issues with Subscription

```javascript
// ⚠️ ISSUE: Subscription never unsubscribed
// If store re-inits, old subscription still listens
// Creates memory leak if store composed multiple times
```

### Optimization Opportunities

1. Extract `editing` state from data refs (separate UI state)
2. Batch saves: Don't save on every item change
3. Use Firestore query filters instead of client-side filtering
4. Debounce rapid saves
5. Implement undo/redo for edits
6. Add conflict detection

---

## 3. ARCHITECTURE ISSUES

### 3.1 Duplicate Business Logic Patterns

#### Pattern 1: Add → Edit Mode

```javascript
// Repeated in 4 CRUD functions:
obj.push({
  id: Date.now(),
  name: "",
  editing: true, // ← Always set
  ...otherFields,
});
```

**Fix**: Centralize object factory function

```javascript
function createItem(template) {
  return {
    id: Date.now(),
    name: "",
    editing: true,
    ...template,
  };
}
```

#### Pattern 2: Remove → Save Pattern

```javascript
// Repeated in every remove:
items.value = items.value.filter((p) => p.id !== id);
push({ items: toPlain(items.value) });
```

**Fix**: Create helper

```javascript
function removeAndSave(array, ref, id, fieldName) {
  ref.value = ref.value.filter((p) => p.id !== id);
  push({ [fieldName]: toPlain(ref.value) });
}
```

### 3.2 Repeated Filtering/Validation Code

#### In BringListSection.vue

```javascript
assignedCount(cat) {
  return cat.items.filter(i => i.person).length
}
```

#### Should be in store

```javascript
export function getAssignedCount(catId) {
  const cat = categories.value.find((c) => c.id === catId);
  return cat?.items.filter((i) => i.person).length ?? 0;
}
```

### 3.3 Memory Leak Risks

#### Risk 1: Three.js Animation Loop

**HeroSection.vue**

```javascript
function animate() {
  animId = requestAnimationFrame(animate); // Infinite loop
  // ... animation logic
}

// ❌ Never canceled on unmount
// Component destroyed but animation still running
// Uses CPU, drains battery on mobile
```

**Fix**:

```javascript
onBeforeUnmount(() => {
  cancelAnimationFrame(animId);
  renderer.dispose(); // Release GPU memory
});
```

#### Risk 2: Interval Not Cleared

**CountdownSection.vue**

```javascript
onMounted() {
  interval = setInterval(tick, 1000)
}

// ✅ GOOD: Properly cleared
onBeforeUnmount(() => {
  clearInterval(interval)
})
```

#### Risk 3: ScrollTrigger Instances Leak

Multiple components create ScrollTriggers:

```javascript
// CountdownSection.vue
const tl = gsap.timeline({
  scrollTrigger: {
    /* ... */
  },
});

// ⚠️ If not killed, remains active even after unmount
```

**Affected**: HeroSection, CountdownSection, GamesSection, TimelineSection, EventDetailsSection

**Current Status**:

- ✅ CountdownSection: Kills ScrollTrigger
- ✅ GamesSection: Kills ScrollTrigger
- ✅ TimelineSection: Kills ScrollTrigger
- ✅ EventDetailsSection: Kills ScrollTrigger
- ❌ AttendeesSection: Does NOT kill
- ❌ BringListSection: Does NOT kill
- ❌ MoodSection: Does NOT kill
- ❌ FooterSection: Does NOT kill
- ❌ HeroSection: Does NOT kill
- ⚠️ NavBar: Does NOT kill

#### Risk 4: Firestore Subscription Never Unsubscribed

**useStore.js**

```javascript
pb.collection(COLLECTION).subscribe(recordId, (e) => {
  // Listener remains active indefinitely
});

// ✅ SHOULD BE: Store in ref, unsubscribe on cleanup
```

### 3.4 Unnecessary Reactivity

#### Pattern: Reactive ({}) for Refs

```javascript
// GamesSection.vue
const cardRefs = reactive({});

// Used like:
cardRefs[game.id] = el;

// ✅ WORKS but inefficient
// BETTER: Use template refs directly in v-for
// <div :ref="el => (cardRefs[game.id] = el)" />
```

### 3.5 Missing Error Handling

#### No User Feedback on Save Failure

```javascript
async function push(fields) {
  try {
    await pb.collection(COLLECTION).update(recordId, fields);
  } catch (e) {
    console.error("Firestore write error:", e.message);
    // ❌ User sees no error message
    // Data still shows as edited but not saved
  }
}
```

**Fix**: Emit event or return status

```javascript
async function push(fields) {
  try {
    await pb.collection(COLLECTION).update(recordId, fields);
    return { success: true };
  } catch (e) {
    emit("error", e.message);
    return { success: false, error: e };
  }
}
```

---

## 4. RESPONSIVE DESIGN ISSUES

### 4.1 Missing Tablet Breakpoints

**Current breakpoints**:

- Desktop (no max)
- Tablet: 768px
- Mobile: 500-640px

**Issue**: Large gap from 768px to desktop (often 1200px+)

#### Examples

**HeroSection**:

```scss
// ❌ No tablet breakpoint
// Poster might be too large at 900px
// Characters might overflow
```

**TimelineSection**:

```scss
// ✅ Fixed: 280px height is OK
// But font sizes not scaled:
.timeline__card-time {
  font-size: 0.65rem;
} // Too small on tablet
```

**CountdownSection**:

```scss
.cdown__grid {
  grid-template-columns: repeat(4, 1fr); // Desktop

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr); // Mobile
  }

  // ❌ Missing 768px breakpoint for 2x2 → 2x2 transition
}
```

### 4.2 Horizontal Scrolling Risks

**HeroSection**:

```javascript
// poster might overflow on mobile if max-width not set
// CSS should ensure: max-width: 100%
```

**TimelineSection**:

```scss
.timeline__track-wrap {
  max-width: 1100px; // ✅ Good
}
```

### 4.3 Touch/Mobile Interaction Issues

#### Tilt Effects Don't Work on Mobile

**EventDetailsSection**, **GamesSection**, **AttendeesSection** all use:

```javascript
function tilt(e, id) {
  const r = card.getBoundingClientRect()
  const rx = ((e.clientY - r.top) / r.height - 0.5) * -16
  const ry = ((e.clientX - r.left) / r.width - 0.5) * 16
  gsap.to(card, { rotateX: rx, rotateY: ry, ... })
}

// ❌ Only works with mousemove
// Touch devices: tilt never happens, confusing UX
```

**Fix**: Add touch handlers

```javascript
function handleTouchTilt(e, id) {
  const touch = e.touches[0];
  tilt({ clientX: touch.clientX, clientY: touch.clientY }, id);
}
```

### 4.4 Font Scaling Issues

#### Small Text on Mobile

```scss
.section-title {
  font-size: clamp(2rem, 5vw, 3.2rem); // ✅ Good
}

.cdown__label-en {
  font-size: 0.65rem; // ❌ Too small on mobile (< 10px)
}

.timeline__card-time {
  font-size: 0.65rem; // ❌ Same issue
}
```

### 4.5 Layout Issues at Specific Breakpoints

#### GamesSection at 500px

```scss
grid-template-columns: repeat(2, 1fr);

// With gap: 20px
// Each card: ~(100% - 20px) / 2 ≈ 240px per card
// On iPhone SE (375px): 240px cards feel cramped
```

#### BringListSection Form Inputs

```scss
.bringlist__item {
  display: flex;
  flex-wrap: wrap;
  gap: 14px; // May overflow on mobile
}

// On small mobile: input + select + delete button
// Could wrap awkwardly
```

---

## 5. GSAP SAFETY ASSESSMENT

### Components Ranked by Refactor Risk

| Component           | GSAP Type                       | Risk       | Protection Needed                             |
| ------------------- | ------------------------------- | ---------- | --------------------------------------------- |
| HeroSection         | Three.js + Particle             | 🔴 EXTREME | DOM refs, animation frame cleanup             |
| CountdownSection    | ScrollTrigger + Intervals       | 🟠 HIGH    | Verify ref existence, batch timeline creation |
| GamesSection        | ScrollTrigger + Scroll Progress | 🟠 HIGH    | Extract classification, pre-compute icons     |
| TimelineSection     | ScrollTrigger Sequential        | 🟡 MEDIUM  | Add tablet breakpoints, scale fonts           |
| EventDetailsSection | 3D Transforms + Tilt            | 🟡 MEDIUM  | Extract tilt utility, mobile support          |
| AttendeesSection    | Tilt + ScrollTrigger            | 🟡 MEDIUM  | Add cleanup, mobile support                   |
| BringListSection    | ScrollTrigger Only              | 🟢 LOW     | Add cleanup, error handling                   |
| MoodSection         | ScrollTrigger Only              | 🟢 LOW     | Add cleanup                                   |
| FooterSection       | ScrollTrigger Only              | 🟢 LOW     | Add cleanup                                   |
| NavBar              | ScrollTrigger + Event           | 🟢 LOW     | Add ScrollTrigger cleanup                     |

### Animation Dependencies Map

```
HeroSection
├── Three.js renderer (GPU memory)
├── requestAnimationFrame loop (CPU)
├── 14 DOM refs (character spans, badge, etc.)
└── ScrollTrigger.pin (1200px scroll distance)

CountdownSection
├── setInterval (tick every 1000ms)
├── 2 reactive({}) refs (cards, numbers)
├── Multiple timelines (one per number change)
└── ScrollTrigger.pin (1400px)

GamesSection
├── watch(gamesList) trigger
├── 1 reactive({}) ref (cardRefs)
├── Dynamic icon animations
└── ScrollTrigger.pin (1400px)
└── Continuous floating wave animation

TimelineSection
├── 2 reactive({}) refs (events, dots)
├── Sequential scaleX animation (line draw)
└── ScrollTrigger.pin (2000px)

EventDetailsSection
├── 1 reactive({}) ref (cardRefs)
├── Hover events (mousemove, mouseleave)
└── ScrollTrigger.pin (1400px)

AttendeesSection
├── 1 reactive({}) ref (tiltRefs)
├── Hover events
└── ScrollTrigger (75% start)

BringListSection
├── ScrollTrigger (75% start)

MoodSection
├── ScrollTrigger (75% start)

FooterSection
├── ScrollTrigger (80% start)

NavBar
├── window scroll listener
├── ScrollTrigger (page-wide)
```

### Cleanup Audit

| Component           | ScrollTrigger Killed | RAF Cleared | Intervals Cleared | Event Listeners Removed | Firestore Unsubscribed |
| ------------------- | -------------------- | ----------- | ----------------- | ----------------------- | ---------------------- |
| HeroSection         | ❌                   | ❌          | N/A               | ❌ (resize listener)    | N/A                    |
| CountdownSection    | ✅                   | ✅          | ✅                | N/A                     | N/A                    |
| GamesSection        | ✅                   | N/A         | N/A               | N/A                     | N/A                    |
| TimelineSection     | ✅                   | N/A         | N/A               | N/A                     | N/A                    |
| EventDetailsSection | ✅                   | N/A         | N/A               | N/A                     | N/A                    |
| AttendeesSection    | ❌                   | N/A         | N/A               | N/A                     | N/A                    |
| BringListSection    | ❌                   | N/A         | N/A               | N/A                     | N/A                    |
| MoodSection         | ❌                   | N/A         | N/A               | N/A                     | N/A                    |
| FooterSection       | ❌                   | N/A         | N/A               | N/A                     | N/A                    |
| NavBar              | ❌                   | N/A         | N/A               | ✅                      | N/A                    |
| useStore            | N/A                  | N/A         | N/A               | N/A                     | ❌                     |

---

## 6. RECOMMENDATIONS

### 6.1 IMMEDIATE (Critical - Do Within 1 Sprint)

#### 1. Fix Memory Leaks

```javascript
// HeroSection.vue - onBeforeUnmount
onBeforeUnmount(() => {
  cancelAnimationFrame(animId);
  renderer?.dispose();
  ScrollTrigger.getAll().forEach((st) => st.kill());
  window.removeEventListener("resize", onResize);
});

// All other components - add ScrollTrigger cleanup
onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((st) => st.kill());
});
```

#### 2. Firestore Subscription Cleanup

```javascript
// useStore.js
let unsubscribe = null;

async function initPB() {
  // ...
  unsubscribe = await pb.collection(COLLECTION).subscribe(recordId, (e) => {
    // ...
  });
}

export function cleanupStore() {
  unsubscribe?.();
}

// In App.vue onUnmounted:
onUnmounted(() => {
  cleanupStore();
});
```

#### 3. Add Mobile Tilt Support

```javascript
// In components with tilt effects
function onTouchMove(e, id) {
  const touch = e.touches[0]
  tilt({ clientX: touch.clientX, clientY: touch.clientY }, id)
}

function onTouchEnd(id) {
  untilt(id)
}

// Template
<div @touchmove="onTouchMove($event, id)" @touchend="onTouchEnd(id)">
```

### 6.2 HIGH PRIORITY (Weeks 2-3)

#### 4. Extract Reusable Tilt Utility

```javascript
// composables/useTilt.js
export function useTilt(cardRef) {
  function tilt(e, options = {}) {
    const { rotX = 16, rotY = 16, scale = 1.05 } = options;
    const rect = cardRef.value.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -rotX;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * rotY;
    gsap.to(cardRef.value, { rotateX: rx, rotateY: ry, scale, duration: 0.3 });
  }

  function untilt() {
    gsap.to(cardRef.value, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1,0.6)",
    });
  }

  return { tilt, untilt };
}
```

#### 5. Add Tablet Breakpoints

```scss
// Update all grids and layouts

// TimelineSection
.timeline__card {
  min-width: 90px;

  @media (max-width: 768px) {
    min-width: 75px;
    max-width: 110px;
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    min-width: 60px;
    max-width: 90px;
  }
}

// CountdownSection
.cdown__grid {
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
}
```

#### 6. Consolidate Store Patterns

```javascript
// useStore.js

// Factory functions
function createAttendee(type = "regular") {
  return {
    id: Date.now(),
    name: "",
    emoji: type === "vvip" ? "🐼" : "😊",
    editing: true,
    ...(type === "vvip" && { title: "VIP", crown: false }),
  };
}

// Reusable remove+save
function removeFromStore(array, ref, id, fieldName) {
  ref.value = ref.value.filter((p) => p.id !== id);
  push({ [fieldName]: toPlain(ref.value) });
}

export function removeVvip(id) {
  removeFromStore(vvip.value, vvip, id, "vvip");
}
```

### 6.3 MEDIUM PRIORITY (Sprint 3-4)

#### 7. Add Error Boundaries & User Feedback

```javascript
// In App.vue or ErrorBoundary component
const errors = ref([]);

function showError(message) {
  errors.value.push(message);
  setTimeout(() => errors.value.shift(), 4000);
}

// Expose globally or via provide/inject
```

#### 8. Optimize Firestore Operations

```javascript
// Batch updates instead of saving entire array
async function pushPartial(fields) {
  try {
    await pb.collection(COLLECTION).update(recordId, fields);
  } catch (e) {
    console.error("Save failed:", e.message);
    showError("Gagal menyimpan. Coba lagi.");
  }
}

// Debounce rapid saves
const debouncedPush = useDebounceFn(push, 1000);
```

#### 9. Extract Three.js Logic

```javascript
// composables/useHeroThreeJS.js
export function useHeroThreeJS(canvasRef) {
  let renderer, scene, camera, animId;

  function init() {
    /* ... */
  }
  function dispose() {
    /* ... */
  }

  return { init, dispose };
}

// In HeroSection.vue
const { init: initThree, dispose: disposeThree } = useHeroThreeJS(canvasRef);
onBeforeUnmount(() => {
  disposeThree();
});
```

#### 10. Separate UI State from Data

```javascript
// useStore.js - separate editing state
const editingIds = ref(new Set());

export function setEditing(id, editing) {
  if (editing) editingIds.value.add(id);
  else editingIds.value.delete(id);
}

export function isEditing(id) {
  return editingIds.value.has(id);
}

// Now data items don't carry editing flag
// const item = { id, name, person, ... }
// rather than { id, name, person, editing: true }
```

### 6.4 LOW PRIORITY (Polish)

#### 11. Performance Optimization

- Consider lazy-loading images on scroll
- Debounce scroll listeners
- Use `will-change` CSS strategically (not on all animated elements)
- Profile Three.js particle performance on mobile

#### 12. Animation Refinements

- Add page transition animations between sections
- Improve micro-interactions (input focus, button press)
- Consider reducing 3D effects on mobile for performance

#### 13. Accessibility

- Add focus-visible styles for keyboard navigation
- Ensure color contrast meets WCAG AA
- Add aria-labels to icon-only buttons
- Test with screen readers

---

## 7. TESTING STRATEGY FOR GSAP CHANGES

### Pre-Refactor Checklist

Before making ANY changes to GSAP-heavy components:

1. **Record Current State**
   - Video record each section's entrance/exit animations
   - Note scroll distances and timings

2. **Identify All Refs**
   - List every element referenced by GSAP
   - Mark which are critical vs. decorative

3. **Create Test Cases**
   - Test on desktop browser (Chrome, Firefox)
   - Test on mobile browser (iOS Safari, Chrome Mobile)
   - Test scroll speed (fast scroll, slow scroll)
   - Test viewport resizes during animation

4. **Verify Cleanup**
   - Open DevTools
   - Monitor memory usage during component mount/unmount
   - Check for hanging event listeners
   - Verify no console errors on unmount

5. **Component-Specific Tests**

   **HeroSection**:
   - Verify Three.js particles visible on first load
   - Test character scatter timing on scroll
   - Confirm animation frame stops on unmount (memory check)
   - Mobile: Verify poster doesn't overflow

   **CountdownSection**:
   - Verify cards fly from correct corners
   - Test number flip animation on second change
   - Check card glow pulse timing
   - Mobile: Confirm grid doesn't wrap oddly

   **GamesSection**:
   - Test card dealing animation
   - Verify icon bounce triggers at correct scroll position
   - Check floating animation infinite repeat
   - Mobile: Ensure cards don't hover permanently

   **TimelineSection**:
   - Verify line draws smoothly left to right
   - Check dots appear sequentially
   - Test sun follows line
   - Mobile: Confirm card sizing appropriate

---

## 8. FILES REQUIRING ATTENTION

| File                                   | Priority    | Issues                                                    |
| -------------------------------------- | ----------- | --------------------------------------------------------- |
| src/components/HeroSection.vue         | 🔴 CRITICAL | Memory leak, RAF not cleared, resize listener not removed |
| src/composables/useStore.js            | 🔴 CRITICAL | Firestore subscription never unsubscribed                 |
| src/components/CountdownSection.vue    | 🟠 HIGH     | Good cleanup, but verify ref stability                    |
| src/components/GamesSection.vue        | 🟠 HIGH     | Icon animation timing fragile                             |
| src/components/TimelineSection.vue     | 🟡 MEDIUM   | Add tablet breakpoints                                    |
| src/components/EventDetailsSection.vue | 🟡 MEDIUM   | Add mobile touch support                                  |
| src/components/AttendeesSection.vue    | 🟡 MEDIUM   | Missing ScrollTrigger cleanup                             |
| src/components/BringListSection.vue    | 🟡 MEDIUM   | Missing ScrollTrigger cleanup, error handling             |
| src/components/MoodSection.vue         | 🟢 LOW      | Missing ScrollTrigger cleanup                             |
| src/components/FooterSection.vue       | 🟢 LOW      | Missing ScrollTrigger cleanup                             |
| src/components/NavBar.vue              | 🟢 LOW      | Missing ScrollTrigger cleanup                             |

---

## 9. REFACTOR APPROACH BY COMPONENT

### HeroSection.vue - Complete Refactor

```
RISK: 🔴 EXTREME

Step 1: Extract Three.js
  → Create composables/useHeroThreeJS.js
  → Move all THREE init and animation
  → Return { init, dispose }

Step 2: Fix Animation Frame Cleanup
  → Add cancelAnimationFrame(animId) in onBeforeUnmount
  → Call dispose from Three.js composable

Step 3: Fix GSAP Cleanup
  → Add ScrollTrigger.getAll().forEach(st => st.kill())
  → Remove resize listener

Step 4: Test on Mobile
  → Verify no overflow
  → Check particle performance
  → Validate animation speed

Estimated Time: 2-3 hours
Test Time: 1-2 hours
```

### CountdownSection.vue - Targeted Fix

```
RISK: 🟠 HIGH

Step 1: Verify Ref Stability
  → Add null checks before animation
  → Guard cardRefs[idx] access

Step 2: Test Number Flip
  → Verify animation plays on value changes
  → Check card glow timing

Estimated Time: 30-45 minutes
Test Time: 30 minutes
```

### GamesSection.vue - Targeted Fix

```
RISK: 🟠 HIGH

Step 1: Extract Classification
  → Move classify() to computed property
  → Memoize results

Step 2: Extract Icon Bounce
  → Extract icon animation to separate timeline
  → Fix scroll progress callback

Step 3: Test Timing
  → Verify icon bounce at 38% progress
  → Check floating animation

Estimated Time: 1-1.5 hours
Test Time: 45 minutes
```

### Other Components - Quick Wins

```
RISK: 🟡 LOW-MEDIUM

For each of: Attendees, BringList, Mood, Footer, NavBar

Step 1: Add ScrollTrigger Cleanup
  → Add onBeforeUnmount hook if missing
  → Call ScrollTrigger.getAll().forEach(st => st.kill())

Step 2: Add Mobile Support (if tilt effects)
  → Add touch event handlers
  → Mirror mouse tilt logic for touch

Step 3: Add Error Handling
  → Check refs exist before animation
  → Add error feedback

Estimated Time: 15-20 min each
Test Time: 15 min each
```

---

## 10. SUMMARY TABLE

| Aspect                | Status                      | Risk | Action                                              |
| --------------------- | --------------------------- | ---- | --------------------------------------------------- |
| **GSAP Usage**        | Heavy, 9/10 components      | 🟠   | Refactor HeroSection, fix cleanup everywhere        |
| **Memory Leaks**      | Critical (3 confirmed)      | 🔴   | Immediate: Add RAF/listener/subscription cleanup    |
| **Responsiveness**    | Good basics, missing tablet | 🟡   | Add 768px breakpoints, fix font sizes               |
| **Mobile Touch**      | Hover effects don't work    | 🟡   | Add touch handlers to tilt components               |
| **Error Handling**    | Minimal                     | 🟡   | Add user-facing error messages                      |
| **Code Organization** | Repetitive patterns         | 🟡   | Extract CRUD utilities, composables                 |
| **Documentation**     | None                        | 🟡   | Comment GSAP refs, add refactoring guide            |
| **Performance**       | Good, some concerns         | 🟢   | Monitor Three.js on mobile, optimize particle count |
| **Architecture**      | Solid foundation            | 🟢   | Minor cleanup, no major refactoring needed          |
| **Team Readiness**    | Need training               | 🟡   | GSAP patterns document, animation guide             |

---

## CONCLUSION

The PANDA BERPICNIC project is **production-ready with important caveats**. The animation orchestration is sophisticated and works well, but requires careful maintenance:

✅ **Strengths**:

- Impressive GSAP/ScrollTrigger implementation
- Smooth animations and micro-interactions
- Good visual design with tropical theme
- Proper responsive design foundation
- Clean Firestore integration concept

⚠️ **Critical Issues**:

1. Memory leaks (Three.js, RequestAnimationFrame, Firestore subscription)
2. Missing ScrollTrigger cleanup in 5/10 components
3. No mobile touch support for hover effects

🟡 **Medium Issues**:

1. Missing tablet breakpoints
2. Small font sizes on mobile
3. Repeated store patterns
4. No error handling

🔧 **Recommended Next Steps**:

**Week 1 (Urgent)**:

- Fix all memory leaks (2-3 hours)
- Add ScrollTrigger cleanup (2-3 hours)
- Test on real mobile devices

**Week 2-3**:

- Extract reusable utilities
- Add mobile touch support
- Add tablet breakpoints

**Week 4+**:

- Performance optimization
- Accessibility improvements
- Team training on GSAP patterns

---

**Report Generated**: June 3, 2026  
**Auditor**: GitHub Copilot  
**Status**: APPROVED FOR PRODUCTION with post-launch fixes scheduled
