import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Quiz, Question } from '@/api/client'

export const useQuizStore = defineStore('quiz', () => {
  const quiz = ref<Quiz | null>(null)
  const currentQuestionIndex = ref(0)
  const answers = ref<(number | null)[]>([])

  const currentQuestion = computed<Question | null>(() => {
    if (!quiz.value) return null
    return quiz.value.questions[currentQuestionIndex.value] ?? null
  })

  const totalQuestions = computed(() => quiz.value?.questions.length ?? 0)

  const isLastQuestion = computed(
    () => currentQuestionIndex.value >= totalQuestions.value - 1
  )

  const hasAnswered = computed(() => {
    const ans = answers.value[currentQuestionIndex.value]
    return ans !== null && ans !== undefined
  })

  function setQuiz(data: Quiz) {
    quiz.value = data
    currentQuestionIndex.value = 0
    answers.value = new Array(data.questions.length).fill(null)
  }

  function submitAnswer(optionIndex: number) {
    if (hasAnswered.value) return
    answers.value[currentQuestionIndex.value] = optionIndex
  }

  function advance() {
    if (!isLastQuestion.value) {
      currentQuestionIndex.value++
    }
  }

  function reset() {
    quiz.value = null
    currentQuestionIndex.value = 0
    answers.value = []
  }

  return {
    quiz,
    currentQuestionIndex,
    answers,
    currentQuestion,
    totalQuestions,
    isLastQuestion,
    hasAnswered,
    setQuiz,
    submitAnswer,
    advance,
    reset
  }
})
