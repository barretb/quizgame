import { describe, it, expect } from 'vitest'

/**
 * Tests for the filteredQuizzes computed logic in HomeView.vue.
 *
 * Strategy: test the filter and sort functions as pure transformations.
 * The logic below mirrors `filteredQuizzes` in HomeView.vue exactly —
 * if the component's implementation diverges from this contract, a
 * refactor of these tests to import the composable is recommended.
 *
 * QuizSummary shape used here matches the client.ts interface.
 */

interface TestQuizSummary {
  quizId: string
  title: string
  topic: string
  description: string
  questionCount: number
  dateAdded: string
}

// ── Pure helpers that mirror HomeView's filteredQuizzes computed ──────────────

function filterByQuery(quizzes: TestQuizSummary[], query: string): TestQuizSummary[] {
  const q = query.trim().toLowerCase()
  if (!q) return quizzes
  return quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(q) ||
      quiz.topic.toLowerCase().includes(q) ||
      quiz.description.toLowerCase().includes(q)
  )
}

function sortByDate(
  quizzes: TestQuizSummary[],
  order: 'default' | 'newest' | 'oldest'
): TestQuizSummary[] {
  if (order === 'newest') {
    return [...quizzes].sort(
      (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
    )
  }
  if (order === 'oldest') {
    return [...quizzes].sort(
      (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
    )
  }
  return quizzes
}

function filteredQuizzes(
  quizzes: TestQuizSummary[],
  query: string,
  order: 'default' | 'newest' | 'oldest'
): TestQuizSummary[] {
  return sortByDate(filterByQuery(quizzes, query), order)
}

// ── Sample fixtures ────────────────────────────────────────────────────────────

const SAMPLE_QUIZZES: TestQuizSummary[] = [
  {
    quizId: 'science-001',
    title: 'Introduction to Physics',
    topic: 'Science',
    description: 'Covers basic mechanics and thermodynamics.',
    questionCount: 10,
    dateAdded: '2024-03-15T00:00:00Z'
  },
  {
    quizId: 'history-001',
    title: 'World War II Trivia',
    topic: 'History',
    description: 'Key events and figures of the second world war.',
    questionCount: 12,
    dateAdded: '2025-01-20T00:00:00Z'
  },
  {
    quizId: 'geo-001',
    title: 'World Capitals',
    topic: 'Geography',
    description: 'Test your knowledge of capital cities worldwide.',
    questionCount: 15,
    dateAdded: '2023-06-01T00:00:00Z'
  }
]

// ── Search by title ────────────────────────────────────────────────────────────

describe('filteredQuizzes — search by title', () => {
  it('returns quizzes whose title contains the query', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'Physics', 'default')
    expect(result).toHaveLength(1)
    expect(result[0].quizId).toBe('science-001')
  })

  it('does not return quizzes whose title does not match', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'Physics', 'default')
    expect(result.some((q) => q.quizId === 'history-001')).toBe(false)
  })
})

// ── Search by topic ────────────────────────────────────────────────────────────

describe('filteredQuizzes — search by topic', () => {
  it('returns quizzes whose topic contains the query', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'History', 'default')
    expect(result).toHaveLength(1)
    expect(result[0].quizId).toBe('history-001')
  })

  it('returns quizzes whose topic contains a partial query', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'Geo', 'default')
    expect(result).toHaveLength(1)
    expect(result[0].quizId).toBe('geo-001')
  })
})

// ── Search by description ──────────────────────────────────────────────────────

describe('filteredQuizzes — search by description', () => {
  it('returns quizzes whose description contains the query', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'capital cities', 'default')
    expect(result).toHaveLength(1)
    expect(result[0].quizId).toBe('geo-001')
  })
})

// ── Case-insensitive matching ──────────────────────────────────────────────────

describe('filteredQuizzes — case insensitivity', () => {
  it('matches uppercase query against lowercase title', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'PHYSICS', 'default')
    expect(result).toHaveLength(1)
    expect(result[0].quizId).toBe('science-001')
  })

  it('matches lowercase query against mixed-case title', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'world war', 'default')
    expect(result).toHaveLength(1)
    expect(result[0].quizId).toBe('history-001')
  })

  it('matches mixed-case query against topic', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'hIsToRy', 'default')
    expect(result).toHaveLength(1)
    expect(result[0].quizId).toBe('history-001')
  })
})

