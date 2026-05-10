import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useScoreHistoryStore } from '../stores/scoreHistoryStore'
import type { ScoreHistoryEntry } from '../stores/scoreHistoryStore'

const COOKIE_NAME = 'quiz_score_history'

function clearCookie() {
  document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

function makeEntry(overrides: Partial<ScoreHistoryEntry> = {}): ScoreHistoryEntry {
  return {
    quizId: 'quiz-1',
    quizTitle: 'General Knowledge',
    percentage: 80,
    correctCount: 8,
    totalQuestions: 10,
    takenAt: '2026-01-15T12:00:00.000Z',
    ...overrides
  }
}

describe('useScoreHistoryStore', () => {
  beforeEach(() => {
    clearCookie()
    setActivePinia(createPinia())
  })

  // -------------------------------------------------------------------------
  // addEntry — state
  // -------------------------------------------------------------------------

  it('addEntry: adds one entry to the history state', () => {
    const store = useScoreHistoryStore()
    store.addEntry(makeEntry())
    expect(store.history).toHaveLength(1)
  })

  it('addEntry: entry fields are preserved in state', () => {
    const store = useScoreHistoryStore()
    const entry = makeEntry({ quizId: 'q-abc', quizTitle: 'My Quiz', percentage: 70 })
    store.addEntry(entry)
    expect(store.history[0].quizId).toBe('q-abc')
    expect(store.history[0].quizTitle).toBe('My Quiz')
    expect(store.history[0].percentage).toBe(70)
  })

  it('addEntry: newest entry appears first (prepend order)', () => {
    const store = useScoreHistoryStore()
    store.addEntry(makeEntry({ quizId: 'first', takenAt: '2026-01-01T00:00:00Z' }))
    store.addEntry(makeEntry({ quizId: 'second', takenAt: '2026-01-02T00:00:00Z' }))
    expect(store.history[0].quizId).toBe('second')
    expect(store.history[1].quizId).toBe('first')
  })

  // -------------------------------------------------------------------------
  // addEntry — cookie persistence
  // -------------------------------------------------------------------------

  it('addEntry: persists to the quiz_score_history cookie', () => {
    const store = useScoreHistoryStore()
    store.addEntry(makeEntry({ quizId: 'cookie-test' }))
    expect(document.cookie).toContain(COOKIE_NAME)
  })

  it('addEntry: cookie contains serialized JSON with the entry', () => {
    const store = useScoreHistoryStore()
    store.addEntry(makeEntry({ quizId: 'cookie-json' }))
    const match = document.cookie.split('; ').find((r) => r.startsWith(`${COOKIE_NAME}=`))
    expect(match).toBeTruthy()
    const raw = match!.split('=').slice(1).join('=')
    const parsed = JSON.parse(decodeURIComponent(raw)) as ScoreHistoryEntry[]
    expect(parsed[0].quizId).toBe('cookie-json')
  })

  // -------------------------------------------------------------------------
  // loadFromCookie — restore on init
  // -------------------------------------------------------------------------

  it('loadFromCookie: history is empty when no cookie exists', () => {
    const store = useScoreHistoryStore()
    expect(store.history).toHaveLength(0)
  })

  it('loadFromCookie: restores history from cookie when store is initialized', () => {
    const entry = makeEntry({ quizId: 'restored' })
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify([entry]))}; path=/`
    // Fresh pinia + store init reads cookie
    setActivePinia(createPinia())
    const store = useScoreHistoryStore()
    expect(store.history).toHaveLength(1)
    expect(store.history[0].quizId).toBe('restored')
  })

  it('loadFromCookie: restores multiple entries in correct order', () => {
    const entries = [
      makeEntry({ quizId: 'newest', takenAt: '2026-02-01T00:00:00Z' }),
      makeEntry({ quizId: 'oldest', takenAt: '2026-01-01T00:00:00Z' })
    ]
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(entries))}; path=/`
    setActivePinia(createPinia())
    const store = useScoreHistoryStore()
    expect(store.history[0].quizId).toBe('newest')
    expect(store.history[1].quizId).toBe('oldest')
  })

  // -------------------------------------------------------------------------
  // History cap — 20 entries max
  // -------------------------------------------------------------------------

  it('addEntry: history length does not exceed 20 entries', () => {
    const store = useScoreHistoryStore()
    for (let i = 0; i < 25; i++) {
      store.addEntry(makeEntry({ quizId: `q${i}`, takenAt: `2026-01-${String(i + 1).padStart(2, '0')}T00:00:00Z` }))
    }
    expect(store.history).toHaveLength(20)
  })

  it('addEntry: oldest entry is dropped when 21st entry is added', () => {
    const store = useScoreHistoryStore()
    // Add 20 entries — q0 will be the oldest (added first, pushed to end by prepend)
    for (let i = 0; i < 20; i++) {
      store.addEntry(makeEntry({ quizId: `q${i}` }))
    }
    // q0 is now at index 19 (oldest)
    expect(store.history[19].quizId).toBe('q0')
    // Add 21st — q0 should be evicted
    store.addEntry(makeEntry({ quizId: 'q20' }))
    expect(store.history).toHaveLength(20)
    expect(store.history.some((e) => e.quizId === 'q0')).toBe(false)
  })

  // -------------------------------------------------------------------------
  // clearHistory
  // -------------------------------------------------------------------------

  it('clearHistory: empties the history state', () => {
    const store = useScoreHistoryStore()
    store.addEntry(makeEntry())
    store.clearHistory()
    expect(store.history).toHaveLength(0)
  })

  it('clearHistory: overwrites cookie with empty array', () => {
    const store = useScoreHistoryStore()
    store.addEntry(makeEntry())
    store.clearHistory()
    const match = document.cookie.split('; ').find((r) => r.startsWith(`${COOKIE_NAME}=`))
    if (match) {
      const raw = match.split('=').slice(1).join('=')
      const parsed = JSON.parse(decodeURIComponent(raw))
      expect(parsed).toEqual([])
    } else {
      // Cookie was cleared entirely — also acceptable
      expect(true).toBe(true)
    }
  })
})
