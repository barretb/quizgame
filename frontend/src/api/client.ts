export interface ScoreRequest {
  quizId: string
  answers: { questionId: string; selectedIndex: number }[]
}

export interface QuestionResult {
  questionId: string
  selectedIndex: number
  correctIndex: number
  isCorrect: boolean
  explanation: string
}

export interface ScoreResponse {
  quizId: string
  totalQuestions: number
  correctCount: number
  percentage: number
  passed: boolean
  questionResults: QuestionResult[]
}

export interface QuizSummary {
  quizId: string
  title: string
  topic: string
  description: string
  questionCount: number
}

export interface Question {
  questionId: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Quiz {
  quizId: string
  title: string
  topic: string
  description: string
  version: string
  questions: Question[]
}

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:5000'

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

export async function postScore(payload: ScoreRequest): Promise<ScoreResponse> {
  const res = await fetch(`${BASE_URL}/api/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error(`postScore failed: ${res.status}`)
  return res.json()
}

export const api = {
  getQuizzes(): Promise<QuizSummary[]> {
    return get<QuizSummary[]>('/api/quizzes')
  },
  getQuiz(id: string): Promise<Quiz> {
    return get<Quiz>(`/api/quizzes/${id}`)
  }
}
