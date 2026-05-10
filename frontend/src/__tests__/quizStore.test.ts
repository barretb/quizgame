import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useQuizStore } from '../stores/quizStore'
import type { Quiz } from '../api/client'

/**
 * Unit tests for useQuizStore (Pinia).
 *
 * Responsibilities:
 *   - Track active quiz and current question index
 *   - Record answers via submitAnswer and advance through questions
 *   - Reset state between quiz sessions
 */

function makeQuiz(questionCount = 10): Quiz {
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
      correctIndex: 0,
      explanation: `Explanation ${i}`
    }))
  }
}

describe('useQuizStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  describe('initial state', () => {
    it('quiz is null before any quiz is loaded', () => {
      const store = useQuizStore()
      expect(store.quiz).toBeNull()
    })

    it('currentQuestionIndex starts at 0', () => {
      const store = useQuizStore()
      expect(store.currentQuestionIndex).toBe(0)
    })

    it('answers is empty before any quiz is loaded', () => {
      const store = useQuizStore()
      expect(store.answers).toEqual([])
    })
  })

  // -------------------------------------------------------------------------
  // setQuiz
  // -------------------------------------------------------------------------

  describe('setQuiz', () => {
    it('loads the quiz into state', () => {
      const store = useQuizStore()
      const quiz = makeQuiz(10)
      store.setQuiz(quiz)
      expect(store.quiz).toEqual(quiz)
    })

    it('resets currentQuestionIndex to 0', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.advance()
      store.setQuiz(makeQuiz(10))
      expect(store.currentQuestionIndex).toBe(0)
    })

    it('initializes answers array with nulls equal to question count', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      expect(store.answers).toHaveLength(10)
      expect(store.answers.every((a) => a === null)).toBe(true)
    })
  })

  // -------------------------------------------------------------------------
  // submitAnswer
  // -------------------------------------------------------------------------

  describe('submitAnswer', () => {
    it('records the selected index for the current question', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.submitAnswer(2)
      expect(store.answers[0]).toBe(2)
    })

    it('does not overwrite an already-answered question', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.submitAnswer(2)
      store.submitAnswer(3)
      expect(store.answers[0]).toBe(2) // first answer preserved
    })

    it('records answer for the correct question index when not at index 0', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.advance()
      store.submitAnswer(1)
      expect(store.answers[0]).toBeNull() // q0 untouched
      expect(store.answers[1]).toBe(1)    // q1 answered
    })
  })

  // -------------------------------------------------------------------------
  // advance
  // -------------------------------------------------------------------------

  describe('advance', () => {
    it('increments currentQuestionIndex', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.advance()
      expect(store.currentQuestionIndex).toBe(1)
    })

    it('increments multiple times correctly', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.advance()
      store.advance()
      store.advance()
      expect(store.currentQuestionIndex).toBe(3)
    })

    it('does not advance past the last question', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(1))
      store.advance() // already at last question (index 0, total 1)
      expect(store.currentQuestionIndex).toBe(0)
    })
  })

  // -------------------------------------------------------------------------
  // reset
  // -------------------------------------------------------------------------

  describe('reset', () => {
    it('clears quiz to null', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.reset()
      expect(store.quiz).toBeNull()
    })

    it('resets currentQuestionIndex to 0', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.advance()
      store.reset()
      expect(store.currentQuestionIndex).toBe(0)
    })

    it('clears answers to empty array', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.submitAnswer(1)
      store.reset()
      expect(store.answers).toEqual([])
    })
  })

  // -------------------------------------------------------------------------
  // Computed properties
  // -------------------------------------------------------------------------

  describe('computed — currentQuestion', () => {
    it('is null when no quiz is loaded', () => {
      const store = useQuizStore()
      expect(store.currentQuestion).toBeNull()
    })

    it('returns the question at currentQuestionIndex', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      expect(store.currentQuestion?.questionId).toBe('q0')
      store.advance()
      expect(store.currentQuestion?.questionId).toBe('q1')
    })
  })

  describe('computed — totalQuestions', () => {
    it('is 0 when no quiz is loaded', () => {
      const store = useQuizStore()
      expect(store.totalQuestions).toBe(0)
    })

    it('matches the question count of the loaded quiz', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      expect(store.totalQuestions).toBe(10)
    })
  })

  describe('computed — isLastQuestion', () => {
    it('is false when on the first of multiple questions', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(3))
      expect(store.isLastQuestion).toBe(false)
    })

    it('is true when on the final question', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(2))
      store.advance()
      expect(store.isLastQuestion).toBe(true)
    })
  })

  describe('computed — hasAnswered', () => {
    it('is false before submitAnswer is called', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      expect(store.hasAnswered).toBe(false)
    })

    it('is true after submitAnswer is called for current question', () => {
      const store = useQuizStore()
      store.setQuiz(makeQuiz(10))
      store.submitAnswer(1)
      expect(store.hasAnswered).toBe(true)
    })
  })
})
