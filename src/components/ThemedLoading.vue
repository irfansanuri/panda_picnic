<template>
  <div class="themed-loading" role="status" aria-live="polite" aria-label="Loading">
    <div class="themed-loading__image-wrap" :style="{ '--fill-progress': fillRatio }" aria-hidden="true">
      <svg class="themed-loading__icon themed-loading__icon--silhouette" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        <circle cx="110" cy="110" r="102" />
        <path d="M52 150c16-20 44-31 78-31 34 0 62 11 78 31v34H52z" />
        <path d="M106 122c-10-18-5-34 12-50 11-10 24-17 38-21-6 9-11 19-13 31 14-10 30-15 47-17-7 8-15 16-23 23 18-4 35-3 50 4-16 4-30 10-43 20-18 14-34 20-48 20-9 0-16-3-20-10z" />
        <ellipse cx="88" cy="166" rx="24" ry="11" />
        <rect x="80" y="116" width="16" height="50" rx="8" />
        <path d="M88 114c-9-10-18-14-28-14 7 6 12 13 15 21" />
        <path d="M88 116c-3-14-2-24 2-33 5 10 7 19 7 29" />
        <path d="M90 118c8-11 18-17 31-17-8 7-14 15-18 24" />
      </svg>

      <div class="themed-loading__icon-color-layer">
        <svg class="themed-loading__icon themed-loading__icon--color" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#8fd8f5" />
              <stop offset="100%" stop-color="#2d8eb5" />
            </linearGradient>
            <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#f8e8bd" />
              <stop offset="100%" stop-color="#e0be7f" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#79c55e" />
              <stop offset="100%" stop-color="#2d6b1e" />
            </linearGradient>
            <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#c49b6c" />
              <stop offset="100%" stop-color="#6b4520" />
            </linearGradient>
          </defs>
          <circle cx="110" cy="110" r="102" fill="url(#seaGrad)" />
          <path d="M52 150c16-20 44-31 78-31 34 0 62 11 78 31v34H52z" fill="url(#sandGrad)" />
          <path d="M106 122c-10-18-5-34 12-50 11-10 24-17 38-21-6 9-11 19-13 31 14-10 30-15 47-17-7 8-15 16-23 23 18-4 35-3 50 4-16 4-30 10-43 20-18 14-34 20-48 20-9 0-16-3-20-10z" fill="#fff6df" />
          <ellipse cx="88" cy="166" rx="24" ry="11" fill="#f3cf8d" />
          <rect x="80" y="116" width="16" height="50" rx="8" fill="url(#trunkGrad)" />
          <path d="M88 114c-9-10-18-14-28-14 7 6 12 13 15 21" fill="none" stroke="url(#leafGrad)" stroke-width="8" stroke-linecap="round" />
          <path d="M88 116c-3-14-2-24 2-33 5 10 7 19 7 29" fill="none" stroke="url(#leafGrad)" stroke-width="8" stroke-linecap="round" />
          <path d="M90 118c8-11 18-17 31-17-8 7-14 15-18 24" fill="none" stroke="url(#leafGrad)" stroke-width="8" stroke-linecap="round" />
        </svg>
      </div>

      <div class="themed-loading__fill-edge" aria-hidden="true"></div>
    </div>

    <p class="themed-loading__label">Loading...</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
})

const clampedProgress = computed(() => {
  return Math.max(0, Math.min(100, Number.isFinite(props.progress) ? props.progress : 0))
})

const fillRatio = computed(() => `${clampedProgress.value}%`)
</script>

<style scoped lang="scss">
.themed-loading {
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 14px;
  padding: 24px;
  background:
    radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.5) 0%, transparent 42%),
    radial-gradient(circle at 85% 85%, rgba(242, 220, 160, 0.55) 0%, transparent 38%),
    linear-gradient(165deg, var(--sky-pale) 0%, var(--sand-light) 55%, #f3e3c3 100%);
}

.themed-loading__image-wrap {
  position: relative;
  margin: 0 auto;
  width: min(52vw, 170px);
  border-radius: 999px;
  overflow: hidden;
  aspect-ratio: 1;
  background: linear-gradient(165deg, #f4e3bb 0%, #c8dff0 100%);
  border: 2px solid rgba(61, 32, 16, 0.22);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
}

.themed-loading__icon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.themed-loading__icon--silhouette {
  fill: #000;
}

.themed-loading__icon-color-layer {
  position: absolute;
  inset: 0;
  clip-path: inset(0 calc(100% - var(--fill-progress)) 0 0);
  will-change: clip-path;
  transition: clip-path 320ms ease-out;
}

.themed-loading__fill-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--fill-progress);
  width: 12px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, rgba(245, 197, 24, 0) 0%, rgba(245, 197, 24, 0.35) 48%, rgba(245, 197, 24, 0) 100%);
  box-shadow: 0 0 14px rgba(245, 197, 24, 0.42);
  transition: left 320ms ease-out;
}

.themed-loading__label {
  margin: 0;
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 900;
  color: var(--wood-dark);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 560px) {
  .themed-loading__image-wrap {
    width: min(58vw, 148px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .themed-loading__icon-color-layer,
  .themed-loading__fill-edge {
    transition: none;
  }
}
</style>
