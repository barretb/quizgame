import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useScoreStore } from '../stores/scoreStore'
import { useScoreHistoryStore } from '../stores/scoreHistoryStore'
import type { Quiz } from '../api/client'

/**
 * Unit tests for useScoreStore (Pinia) — frontend-only architecture.
 *
 * submitScore() calls scoreQuiz() (pure function, no HTTP) and populates:
 *   - scoreResponse: full ScoreResponse object
 *   - score / total: set from response
 *   - percentage: computed as (score / total) * 100
 *   - stars: bucketed from percentage
 *
 * Star rating buckets:
 *   0–39%   → 0 stars
 *   40–59%  → 1 star
 *   60–79%  → 2 stars
 *   80–100% → 3 stars
 */

const COOKIE_NAME = 'quiz_score_history'

function clearCookie() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

function makeQuiz(questionCount = 10, correctIndex = 0): Quiz {
  return {
    quizId: 'test-quiz-001',
    title: 'Test Quiz',
    topic: 'Testing',
    description: 'A test quiz',
    version: '1.0',
    questions: Array.from({ length: questionCount }, (_, i) => ({
      questionId: `q${i}`,
      text: `Question ${i}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctIndex,
      explanation: `Explanation ${i}`
    }))
  }
}

describe('useScoreStore', () => {
  beforeEach(() => {
    clearCookie()
    setActivePinia(createPinia())
  })

  // -------------------------------------------------------------------------
  // submitScore — scoreResponse
  // -------------------------------------------------------------------------

  describe('submitScore — scoreResponse', () => {
    it('scoreResponse is null before submitScore', () => {
      const store = useScoreStore()
      expect(store.scoreResponse).toBeNull()
    })

    it('scoreResponse is populated after submitScore', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      expect(store.scoreResponse).not.toBeNull()
    })

    it('scoreResponse.correctCount matches number of correct answers', async () => {
      const store = useScoreStore()
      const answers = [...new Array(7).fill(0), ...new Array(3).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.scoreResponse!.correctCount).toBe(7)
    })

    it('scoreResponse.passed is true when score is 60% or above', async () => {
      const store = useScoreStore()
      const answers = [...new Array(6).fill(0), ...new Array(4).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.scoreResponse!.passed).toBe(true)
    })

    it('scoreResponse.passed is false when score is below 60%', async () => {
      const store = useScoreStore()
      const answers = [...new Array(5).fill(0), ...new Array(5).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.scoreResponse!.passed).toBe(false)
    })

    it('scoreResponse.questionResults has one entry per question', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      expect(store.scoreResponse!.questionResults).toHaveLength(10)
    })
  })

  // -------------------------------------------------------------------------
  // percentage computed prop
  // -------------------------------------------------------------------------

  describe('percentage computed', () => {
    it('percentage is 0 before any score is submitted', () => {
      const store = useScoreStore()
      expect(store.percentage).toBe(0)
    })

    it('percentage is 100 after all correct answers', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      expect(store.percentage).toBe(100)
    })

    it('percentage is 0 after all wrong answers', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(1))
      expect(store.percentage).toBe(0)
    })

    it('percentage is 60 for 6/10 correct', async () => {
      const store = useScoreStore()
      const answers = [...new Array(6).fill(0), ...new Array(4).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.percentage).toBe(60)
    })
  })

  // -------------------------------------------------------------------------
  // stars computed — boundary thresholds
  // -------------------------------------------------------------------------

  describe('stars computed — threshold boundaries', () => {
    it('0% (0/10) → 0 stars', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(1))
      expect(store.stars).toBe(0)
    })

    it('30% (3/10) → 0 stars', async () => {
      const store = useScoreStore()
      const answers = [...new Array(3).fill(0), ...new Array(7).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.stars).toBe(0)
    })

    it('40% (4/10) → 1 star', async () => {
      const store = useScoreStore()
      const answers = [...new Array(4).fill(0), ...new Array(6).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.stars).toBe(1)
    })

    it('50% (5/10) → 1 star', async () => {
      const store = useScoreStore()
      const answers = [...new Array(5).fill(0), ...new Array(5).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.stars).toBe(1)
    })

    it('60% (6/10) → 2 stars', async () => {
      const store = useScoreStore()
      const answers = [...new Array(6).fill(0), ...new Array(4).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.stars).toBe(2)
    })

    it('70% (7/10) → 2 stars', async () => {
      const store = useScoreStore()
      const answers = [...new Array(7).fill(0), ...new Array(3).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.stars).toBe(2)
    })

    it('80% (8/10) → 3 stars', async () => {
      const store = useScoreStore()
      const answers = [...new Array(8).fill(0), ...new Array(2).fill(1)]
      await store.submitScore(makeQuiz(10, 0), answers)
      expect(store.stars).toBe(3)
    })

    it('100% (10/10) → 3 stars', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      expect(store.stars).toBe(3)
    })
  })

  // -------------------------------------------------------------------------
  // scoreHistoryStore integration
  // -------------------------------------------------------------------------

  describe('submitScore — history integration', () => {
    it('adds an entry to scoreHistoryStore after submitScore', async () => {
      const scoreStore = useScoreStore()
      const historyStore = useScoreHistoryStore()
      await scoreStore.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      expect(historyStore.history).toHaveLength(1)
      expect(historyStore.history[0].quizId).toBe('test-quiz-001')
    })
  })

  // -------------------------------------------------------------------------
  // reset
  // -------------------------------------------------------------------------

  describe('reset', () => {
    it('clears scoreResponse after reset', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      store.reset()
      expect(store.scoreResponse).toBeNull()
    })

    it('resets score and total to 0 after reset', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      store.reset()
      expect(store.score).toBe(0)
      expect(store.total).toBe(0)
    })

    it('percentage is 0 after reset', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      store.reset()
      expect(store.percentage).toBe(0)
    })

    it('stars is 0 after reset', async () => {
      const store = useScoreStore()
      await store.submitScore(makeQuiz(10, 0), new Array(10).fill(0))
      store.reset()
      expect(store.stars).toBe(0)
    })
  })
})
