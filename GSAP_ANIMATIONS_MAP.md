# PANDA BERPICNIC - GSAP Animations Reference Map

**Purpose**: Track every GSAP timeline, ref dependency, and animation target for safe refactoring

---

## 1. HEROSECTION - DETAILED ANIMATION MAP

### Component Location

`src/components/HeroSection.vue` - Lines 1-450

### Refs (14 total)

| Ref Name        | DOM Element              | Used By               | Animation Type            | Risk |
| --------------- | ------------------------ | --------------------- | ------------------------- | ---- |
| `sectionRef`    | `<section>`              | ScrollTrigger trigger | Pin target                | 🟡   |
| `canvasRef`     | `<canvas>`               | Three.js renderer     | Frame target              | 🔴   |
| `textRef`       | `.hero__text`            | Container only        | -                         | 🟢   |
| `titleRef`      | `.hero__title`           | Parent container      | -                         | 🟢   |
| `badgeRef`      | `.hero__badge`           | Badge animations      | Scale, rotate, opacity    | 🟠   |
| `linePanda`     | `.hero__title-panda`     | Character selector    | Stagger source            | 🔴   |
| `lineBerpicnic` | `.hero__title-berpicnic` | Character selector    | Stagger source            | 🔴   |
| `yearRef`       | `.hero__year-wrap`       | Year animation        | Scale, rotate             | 🟠   |
| `chipsRef`      | `.hero__chips`           | Chips container       | Children source           | 🟠   |
| `ctaRef`        | `.hero__cta`             | CTA button            | Magnet effect + animation | 🔴   |
| `posterRef`     | `.hero__poster-wrap`     | Poster animation      | 3D rotateY, ambient bob   | 🟠   |
| `scrollHint`    | `.hero__scroll-hint`     | Scroll indicator      | Ambient animation         | 🟡   |

### Three.js Setup

```javascript
// CRITICAL: Runs every animation frame, must be cleaned up
function initThree() {
  // Canvas: window.innerWidth × window.innerHeight
  // Scene: THREE.Scene with fog
  // Camera: PerspectiveCamera (70°, aspect, z=18)
  // Renderer: WebGLRenderer, pixel ratio capped at 2
  // Particles: 600 total (2 layers × 300)

  // ANIMATION LOOP:
  animId = requestAnimationFrame(animate); // ← NEVER CANCELED!

  // Updates every frame:
  // 1. Particle Y position (constant fall)
  // 2. Particle X position (sine wave)
  // 3. Reset particles at bottom to top
  // 4. Rotate both particle meshes
  // 5. Track mouse position
  // 6. Update camera position based on mouse
}
```

### GSAP Timelines

#### Timeline 1: ENTRY (Immediate on mount)

```
Name: entry = gsap.timeline()
Type: Sequential animations
Duration: ~1.6 seconds total
Scrub: None (plays immediately)

0.15s  → badgeRef: elastic bounce-in
         from: { opacity: 0, scale: 0.4, rotation: -12, y: -20 }
         to: { opacity: 1, scale: 1, rotation: 0, y: 0 }
         ease: elastic.out(1, 0.45)

0.40s  → linePanda (5 char spans):
         from: { opacity: 0, y: 120, rotationX: -90,
                 color: rainbow[i], transformPerspective: 500 }
         to: { opacity: 1, y: 0, rotationX: 0, color: #1B3A6B }
         stagger: 0.09s between chars
         ease: back.out(3)

0.70s  → lineBerpicnic (9 char spans):
         from: { opacity: 0, y: 90, rotationX: -80,
                 color: rainbow[i], transformPerspective: 500 }
         to: { opacity: 1, y: 0, rotationX: 0, color: #C84B2E }
         stagger: 0.07s
         ease: back.out(2.5)

0.98s  → yearRef:
         from: { opacity: 0, scale: 0.4, rotation: -8 }
         to: { opacity: 1, scale: 1, rotation: 0 }
         ease: elastic.out(1, 0.4)

1.08s  → chipItems (children of chipsRef):
         from: { opacity: 0, x: -70, rotation: -5 }
         to: { opacity: 1, x: 0, rotation: 0 }
         stagger: 0.14s
         ease: back.out(2)

1.28s  → ctaRef:
         from: { opacity: 0, scale: 0.6, y: 30 }
         to: { opacity: 1, scale: 1, y: 0 }
         ease: elastic.out(1, 0.45)

0.35s  → posterRef (parallel with entry):
         from: { opacity: 0, rotateY: 90, x: 130, transformPerspective: 1000 }
         to: { opacity: 1, rotateY: 0, x: 0 }
         ease: power3.out

1.45s  → scrollHint:
         from: { opacity: 0, y: 10 }
         to: { opacity: 1, y: 0 }
```

