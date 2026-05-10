import { describe, it, expect, beforeEach } from 'vitest'
// TODO: import { setActivePinia, createPinia } from 'pinia'
// TODO: import { useQuizStore } from '../stores/quizStore'

/**
 * Unit tests for useQuizStore (Pinia).
 *
 * Responsibilities:
 *   - Track active quiz and current question index
 *   - Record answers and advance through questions
 *   - Reset state between quiz sessions
 *
 * All tests are stubs — implement once stores exist.
 */

describe('useQuizStore', () => {
  // beforeEach(() => {
  //   setActivePinia(createPinia())
  // })

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  it('initialState: store starts empty with no active quiz', () => {
    // TODO: implement when scaffold is available
    // const store = useQuizStore()
    // expect(store.activeQuiz).toBeNull()
    // expect(store.currentQuestionIndex).toBe(0)
    // expect(store.answers).toEqual([])
    expect(true).toBe(false) // Not implemented
  })

  // -------------------------------------------------------------------------
  // setQuiz
  // -------------------------------------------------------------------------

  it('setQuiz: loads a quiz and resets navigation state', () => {
    // TODO: implement when scaffold is available
    // const store = useQuizStore()
    // const mockQuiz = { quizId: 'q1', title: 'Test', topic: 'X', description: '', version: '1.0', questions: [...] }
    // store.setQuiz(mockQuiz)
    // expect(store.activeQuiz).toEqual(mockQuiz)
    // expect(store.currentQuestionIndex).toBe(0)
    // expect(store.answers).toEqual([])
    expect(true).toBe(false) // Not implemented
  })

  // -------------------------------------------------------------------------
  // recordAnswer
  // -------------------------------------------------------------------------

  it('recordAnswer: stores the selected index for the current question', () => {
    // TODO: implement when scaffold is available
    // const store = useQuizStore()
    // store.setQuiz(mockQuiz)
    // store.recordAnswer('q0', 2)
    // expect(store.answers).toContainEqual({ questionId: 'q0', selectedIndex: 2 })
    expect(true).toBe(false) // Not implemented
  })

  // -------------------------------------------------------------------------
  // nextQuestion
  // -------------------------------------------------------------------------

  it('nextQuestion: increments currentQuestionIndex', () => {
    // TODO: implement when scaffold is available
    // const store = useQuizStore()
    // store.setQuiz(mockQuiz) // quiz with 10 questions
    // store.nextQuestion()
    // expect(store.currentQuestionIndex).toBe(1)
    expect(true).toBe(false) // Not implemented
  })

  it('nextQuestion: does not exceed total question count', () => {
    // TODO: implement when scaffold is available
    // const store = useQuizStore()
    // store.setQuiz(mockQuizWith1Question)
    // store.nextQuestion() // already at last question
    // expect(store.currentQuestionIndex).toBe(0) // clamped or quiz ended
    expect(true).toBe(false) // Not implemented
  })

  // -------------------------------------------------------------------------
  // resetQuiz
  // -------------------------------------------------------------------------

  it('resetQuiz: clears all state back to initial', () => {
    // TODO: implement when scaffold is available
    // const store = useQuizStore()
    // store.setQuiz(mockQuiz)
    // store.recordAnswer('q0', 1)
    // store.nextQuestion()
    // store.resetQuiz()
    // expect(store.activeQuiz).toBeNull()
    // expect(store.currentQuestionIndex).toBe(0)
    // expect(store.answers).toEqual([])
    expect(true).toBe(false) // Not implemented
  })
})
