<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api/client'
import type { QuizSummary } from '@/api/client'
import QuizCard from '@/components/QuizCard.vue'
import { useScoreHistoryStore } from '@/stores/scoreHistoryStore'

const quizzes = ref<QuizSummary[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')
const sortOrder = ref<'default' | 'newest' | 'oldest'>('default')
const historyExpanded = ref(window.innerWidth >= 768)

const scoreHistoryStore = useScoreHistoryStore()

onMounted(async () => {
  try {
    quizzes.value = await api.getQuizzes()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load quizzes'
  } finally {
    loading.value = false
  }
})

const filteredQuizzes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  let list = quizzes.value

  if (q) {
    list = list.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(q) ||
        quiz.topic.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q)
    )
  }

  if (sortOrder.value === 'newest') {
    list = [...list].sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
  } else if (sortOrder.value === 'oldest') {
    list = [...list].sort(
      (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
    )
  }

  return list
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatPercent(pct: number): string {
  return `${Math.round(pct)}%`
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <h1 class="hero-title">Test Your Knowledge</h1>
      <p class="hero-subtitle">Pick a quiz, answer questions, and challenge your friends with your score.</p>
    </section>

    <!-- Score History Panel -->
    <section v-if="scoreHistoryStore.history.length > 0" class="history-panel">
      <button class="history-toggle" @click="historyExpanded = !historyExpanded">
        <span class="history-toggle-left">
          <span>📊</span>
          <span class="history-toggle-title">Your Score History</span>
          <span class="history-badge">{{ scoreHistoryStore.history.length }}</span>
        </span>
        <span class="history-chevron" :class="{ expanded: historyExpanded }">▾</span>
      </button>

      <div v-if="historyExpanded" class="history-body">
        <div class="history-table-wrap">
          <table class="history-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>Result</th>
                <th>Taken</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="entry in scoreHistoryStore.history" :key="entry.takenAt + entry.quizId">
                <td class="history-quiz-title">{{ entry.quizTitle }}</td>
                <td class="history-score">{{ entry.correctCount }}/{{ entry.totalQuestions }}</td>
                <td>
                  <span
                    class="history-pct"
                    :class="{
                      'pct-high': entry.percentage >= 80,
                      'pct-mid': entry.percentage >= 50 && entry.percentage < 80,
                      'pct-low': entry.percentage < 50
                    }"
                  >{{ formatPercent(entry.percentage) }}</span>
                </td>
                <td class="history-date">{{ formatDate(entry.takenAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button class="btn-clear-history" @click="scoreHistoryStore.clearHistory()">
          🗑 Clear history
        </button>
      </div>
    </section>

    <section class="quiz-section">
      <!-- Search + Sort Controls -->
      <div class="controls-row">
        <div class="search-wrap">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="search"
            class="search-input"
            placeholder="Search by title, topic, or description…"
            aria-label="Search quizzes"
          />
        </div>
        <select v-model="sortOrder" class="sort-select" aria-label="Sort quizzes">
          <option value="default">Default order</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

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

      <div v-else-if="filteredQuizzes.length === 0" class="state-empty">
        <span>🔍</span>
        <p>No quizzes match your search.</p>
      </div>

      <div v-else class="quiz-grid">
        <QuizCard v-for="quiz in filteredQuizzes" :key="quiz.quizId" :quiz="quiz" />
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
  margin-bottom: 3rem;
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

/* ── Score History Panel ── */
.history-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
  overflow: hidden;
}

.history-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition);
}

.history-toggle:hover {
  background: rgba(108, 99, 255, 0.06);
}

.history-toggle-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.history-toggle-title {
  font-size: 0.95rem;
}

.history-badge {
  background: var(--color-primary);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  line-height: 1.4;
}

.history-chevron {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  transition: transform 0.2s ease;
  display: inline-block;
}

.history-chevron.expanded {
  transform: rotate(180deg);
}

.history-body {
  border-top: 1px solid var(--color-border);
  padding: 1rem 1.25rem 1.25rem;
}

.history-table-wrap {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  min-width: 380px;
}

.history-table th {
  text-align: left;
  color: var(--color-text-muted);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.history-table td {
  padding: 0.6rem 0.75rem;
  color: var(--color-text);
  border-bottom: 1px solid rgba(42, 42, 74, 0.5);
}

.history-table tr:last-child td {
  border-bottom: none;
}

.history-quiz-title {
  font-weight: 500;
}

.history-score {
  color: var(--color-text-muted);
  white-space: nowrap;
}

.history-date {
  color: var(--color-text-muted);
  white-space: nowrap;
  font-size: 0.8rem;
}

.history-pct {
  font-weight: 700;
  border-radius: var(--radius-sm);
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
}

.pct-high {
  background: rgba(67, 217, 143, 0.12);
  color: #43d98f;
}

.pct-mid {
  background: rgba(108, 99, 255, 0.12);
  color: var(--color-primary);
}

.pct-low {
  background: rgba(255, 92, 108, 0.12);
  color: var(--color-error);
}

.btn-clear-history {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.8rem;
  padding: 0.4rem 0.9rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition), border-color var(--transition);
}

.btn-clear-history:hover {
  color: var(--color-error);
  border-color: var(--color-error);
}

/* ── Controls Row ── */
.controls-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
  flex-wrap: wrap;
}

.search-wrap {
  flex: 1;
  min-width: 200px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  font-size: 0.95rem;
  pointer-events: none;
  line-height: 1;
}

.search-input {
  width: 100%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.95rem;
  padding: 0.65rem 0.9rem 0.65rem 2.3rem;
  transition: border-color var(--transition), box-shadow var(--transition);
  outline: none;
}

.search-input::placeholder {
  color: var(--color-text-muted);
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.15);
}

/* clear button injected by browser for type=search */
.search-input::-webkit-search-cancel-button {
  filter: invert(0.6);
}

.sort-select {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.9rem;
  padding: 0.65rem 0.9rem;
  cursor: pointer;
  outline: none;
  transition: border-color var(--transition);
}

.sort-select:focus {
  border-color: var(--color-primary);
}

/* ── Quiz Section ── */
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

/* ── Mobile: history collapsed by default ── */
@media (max-width: 767px) {
  .controls-row {
    flex-direction: column;
  }

  .sort-select {
    width: 100%;
  }
}
</style>