#### Timeline 2: CONTINUOUS AMBIENT (During hold)

```
Infinite repeat, starts after entry completes:

posterRef:
  animation: y-bob from -14px to 0px
  duration: 3s
  repeat: -1 (infinite)
  yoyo: true
  ease: sine.inOut
  delay: 1.6s

badgeRef:
  animation: rotation from 0° to +2° to 0°
  duration: 2.2s
  repeat: -1
  yoyo: true
  ease: sine.inOut
  delay: 1s

scrollHint:
  animation: y-bob from 0 to 8px to 0
  duration: 1.4s
  repeat: -1
  yoyo: true
  ease: sine.inOut
  delay: 1.8s
```

#### Timeline 3: EXIT (ScrollTrigger pinned)

```
Type: ScrollTrigger + scrub
Trigger: sectionRef
Pin: true
Scrub: 1.5 (linked to scroll)
Start: top top
End: +=1200px
anticipatePin: 1

Timeline progression (0 → 1):

0%→60% → posterRef (breathing):
  Subtle up/down: y -16px → 0px → -16px
  Creates alive effect during hold

60%→100% → CHARACTER SCATTER (exit phase):
  allChars (linePanda + lineBerpicnic spans):
    from: { current position }
    to: { x: random(-500, 500),
          y: random(-350, 350),
          rotation: random(-540, 540),
          scale: random(0, 2),
          opacity: 0 }
    stagger: { each: 0.018, from: 'random' }
    duration: 0.38s

60%→80% → UPPER ELEMENTS EXIT:
  chipItems + yearRef + badgeRef:
    to: { y: -120, opacity: 0 }
    stagger: 0.04s
    duration: 0.22s

62%→95% → POSTER FINAL EXIT:
  posterRef:
    from: { rotateY: 0, x: 0, scale: 1, opacity: 1 }
    to: { rotateY: -90, x: 180, scale: 1.15, opacity: 0 }
    duration: 0.32s

62%→75% → SCROLL HINT FADE:
  scrollHint:
    to: { opacity: 0 }
    duration: 0.12s
```

### Magnet CTA Button (Hover Interactive)

```javascript
Trigger: ctaRef @mousemove
onCtaMagnet(e):
  Calculate distance from center:
    dx = (e.clientX - center.x) * 0.38
    dy = (e.clientY - center.y) * 0.38

  gsap.to(ctaRef, {
    x: dx,
    y: dy,
    duration: 0.3,
    ease: 'power2.out',
    overwrite: 'auto'
  })

Trigger: ctaRef @mouseleave
onCtaLeave():
  gsap.to(ctaRef, {
    x: 0,
    y: 0,
    duration: 0.7,
    ease: 'elastic.out(1, 0.4)',
    overwrite: 'auto'
  })
```

### Critical Dependencies

```
Component renders →
  ✓ Three.js initializes (RAF loop starts)
  ✓ Entry timeline plays
  ✓ Ambient animations start
  ✓ ScrollTrigger registers

Component unmounts →
  ✓ AnimationFrame MUST cancel (currently missing!)
  ✓ Renderer MUST dispose (currently missing!)
  ✓ Window resize listener MUST remove (currently missing!)
  ✓ ScrollTrigger MUST kill (currently missing!)
```

### What Could Break

```
🔴 CRITICAL:
- If linePanda selector doesn't find 5 char spans → stagger fails
- If lineBerpicnic selector doesn't find 9 char spans → stagger fails
- If canvasRef is null → Three.js crashes
- If RAF loop not canceled → battery drain, CPU maxed

🟠 HIGH:
- If posterRef moves in DOM → animation targets wrong element
- If badgeRef structure changes → animation fails silently
- If chipsRef children count changes → stagger spacing wrong
- If window resizes during exit animation → perspective breaks

🟡 MEDIUM:
- If scroll speed changes dramatically → timeline feels jarring
- If device too slow → particle animation stutters
- If touch used → magnet CTA works but button doesn't magnet
```

