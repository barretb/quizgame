<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScoreStore } from '@/stores/scoreStore'
import StarRating from '@/components/StarRating.vue'
import ShareModal from '@/components/ShareModal.vue'

const route = useRoute()
const router = useRouter()
const scoreStore = useScoreStore()

const showShareModal = ref(false)
const starsVisible = ref(false)

// If no score data, redirect home
onMounted(() => {
  if (scoreStore.total === 0) {
    router.replace({ name: 'home' })
    return
  }
  setTimeout(() => {
    starsVisible.value = true
  }, 200)
})

function playAgain() {
  router.push({ name: 'quiz', params: { id: route.params.id } })
}
</script>

<template>
  <div class="results-view">
    <div class="results-card">
      <div class="results-header">
        <span class="trophy">🏆</span>
        <h1 class="results-title">Quiz Complete!</h1>
        <p class="results-quiz-name">{{ scoreStore.quizTitle }}</p>
      </div>

      <div class="score-display">
        <div class="score-big">
          <span class="score-num">{{ scoreStore.score }}</span>
          <span class="score-sep">/</span>
          <span class="score-denom">{{ scoreStore.total }}</span>
        </div>
        <div class="score-pct">{{ Math.round(scoreStore.percentage) }}%</div>
      </div>

      <div class="stars-row" :class="{ visible: starsVisible }">
        <StarRating :stars="scoreStore.stars" />
        <p class="stars-label">
          <template v-if="scoreStore.stars === 3">Outstanding! 🎉</template>
          <template v-else-if="scoreStore.stars === 2">Well done! 👏</template>
          <template v-else-if="scoreStore.stars === 1">Good effort! 💪</template>
          <template v-else>Keep practising! 📚</template>
        </p>
      </div>

      <div v-if="scoreStore.scoreResponse" class="passed-badge" :class="scoreStore.scoreResponse.passed ? 'passed' : 'failed'">
        {{ scoreStore.scoreResponse.passed ? '✅ Passed' : '❌ Try Again' }}
      </div>

      <div class="results-actions">
        <button class="btn-share" @click="showShareModal = true">
          📤 Share Score
        </button>
        <button class="btn-again" @click="playAgain">
          🔄 Play Again
        </button>
        <RouterLink to="/" class="btn-home">🏠 All Quizzes</RouterLink>
      </div>
    </div>

    <ShareModal
      v-if="showShareModal"
      :share-text="scoreStore.shareText"
      @close="showShareModal = false"
    />

    <div v-if="scoreStore.scoreResponse" class="question-review">
      <h2 class="review-title">Question Review</h2>
      <div
        v-for="(result, i) in scoreStore.scoreResponse.questionResults"
        :key="result.questionId"
        class="review-item"
        :class="result.isCorrect ? 'review-correct' : 'review-incorrect'"
      >
        <div class="review-header">
          <span class="review-num">Q{{ i + 1 }}</span>
          <span class="review-status">{{ result.isCorrect ? '✅ Correct' : '❌ Incorrect' }}</span>
        </div>
        <div v-if="!result.isCorrect" class="review-detail">
          <span>Your answer: option {{ result.selectedIndex + 1 }}</span>
          <span>Correct: option {{ result.correctIndex + 1 }}</span>
        </div>
        <p class="review-explanation">{{ result.explanation }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.results-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 2rem 1.5rem;
}

.results-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 3rem 2.5rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-card);
  animation: slide-up 0.4s ease;
}

@keyframes slide-up {
  from { transform: translateY(32px); opacity: 0; }
}

.results-header {
  margin-bottom: 2.5rem;
}

.trophy {
  font-size: 3.5rem;
  display: block;
  margin-bottom: 0.75rem;
  animation: bounce 0.6s ease 0.3s both;
}

@keyframes bounce {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.results-title {
  font-size: 1.75rem;
  color: var(--color-text);
  margin-bottom: 0.35rem;
}

.results-quiz-name {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.score-display {
  margin-bottom: 2rem;
}

.score-big {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  line-height: 1;
}

.score-num {
  font-size: 5rem;
  font-weight: 800;
  color: var(--color-primary);
}

.score-sep {
  font-size: 2.5rem;
  color: var(--color-text-muted);
  font-weight: 300;
}

.score-denom {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.score-pct {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.stars-row {
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.stars-row.visible {
  opacity: 1;
}

.stars-label {
  font-size: 1rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.results-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-share,
.btn-again,
.btn-home {
  display: block;
  width: 100%;
  padding: 0.85rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  font-family: inherit;
  transition: opacity var(--transition), transform var(--transition);
}

.btn-share,
.btn-again,
.btn-home:hover,
.btn-share:hover,
.btn-again:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-share {
  background: linear-gradient(135deg, var(--color-primary), #a78bfa);
  color: #fff;
}

.btn-again {
  background: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.btn-home {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
}

.passed-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 1.75rem;
}

.passed-badge.passed {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.passed-badge.failed {
  background: rgba(239, 68, 68, 0.12);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.question-review {
  max-width: 500px;
  width: 100%;
  margin-top: 2rem;
  text-align: left;
}

.review-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.review-item {
  border-radius: var(--radius-md);
  padding: 0.9rem 1.1rem;
  margin-bottom: 0.75rem;
  border-left: 4px solid;
}

.review-correct {
  background: rgba(34, 197, 94, 0.07);
  border-color: #4ade80;
}

.review-incorrect {
  background: rgba(239, 68, 68, 0.07);
  border-color: #f87171;
}

.review-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.35rem;
}

.review-num {
  color: var(--color-text-muted);
}

.review-detail {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
}

.review-explanation {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}
</style>
