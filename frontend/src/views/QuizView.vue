<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/api/client'
import { useQuizStore } from '@/stores/quizStore'
import { useScoreStore } from '@/stores/scoreStore'
import QuestionDisplay from '@/components/QuestionDisplay.vue'
import AnswerOption from '@/components/AnswerOption.vue'
import ScoreTracker from '@/components/ScoreTracker.vue'
import ProgressBar from '@/components/ProgressBar.vue'

type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect'

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F']
const ADVANCE_DELAY_MS = 1500

const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const scoreStore = useScoreStore()

const loading = ref(true)
const error = ref<string | null>(null)
const submitting = ref(false)
const runningScore = ref(0)
const selectedIndex = ref<number | null>(null)
const isAdvancing = ref(false)

const currentQuestion = computed(() => quizStore.currentQuestion)
const currentIndex = computed(() => quizStore.currentQuestionIndex)
const totalQuestions = computed(() => quizStore.totalQuestions)

function getOptionState(optionIndex: number): AnswerState {
  if (selectedIndex.value === null) return 'default'
  const correct = currentQuestion.value?.correctIndex
  if (optionIndex === correct) return 'correct'
  if (optionIndex === selectedIndex.value) return 'incorrect'
  return 'default'
}

async function selectAnswer(optionIndex: number) {
  if (selectedIndex.value !== null || isAdvancing.value) return

  selectedIndex.value = optionIndex
  quizStore.submitAnswer(optionIndex)

  const correct = currentQuestion.value?.correctIndex
  if (optionIndex === correct) {
    runningScore.value++
  }

  isAdvancing.value = true
  await new Promise<void>((resolve) => setTimeout(resolve, ADVANCE_DELAY_MS))

  if (quizStore.isLastQuestion) {
    submitting.value = true
    try {
      await scoreStore.submitScore(quizStore.quiz!, quizStore.answers)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to submit score'
      submitting.value = false
      isAdvancing.value = false
      return
    }
    router.push({ name: 'results', params: { id: quizStore.quiz?.quizId } })
  } else {
    quizStore.advance()
    selectedIndex.value = null
    isAdvancing.value = false
  }
}

onMounted(async () => {
  quizStore.reset()
  scoreStore.reset()
  runningScore.value = 0
  selectedIndex.value = null
  isAdvancing.value = false

  const id = route.params.id as string
  try {
    const data = await api.getQuiz(id)
    quizStore.setQuiz(data)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load quiz'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="quiz-view">
    <div v-if="loading" class="state-loading">
      <div class="spinner" />
      <p>Loading quiz…</p>
    </div>

    <div v-else-if="submitting" class="state-loading">
      <div class="spinner" />
      <p>Submitting…</p>
    </div>

    <div v-else-if="error" class="state-error">
      <span>⚠️</span>
      <p>{{ error }}</p>
      <RouterLink to="/" class="btn-back">← Back to quizzes</RouterLink>
    </div>

    <template v-else-if="currentQuestion">
      <div class="quiz-header">
        <RouterLink to="/" class="back-link">← Quizzes</RouterLink>
        <h1 class="quiz-title">{{ quizStore.quiz?.title }}</h1>
        <ScoreTracker :score="runningScore" :total="currentIndex" />
      </div>

      <div class="quiz-progress">
        <ProgressBar :current="currentIndex + 1" :total="totalQuestions" />
      </div>

      <div class="quiz-body">
        <QuestionDisplay
          :question="currentQuestion"
          :question-number="currentIndex + 1"
          :total-questions="totalQuestions"
        />

        <div class="answer-list">
          <AnswerOption
            v-for="(option, idx) in currentQuestion.options"
            :key="`${currentIndex}-${idx}`"
            :label="LABELS[idx] ?? String(idx + 1)"
            :text="option"
            :state="getOptionState(idx)"
            :disabled="selectedIndex !== null"
            @select="selectAnswer(idx)"
          />
        </div>

        <div v-if="selectedIndex !== null" class="explanation">
          <div class="explanation-inner">
            <span class="explanation-icon">💡</span>
            <p>{{ currentQuestion.explanation }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.quiz-view {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
}

.quiz-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.back-link {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-decoration: none;
  flex-shrink: 0;
}

.back-link:hover {
  color: var(--color-text);
}

.quiz-title {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quiz-progress {
  margin-bottom: 2.5rem;
}

.quiz-body {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.answer-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.explanation {
  margin-top: 1.5rem;
  animation: fade-in 0.25s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
}

.explanation-inner {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  background: rgba(108, 99, 255, 0.08);
  border: 1px solid rgba(108, 99, 255, 0.2);
  border-radius: var(--radius-md);
  padding: 1rem 1.25rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.explanation-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.state-loading,
.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 6rem 1rem;
  color: var(--color-text-muted);
  text-align: center;
}

.state-error span {
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

.btn-back {
  color: var(--color-primary);
  font-size: 0.9rem;
}
</style>