---

## 2. COUNTDOWNSECTION - ANIMATION MAP

### Component Location

`src/components/CountdownSection.vue` - Lines 1-300

### Refs (6 total)

| Ref             | DOM Element                  | Type                  | Risk |
| --------------- | ---------------------------- | --------------------- | ---- |
| `sectionRef`    | `<section>`                  | ScrollTrigger trigger | 🟡   |
| `headerRef`     | `.cdown__header`             | Fade-in target        | 🟢   |
| `gridRef`       | `.cdown__grid`               | Card source           | 🟢   |
| `footerRef`     | `.cdown__footer`             | Fade-in target        | 🟢   |
| `cardRefs[0-3]` | `.cdown__card` (4 cards)     | Transform targets     | 🔴   |
| `numRefs[key]`  | `.cdown__number` (4 numbers) | Flip animation target | 🔴   |

### Timeline Structure

#### Main Timeline (ScrollTrigger)

```
Trigger: sectionRef
Pin: true
Scrub: 1.5
Start: top top
End: +=1400px
anticipatePin: 1

0.00-0.12s → headerRef fade in
            from: { opacity: 0, y: -80 }
            to: { opacity: 1, y: 0 }

0.10-0.38s → cardRefs[0-3] staggered entrance
            From corners (4 different start positions):
            Card[0] (top-left):
              from: { x: -500, y: -350, rotation: -60,
                      opacity: 0, scale: 0.2 }
              to: { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 }
              delay: 0.1s, duration: 0.28s, ease: back.out(1.8)

            Card[1] (top-right):
              Similar but x: +500, rotation: +60
              delay: 0.16s

            Card[2] (bottom-left):
              Similar but y: +350, rotation: +45
              delay: 0.22s

            Card[3] (bottom-right):
              Similar but x: +500, y: +350, rotation: -45
              delay: 0.28s

0.35-0.45s → footerRef fade in
            from: { opacity: 0, y: 80 }
            to: { opacity: 1, y: 0 }
            delay: 0.35s

0.45-0.72s → HOLD (nothing animates)

0.72-0.98s → EXIT: cards scatter back to corners
            Card[0]: x: -400, y: -280, rotation: -55
            Card[1]: x: +400, y: -280, rotation: +55
            Card[2]: x: -400, y: +280, rotation: +40
            Card[3]: x: +400, y: +280, rotation: -40
            opacity: 0, scale: 0.3
            Sequential delays: 0.72, 0.74, 0.76, 0.78s

0.72-0.92s → headerRef + footerRef exit
            headerRef: y: -100, opacity: 0
            footerRef: y: +100, opacity: 0
            delay: 0.72s
```

### Number Flip Animation (Every Second)

```javascript
// Triggered in tick() when countdown value changes
// Created every 1000ms for each unit that changed

Unit updates checked: days, hours, minutes, seconds

For each changed unit:
  Create gsap.timeline({ overwrite: 'auto' })

  numRefs[key] animation:
    Step 1 (0.18s): Slide up & fade
      y: 0 → -56
      opacity: 1 → 0
      scale: 1 → 0.75
      ease: power3.in

    Step 2 (instant): Snap below
      y: -56 → +64
      scale: 0.75 → 1.3
      (set, not animated)

    Step 3 (0.38s): Bounce back in
      y: +64 → 0
      opacity: 0 → 1
      scale: 1.3 → 1
      ease: back.out(3)

  Card glow pulse (parallel):
    Step 1: Pulse out
      scale: 1 → 1.1
      boxShadow: 0 4px 12px → 0 0 30px rgba(91,191,232,0.6)
      duration: 0.15s, ease: power2.out

    Step 2: Spring back
      scale: 1.1 → 1
      boxShadow: back to normal
      duration: 0.5s, ease: elastic.out(1, 0.4)
```

### Critical Dependencies

```
✓ setInterval(tick, 1000) runs during component lifetime
✓ tick() checks all 4 time units for changes
✓ If numRefs[key] doesn't exist when value changes → animation fails
✓ cardRefs must exist for glow pulse (currently can fail silently)
```

### What Could Break

```
🔴 If cardRefs[idx] undefined → glow animation skipped (no error)
🟠 If numRefs[key] undefined → flip animation fails
🟠 If scroll is very fast → card entrance compressed
🟡 If interval creates multiple flip animations → performance hit
```

---

