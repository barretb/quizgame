import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ScoreHistoryEntry {
  quizId: string
  quizTitle: string
  percentage: number
  correctCount: number
  totalQuestions: number
  takenAt: string
}

const COOKIE_NAME = 'quiz_score_history'
const MAX_ENTRIES = 20
const EXPIRE_DAYS = 365

function readCookie(): ScoreHistoryEntry[] {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`))
  if (!match) return []
  try {
    const raw = match.split('=').slice(1).join('=')
    return JSON.parse(decodeURIComponent(raw)) as ScoreHistoryEntry[]
  } catch {
    return []
  }
}

function writeCookie(entries: ScoreHistoryEntry[]): void {
  const value = encodeURIComponent(JSON.stringify(entries))
  const expires = new Date()
  expires.setDate(expires.getDate() + EXPIRE_DAYS)
  document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${expires.toUTCString()}`
}

export const useScoreHistoryStore = defineStore('scoreHistory', () => {
  const history = ref<ScoreHistoryEntry[]>([])

  function loadFromCookie() {
    history.value = readCookie()
  }

  function addEntry(entry: ScoreHistoryEntry) {
    history.value = [entry, ...history.value].slice(0, MAX_ENTRIES)
    writeCookie(history.value)
  }

  function clearHistory() {
    history.value = []
    writeCookie([])
  }

  loadFromCookie()

  return { history, loadFromCookie, addEntry, clearHistory }
})
