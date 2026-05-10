<script setup lang="ts">
import type { Question } from '@/api/client'

defineProps<{
  question: Question
  questionNumber: number
  totalQuestions: number
}>()
</script>

<template>
  <div class="question-display">
    <div class="question-meta">
      <span class="question-number">Question {{ questionNumber }}</span>
      <span class="question-total">of {{ totalQuestions }}</span>
    </div>
    <p class="question-text">{{ question.text }}</p>
  </div>
</template>

<style scoped>
.question-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.question-meta {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.question-number {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
}

.question-total {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.question-text {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.4;
}
</style>
