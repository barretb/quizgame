<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api/client'
import type { QuizSummary } from '@/api/client'
import QuizCard from '@/components/QuizCard.vue'

const quizzes = ref<QuizSummary[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    quizzes.value = await api.getQuizzes()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load quizzes'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero-title">Test Your Knowledge</h1>
      <p class="hero-subtitle">Pick a quiz, answer questions, and challenge your friends with your score.</p>
    </section>

    <section class="quiz-section">
      <div v-if="loading" class="state-loading">
        <div class="spinner" />
        <p>Loading quizzes…</p>
      </div>

      <div v-else-if="error" class="state-error">
        <span class="error-icon">⚠️</span>
        <p>{{ error }}</p>
        <button class="btn-retry" @click="() => { loading = true; error = null; api.getQuizzes().then(q => quizzes = q).catch(e => error = e.message).finally(() => loading = false) }">
          Try again
        </button>
      </div>

      <div v-else-if="quizzes.length === 0" class="state-empty">
        <span>📭</span>
        <p>No quizzes available yet. Check back soon!</p>
      </div>

      <div v-else class="quiz-grid">
        <QuizCard v-for="quiz in quizzes" :key="quiz.quizId" :quiz="quiz" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  width: 100%;
}

.hero {
  text-align: center;
  margin-bottom: 3.5rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  background: linear-gradient(135deg, #6c63ff, #a78bfa, #ff6584);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  max-width: 520px;
  margin: 0 auto;
}

.quiz-section {
  min-height: 200px;
}

.quiz-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.state-loading,
.state-error,
.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 1rem;
  color: var(--color-text-muted);
  text-align: center;
}

.state-empty span,
.state-error .error-icon {
  font-size: 3rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-retry {
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  font-weight: 600;
}

.btn-retry:hover {
  background: var(--color-primary-hover);
}
</style>