## 3. GAMESSECTION - ANIMATION MAP

### Component Location

`src/components/GamesSection.vue` - Lines 1-350

### Refs (2 + dynamic)

| Ref                 | Type                  | Risk |
| ------------------- | --------------------- | ---- |
| `sectionRef`        | ScrollTrigger trigger | 🟡   |
| `headerRef`         | Fade target           | 🟢   |
| `gridRef`           | Icon source           | 🟢   |
| `cardRefs[game.id]` | Transform target      | 🔴   |

### Timeline Structure

#### Initial Setup

```javascript
// On mount, set initial state:
cardRefs.forEach((card, i) => {
  gsap.set(card, {
    scale: 0, // collapsed
    rotation: gsap.utils.random(-140, 140), // shuffled deck effect
    opacity: 0,
    z: i * -8, // stacking effect
    transformPerspective: 900,
  });
});

gsap.set(headerRef, { opacity: 0, y: 60 });
```

#### Main Timeline (ScrollTrigger)

```
Trigger: sectionRef
Pin: true
Scrub: 1.5
Start: top top
End: +=1400px
anticipatePin: 1

0.0-0.1s → headerRef fade in

0.1-0.36s → Card "deal" animation (center → outward)
           Cards animate from scale 0 → 1
           rotation random → 0
           opacity 0 → 1
           stagger: each 0.04s, from: 'center', grid: 'auto'
           ease: back.out(2)

0.36-0.72s → HOLD + SCROLL PROGRESS CALLBACK

At progress 0.38 (≈ 50% of scroll):
  onUpdate callback triggers ONCE (iconBounced flag):

    Icons (from gridRef):
      from: { scale: 0.3, rotation: -30, opacity: 0 }
      to: { scale: 1, rotation: 0, opacity: 1 }
      stagger: each 0.07s, from: 'center', grid: 'auto'
      duration: 0.8s
      ease: elastic.out(1.1, 0.4)

    After icons bounce (delay 0.9s):
      Continuous floating wave:
        y: -7 → 7 (yoyo)
        duration: 1.6s
        stagger: each 0.18s, from: 'random', yoyo: true, repeat: -1
        ease: sine.inOut

0.72-1.0s → EXIT: cards explode
           Cards scatter in all directions:
             x: gsap.utils.random(-500, 500)
             y: gsap.utils.random(-380, 380)
             rotation: gsap.utils.random(-300, 300)
             scale: 0
             opacity: 0
           stagger: each 0.025s, from: 'random'
           duration: 0.3s

           Header exits:
             opacity: 0
             y: -70
             duration: 0.2s
             delay: 0.72s
```

### Watch Pattern

```javascript
// Games might not be loaded when component mounts
// PocketBase fetch can be slow

watch(
  gamesList,
  () => {
    nextTick(initAnimations);
  },
  { once: true },
);

// Means: Animation doesn't start until gamesList updates
// If PocketBase slow: cards don't appear until data arrives
// Good pattern, but could feel laggy on slow connection
```

### What Could Break

```
🔴 If gridRef doesn't have `.games__card-icon` elements → icon bounce fails
🟠 If gamesList is empty → cardRefs might be wrong indices
🟠 If icon bounce happens early → can interrupt card deal animation
🟡 If scroll speed varies → card exit explosion feels inconsistent
```

---

## 4. TIMELINEECTION - ANIMATION MAP

### Component Location

`src/components/TimelineSection.vue` - Lines 1-300

### Refs (7 total)

| Ref              | DOM Element                    | Type                  | Risk |
| ---------------- | ------------------------------ | --------------------- | ---- |
| `sectionRef`     | `<section>`                    | ScrollTrigger trigger | 🟡   |
| `headerRef`      | `.timeline__header`            | Fade target           | 🟢   |
| `trackWrap`      | `.timeline__track-wrap`        | Container             | 🟢   |
| `fillLine`       | `.timeline__fill`              | Animated line         | 🔴   |
| `sunEl`          | `.timeline__sun`               | Sun indicator         | 🔴   |
| `eventRefs[0-9]` | `.timeline__event` (10 events) | Position target       | 🟢   |
| `dotRefs[0-9]`   | `.timeline__dot` (10 dots)     | Scale target          | 🔴   |

### Timeline Structure

#### Main Timeline (ScrollTrigger)

