import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { scoreQuiz } from '@/api/client'
import type { Quiz } from '@/api/client'
import type { ScoreResponse } from '@/api/client'
import { useScoreHistoryStore } from '@/stores/scoreHistoryStore'

export const useScoreStore = defineStore('score', () => {
  const score = ref(0)
  const total = ref(0)
  const quizTitle = ref('')
  const quizId = ref('')
  const scoreResponse = ref<ScoreResponse | null>(null)

  const percentage = computed(() =>
    total.value > 0 ? (score.value / total.value) * 100 : 0
  )

  const stars = computed(() => {
    const pct = percentage.value
    if (pct >= 80) return 3
    if (pct >= 60) return 2
    if (pct >= 40) return 1
    return 0
  })

  const shareText = computed(
    () =>
      `I scored ${score.value}/${total.value} on "${quizTitle.value}" in Barret's Quiz Game! 🎉\n#BarretsQuizGame #QuizGame`
  )

  function setResult(s: number, t: number, title: string, id: string) {
    score.value = s
    total.value = t
    quizTitle.value = title
    quizId.value = id
  }

  async function submitScore(quiz: Quiz, answers: (number | null)[]) {
    const response = scoreQuiz(quiz, answers)
    scoreResponse.value = response

    score.value = response.correctCount
    total.value = response.totalQuestions
    quizTitle.value = quiz.title
    quizId.value = quiz.quizId

    const scoreHistoryStore = useScoreHistoryStore()
    scoreHistoryStore.addEntry({
      quizId: quiz.quizId,
      quizTitle: quiz.title,
      percentage: response.percentage,
      correctCount: response.correctCount,
      totalQuestions: response.totalQuestions,
      takenAt: new Date().toISOString()
    })
  }

  function reset() {
    score.value = 0
    total.value = 0
    quizTitle.value = ''
    quizId.value = ''
    scoreResponse.value = null
  }

  return { score, total, quizTitle, quizId, scoreResponse, percentage, stars, shareText, setResult, submitScore, reset }
})
