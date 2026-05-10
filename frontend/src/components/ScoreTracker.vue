<script setup lang="ts">
defineProps<{
  score: number
  total: number
}>()
</script>

<template>
  <div class="score-tracker">
    <span class="score-label">Score</span>
    <span class="score-value">{{ score }}<span class="score-total"> / {{ total }}</span></span>
  </div>
</template>

<style scoped>
.score-tracker {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.6rem 1.25rem;
  min-width: 80px;
}

.score-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.score-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-success);
}

.score-total {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-muted);
}
</style>