```
Trigger: sectionRef
Pin: true
Scrub: 1.5
Start: top top
End: +=2000px (LONGEST SCROLL DISTANCE)
anticipatePin: 1

0.0-0.08s → headerRef fade in
           from: { opacity: 0, y: 60 }
           to: { opacity: 1, y: 0 }

0.1-0.55s → fillLine draws left to right
           from: { scaleX: 0, transformOrigin: 'left center' }
           to: { scaleX: 1 }
           ease: none (linear with scroll)

           Parallel: sunEl moves left to right
           from: { opacity: 0, left: 0% }
           to: { opacity: 1, left: 95% }
           ease: none (parallel with line)

0.1-0.55s → Sequential dot/card reveals
           For each event (i=0 to 9):
             pct = 0.1 + (i / 9) * 0.45

             At pct (beginning):
               Dot scale in:
                 scale: 0 → 1.2 (0.04s)
               Then reset:
                 scale: 1.2 → 1 (0.03s)

             At pct + 0.02 (slightly after):
               Card fade + scale:
                 opacity: 0 → 1
                 scale: 0.4 → 1
                 duration: 0.05s
                 ease: back.out(2)

           Result: Dots pop, then cards appear right after

0.55-0.72s → HOLD (nothing animates)

0.82-1.0s → EXIT: elements fade out
           Cards fade up:
             opacity: 1 → 0
             y: 0 → 60
             stagger: 0.02s
             duration: 0.2s

           Fill line fades:
             opacity: 1 → 0
             duration: 0.15s
             delay: 0.84s

           Sun fades up:
             opacity: 1 → 0
             y: 0 → -50
             duration: 0.15s
             delay: 0.84s

           Header fades up:
             opacity: 1 → 0
             y: 0 → -60
             duration: 0.15s
             delay: 0.84s
```

### Critical Dependencies

```
✓ Events array has exactly 10 items
✓ eventRefs and dotRefs must have all 10 indices
✓ Sequential timing calculation: pct = 0.1 + (i / 9) * 0.45
  - i=0: pct=0.1 (10% through animation)
  - i=9: pct=0.55 (55% through animation)
  - Spread over 45% of timeline
```

### What Could Break

```
🔴 If events array count changes → pct calculation breaks
🟠 If dotRefs[i] missing → dot doesn't appear (no error)
🟠 If eventRefs[i] missing → card doesn't appear
🟡 If scroll goes very fast → dots/cards appear all at once
```

---

## 5. EVENTDETAILSSECTION - ANIMATION MAP

### Component Location

`src/components/EventDetailsSection.vue` - Lines 1-250

### Refs (5 total)

| Ref             | Type                  | Risk |
| --------------- | --------------------- | ---- |
| `sectionRef`    | ScrollTrigger trigger | 🟡   |
| `headerRef`     | Fade target           | 🟢   |
| `gridRef`       | Card container        | 🟢   |
| `mapRef`        | Map button target     | 🟢   |
| `cardRefs[0-3]` | 3D flip target        | 🔴   |

### Tilt Effect (Hover)

```javascript
function onTilt(e, i):
  Calculate mouse position relative to card:
    rect = card.getBoundingClientRect()
    rx = ((e.clientY - top) / height - 0.5) * -16
    ry = ((e.clientX - left) / width - 0.5) * 16

  gsap.to(card, {
    rotateX: rx,        // ±16 degrees
    rotateY: ry,        // ±16 degrees
    transformPerspective: 700,
    scale: 1.06,
    duration: 0.3
  })

function resetTilt(i):
  gsap.to(cardRefs[i], {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    duration: 0.5,
    ease: 'elastic.out(1, 0.6)'
  })
```

### Main Timeline (ScrollTrigger)

