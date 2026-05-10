<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { QuizSummary } from '@/api/client'

const props = defineProps<{ quiz: QuizSummary }>()
const router = useRouter()

function startQuiz() {
  router.push({ name: 'quiz', params: { id: props.quiz.quizId } })
}
</script>

<template>
  <article class="quiz-card" @click="startQuiz" role="button" tabindex="0"
    @keydown.enter="startQuiz" @keydown.space.prevent="startQuiz">
    <div class="card-topic">{{ quiz.topic }}</div>
    <h2 class="card-title">{{ quiz.title }}</h2>
    <p class="card-description">{{ quiz.description }}</p>
    <div class="card-footer">
      <span class="card-count">
        <span class="count-icon">❓</span>
        {{ quiz.questionCount }} questions
      </span>
      <span class="card-action">Start →</span>
    </div>
  </article>
</template>

<style scoped>
.quiz-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  cursor: pointer;
  transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  outline: none;
}

.quiz-card:hover,
.quiz-card:focus {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(108, 99, 255, 0.25);
  border-color: var(--color-primary);
}

.card-topic {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  background: rgba(108, 99, 255, 0.12);
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  width: fit-content;
}

.card-title {
  font-size: 1.25rem;
  color: var(--color-text);
  margin: 0;
}

.card-description {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  flex: 1;
  line-height: 1.5;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.card-count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.count-icon {
  font-size: 1rem;
}

.card-action {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-primary);
}
</style>
