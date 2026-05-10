<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
}>()

const percentage = computed(() =>
  props.total > 0 ? (props.current / props.total) * 100 : 0
)
</script>

<template>
  <div class="progress-bar" role="progressbar" :aria-valuenow="current" :aria-valuemax="total">
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: `${percentage}%` }" />
    </div>
    <span class="progress-text">{{ current }} / {{ total }}</span>
  </div>
</template>

<style scoped>
.progress-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-track {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), #a78bfa);
  border-radius: 999px;
  transition: width 0.4s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
</style>