```
Trigger: sectionRef
Pin: true
Scrub: 1.5
Start: top top
End: +=1400px
anticipatePin: 1

Initial state (set on mount):
  headerRef: opacity 0, y 60
  Card[0]: rotateY -120, x -80, opacity 0, transformPerspective 1200
  Card[1]: rotateY 120, x 80, opacity 0
  Card[2]: rotateY -110, x -80, opacity 0
  Card[3]: rotateY 110, x 80, opacity 0
  mapRef: opacity 0, y 40

0.0-0.12s → headerRef fade in

0.1-0.38s → Cards flip in (Y-axis rotation like book pages)
           Card[0] @ 0.1:
             rotateY: -120 → 0
             x: -80 → 0
             opacity: 0 → 1
             duration: 0.26s
             ease: back.out(1.4)

           Card[1] @ 0.16: (same but from +120°)
           Card[2] @ 0.22: (rotateY -110)
           Card[3] @ 0.28: (rotateY +110)

0.36-0.50s → Cards settle with tiny self-right tweaks
           Each card gets minor rotateZ:
             Card[0]: -1.5° @ 0.42
             Card[1]: +1.5° @ 0.44
             Card[2]: -1.2° @ 0.46
             Card[3]: +1.2° @ 0.48
           Then all return to 0°

0.36-0.46s → Map button fades in

0.46-0.72s → HOLD

0.72-0.98s → EXIT: Cards flip back out
           Card[0] @ 0.72: rotateY 0 → 90, x 0 → -120, opacity 1 → 0
           Card[1] @ 0.74: rotateY 0 → -90, x 0 → 120, ...
           Card[2] @ 0.76: rotateY 0 → 90, ...
           Card[3] @ 0.78: rotateY 0 → -90, ...
           scale: 1 → 0.8
           duration: 0.2s each

           Header + Map exit @ 0.74:
             opacity: 1 → 0
             y: 0 → ±80
             duration: 0.15s
```

### What Could Break

```
🔴 Hover tilt doesn't work on mobile/touch (no mousemove)
🟠 If scroll is very fast → flip animation feels compressed
🟡 3D perspective might not render on some devices
```

---

## 6. OTHERCOMPONENTS - QUICK REFERENCE

### AttendeesSection.vue

```
Hover Tilt:
  Same pattern as EventDetailsSection (±14 degrees)

Scroll Reveal:
  ScrollTrigger @ start: 'top 80%', once: true
  headerRef: opacity 0 → 1, y 40 → 0
  vvipRef: opacity 0 → 1, x -80 → 0, delay 0.2
  tetamuRef: opacity 0 → 1, x 80 → 0, delay 0.3
  quoteRef: opacity 0 → 1, y 40 → 0, delay 0.6
```

### BringListSection.vue

```
Scroll Reveal:
  ScrollTrigger @ start: 'top 75%', once: true
  headerRef: opacity 0 → 1, y 50 → 0
```

### MoodSection.vue

```
Scroll Reveal:
  ScrollTrigger @ start: 'top 75%', once: true
  headerRef: opacity 0 → 1, y 50 → 0
  Cards: opacity 0 → 1, y 80 → 0, rotation random → 0
         stagger: 0.12
         ease: back.out(1.5)
  quoteRef: opacity 0 → 1, scale 0.8 → 1, delay 0.9
```

### FooterSection.vue

```
Scroll Reveal:
  ScrollTrigger @ start: 'top 80%', once: true
  pandaRef: opacity 0 → 1, scale 0.5 → 1, y 60 → 0
           duration: 1s, ease: back.out(1.5)
```

### NavBar.vue

```
Progress Bar:
  ScrollTrigger (page-wide):
    scaleX: 0 → 1
    ease: none (linked to page scroll)

Scroll Listener:
  Updates active link based on section position
```

---

## MASTER DEPENDENCY CHECKLIST

Before refactoring, verify:

### HeroSection

- [ ] linePanda has 5 character spans
- [ ] lineBerpicnic has 9 character spans
- [ ] canvasRef connects to canvas element
- [ ] Three.js setup doesn't throw errors
- [ ] requestAnimationFrame cancels on unmount
- [ ] Resize listener removes on unmount

### CountdownSection

- [ ] 4 cards exist and are indexed 0-3
- [ ] 4 number elements exist for days/hours/minutes/seconds
- [ ] setInterval clears on unmount

### GamesSection

- [ ] gamesList is populated before animation starts
- [ ] gridRef can find icon elements
- [ ] cardRefs indices match game.id keys

### TimelineSection

- [ ] 10 events hardcoded in component
- [ ] eventRefs has all 10 indices
- [ ] dotRefs has all 10 indices

### EventDetailsSection

- [ ] 4 detail cards exist at indices 0-3
- [ ] Mouse events work (no touch alternative)

### All Components

- [ ] ScrollTrigger instances killed on unmount
- [ ] No race conditions between timelines

---

**Last Updated**: June 3, 2026  
**For Questions**: Refer to AUDIT_REPORT.md Section 5 (GSAP Safety Assessment)
