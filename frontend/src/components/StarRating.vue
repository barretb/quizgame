<script setup lang="ts">
defineProps<{ stars: number }>()
</script>

<template>
  <div class="star-rating" aria-label="`${stars} out of 3 stars`">
    <span
      v-for="n in 3"
      :key="n"
      class="star"
      :class="{ filled: n <= stars }"
      aria-hidden="true"
    >★</span>
  </div>
</template>

<style scoped>
.star-rating {
  display: flex;
  gap: 0.35rem;
}

.star {
  font-size: 2.5rem;
  color: var(--color-border);
  transition: color var(--transition), transform var(--transition);
}

.star.filled {
  color: #fbbf24;
  text-shadow: 0 0 12px rgba(251, 191, 36, 0.5);
  animation: pop 0.3s ease;
}

@keyframes pop {
  0% { transform: scale(0.6); }
  60% { transform: scale(1.25); }
  100% { transform: scale(1); }
}
</style>