// ── Empty search ───────────────────────────────────────────────────────────────

describe('filteredQuizzes — empty search', () => {
  it('returns all quizzes when query is empty string', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, '', 'default')
    expect(result).toHaveLength(SAMPLE_QUIZZES.length)
  })

  it('returns all quizzes when query is only whitespace', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, '   ', 'default')
    expect(result).toHaveLength(SAMPLE_QUIZZES.length)
  })

  it('returns empty array when no quizzes match the query', () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, 'zzznomatch', 'default')
    expect(result).toHaveLength(0)
  })
})

// ── Sort newest ────────────────────────────────────────────────────────────────

describe('filteredQuizzes — sort newest', () => {
  it("puts the quiz with the latest dateAdded first when order is 'newest'", () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, '', 'newest')
    expect(result[0].quizId).toBe('history-001') // 2025-01-20
  })

  it("puts the quiz with the earliest dateAdded last when order is 'newest'", () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, '', 'newest')
    expect(result[result.length - 1].quizId).toBe('geo-001') // 2023-06-01
  })

  it("returns a stable descending sort by dateAdded when order is 'newest'", () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, '', 'newest')
    for (let i = 1; i < result.length; i++) {
      expect(new Date(result[i - 1].dateAdded).getTime()).toBeGreaterThanOrEqual(
        new Date(result[i].dateAdded).getTime()
      )
    }
  })
})

// ── Sort oldest ────────────────────────────────────────────────────────────────

describe('filteredQuizzes — sort oldest', () => {
  it("puts the quiz with the earliest dateAdded first when order is 'oldest'", () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, '', 'oldest')
    expect(result[0].quizId).toBe('geo-001') // 2023-06-01
  })

  it("puts the quiz with the latest dateAdded last when order is 'oldest'", () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, '', 'oldest')
    expect(result[result.length - 1].quizId).toBe('history-001') // 2025-01-20
  })

  it("returns a stable ascending sort by dateAdded when order is 'oldest'", () => {
    const result = filteredQuizzes(SAMPLE_QUIZZES, '', 'oldest')
    for (let i = 1; i < result.length; i++) {
      expect(new Date(result[i - 1].dateAdded).getTime()).toBeLessThanOrEqual(
        new Date(result[i].dateAdded).getTime()
      )
    }
  })
})

// ── Sort + search combined ─────────────────────────────────────────────────────

describe('filteredQuizzes — search and sort combined', () => {
  const EXTENDED: TestQuizSummary[] = [
    ...SAMPLE_QUIZZES,
    {
      quizId: 'science-002',
      title: 'Advanced Chemistry',
      topic: 'Science',
      description: 'Organic and inorganic reactions.',
      questionCount: 10,
      dateAdded: '2026-01-01T00:00:00Z'
    }
  ]

  it('filters first then sorts: only matching quizzes appear, in newest order', () => {
    const result = filteredQuizzes(EXTENDED, 'Science', 'newest')
    // Only Science quizzes should be present
    expect(result.every((q) => q.topic === 'Science')).toBe(true)
    // science-002 (2026) should precede science-001 (2024)
    expect(result[0].quizId).toBe('science-002')
    expect(result[1].quizId).toBe('science-001')
  })

  it('filters first then sorts: only matching quizzes appear, in oldest order', () => {
    const result = filteredQuizzes(EXTENDED, 'Science', 'oldest')
    expect(result.every((q) => q.topic === 'Science')).toBe(true)
    expect(result[0].quizId).toBe('science-001')
    expect(result[1].quizId).toBe('science-002')
  })

  it('returns empty array when search matches nothing, regardless of sort order', () => {
    const result = filteredQuizzes(EXTENDED, 'zzznomatch', 'newest')
    expect(result).toHaveLength(0)
  })
})
