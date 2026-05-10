import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useScoreStore = defineStore('score', () => {
  const score = ref(0)
  const total = ref(0)
  const quizTitle = ref('')
  const quizId = ref('')

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
      `I scored ${score.value}/${total.value} on the "${quizTitle.value}" quiz! 🎯 Try it yourself at ${window.location.origin} #QuizGame`
  )

  function setResult(s: number, t: number, title: string, id: string) {
    score.value = s
    total.value = t
    quizTitle.value = title
    quizId.value = id
  }

  function reset() {
    score.value = 0
    total.value = 0
    quizTitle.value = ''
    quizId.value = ''
  }

  return { score, total, quizTitle, quizId, percentage, stars, shareText, setResult, reset }
})
