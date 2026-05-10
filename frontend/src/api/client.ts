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

export const api = {
  getQuizzes(): Promise<QuizSummary[]> {
    return get<QuizSummary[]>('/api/quizzes')
  },
  getQuiz(id: string): Promise<Quiz> {
    return get<Quiz>(`/api/quizzes/${id}`)
  }
}
