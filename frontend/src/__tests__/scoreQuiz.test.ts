import { describe, it, expect } from 'vitest'
import { scoreQuiz } from '../api/client'
import type { Quiz } from '../api/client'

/**
 * Unit tests for scoreQuiz — the pure synchronous scoring function.
 *
 * Contract:
 *   scoreQuiz(quiz, answers) → ScoreResponse
 *   - answers[i] maps to quiz.questions[i]; null means unanswered (treated as wrong, selectedIndex = -1)
 *   - passed threshold: percentage >= 60
 *   - percentage rounded to 1 decimal place
 */

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
      explanation: `Explanation for question ${i}`
    }))
  }
}

// ── All correct ────────────────────────────────────────────────────────────────

describe('scoreQuiz — all correct', () => {
  it('returns correctCount 10 when all 10 answers are correct', () => {
    const quiz = makeQuiz(10, 0)
    const result = scoreQuiz(quiz, new Array(10).fill(0))
    expect(result.correctCount).toBe(10)
    expect(result.totalQuestions).toBe(10)
  })

  it('returns percentage 100 when all 10 answers are correct', () => {
    const result = scoreQuiz(makeQuiz(10, 0), new Array(10).fill(0))
    expect(result.percentage).toBe(100)
  })

  it('passed is true when all 10 answers are correct', () => {
    const result = scoreQuiz(makeQuiz(10, 0), new Array(10).fill(0))
    expect(result.passed).toBe(true)
  })
})

// ── All wrong ──────────────────────────────────────────────────────────────────

describe('scoreQuiz — all wrong', () => {
  it('returns correctCount 0 when all 10 answers are wrong', () => {
    const quiz = makeQuiz(10, 0)
    // correctIndex is 0; selectedIndex is 1 → all wrong
    const result = scoreQuiz(quiz, new Array(10).fill(1))
    expect(result.correctCount).toBe(0)
    expect(result.totalQuestions).toBe(10)
  })

  it('returns percentage 0 when all answers are wrong', () => {
    const result = scoreQuiz(makeQuiz(10, 0), new Array(10).fill(1))
    expect(result.percentage).toBe(0)
  })

  it('passed is false when all answers are wrong', () => {
    const result = scoreQuiz(makeQuiz(10, 0), new Array(10).fill(1))
    expect(result.passed).toBe(false)
  })
})

// ── Boundary: 60% pass threshold ───────────────────────────────────────────────

describe('scoreQuiz — boundary: 60% pass threshold', () => {
  it('passed is true when exactly 6/10 (60%) are correct', () => {
    const quiz = makeQuiz(10, 0)
    const answers = [...new Array(6).fill(0), ...new Array(4).fill(1)]
    const result = scoreQuiz(quiz, answers)
    expect(result.correctCount).toBe(6)
    expect(result.percentage).toBe(60)
    expect(result.passed).toBe(true)
  })

  it('passed is false when exactly 5/10 (50%) are correct', () => {
    const quiz = makeQuiz(10, 0)
    const answers = [...new Array(5).fill(0), ...new Array(5).fill(1)]
    const result = scoreQuiz(quiz, answers)
    expect(result.correctCount).toBe(5)
    expect(result.percentage).toBe(50)
    expect(result.passed).toBe(false)
  })
})

// ── Null answers (skipped questions) ──────────────────────────────────────────

describe('scoreQuiz — null answers', () => {
  it('does not throw when answers contain null values', () => {
    const quiz = makeQuiz(10, 0)
    const answers: (number | null)[] = [0, 0, null, null, null, null, null, null, null, null]
    expect(() => scoreQuiz(quiz, answers)).not.toThrow()
  })

  it('counts null answers as wrong', () => {
    const quiz = makeQuiz(10, 0)
    const answers: (number | null)[] = [0, 0, null, null, null, null, null, null, null, null]
    const result = scoreQuiz(quiz, answers)
    expect(result.correctCount).toBe(2)
    expect(result.passed).toBe(false)
  })

  it('null answers produce selectedIndex of -1 in questionResults', () => {
    const quiz = makeQuiz(10, 0)
    const answers: (number | null)[] = new Array(10).fill(null)
    const result = scoreQuiz(quiz, answers)
    expect(result.questionResults[0].selectedIndex).toBe(-1)
    expect(result.questionResults[0].isCorrect).toBe(false)
  })
})

// ── Percentage precision ───────────────────────────────────────────────────────

describe('scoreQuiz — percentage precision', () => {
  it('rounds to 1 decimal: 1 out of 3 = 33.3%', () => {
    const quiz = makeQuiz(3, 0)
    const result = scoreQuiz(quiz, [0, 1, 1]) // 1 correct
    expect(result.percentage).toBe(33.3)
  })

  it('rounds to 1 decimal: 2 out of 3 = 66.7%', () => {
    const quiz = makeQuiz(3, 0)
    const result = scoreQuiz(quiz, [0, 0, 1]) // 2 correct
    expect(result.percentage).toBe(66.7)
  })
})

// ── questionResults shape ──────────────────────────────────────────────────────

describe('scoreQuiz — questionResults shape', () => {
  it('has one result per question', () => {
    const quiz = makeQuiz(5, 0)
    const result = scoreQuiz(quiz, new Array(5).fill(0))
    expect(result.questionResults).toHaveLength(5)
  })

  it('correct answer: questionId, selectedIndex, correctIndex, isCorrect=true, explanation', () => {
    const quiz = makeQuiz(2, 0)
    const result = scoreQuiz(quiz, [0, 1])
    const r0 = result.questionResults[0]
    expect(r0.questionId).toBe('q0')
    expect(r0.selectedIndex).toBe(0)
    expect(r0.correctIndex).toBe(0)
    expect(r0.isCorrect).toBe(true)
    expect(typeof r0.explanation).toBe('string')
  })

  it('wrong answer: isCorrect=false, selectedIndex matches what was submitted', () => {
    const quiz = makeQuiz(2, 0)
    const result = scoreQuiz(quiz, [0, 1])
    const r1 = result.questionResults[1]
    expect(r1.questionId).toBe('q1')
    expect(r1.selectedIndex).toBe(1)
    expect(r1.correctIndex).toBe(0)
    expect(r1.isCorrect).toBe(false)
  })

  it('quizId in result matches the input quiz quizId', () => {
    const quiz = makeQuiz(10, 0)
    const result = scoreQuiz(quiz, new Array(10).fill(0))
    expect(result.quizId).toBe(quiz.quizId)
  })
})
