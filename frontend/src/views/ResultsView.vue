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
</style>
