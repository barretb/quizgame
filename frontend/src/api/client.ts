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
  dateAdded: string
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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Fetch error: ${response.status} ${response.statusText}`)
  }
  return response.json() as Promise<T>
}

export const api = {
  getQuizzes(): Promise<QuizSummary[]> {
    return fetchJson<QuizSummary[]>('/quizzes/index.json')
  },
  getQuiz(id: string): Promise<Quiz> {
    return fetchJson<Quiz>(`/quizzes/${id}.json`)
  }
}

export function scoreQuiz(quiz: Quiz, answers: (number | null)[]): ScoreResponse {
  const questionResults: QuestionResult[] = quiz.questions.map((q, i) => {
    const selectedIndex = answers[i] ?? -1
    const isCorrect = selectedIndex === q.correctIndex
    return {
      questionId: q.questionId,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation
    }
  })

  const correctCount = questionResults.filter(r => r.isCorrect).length
  const total = quiz.questions.length
  const percentage = total > 0 ? Math.round((correctCount / total) * 1000) / 10 : 0
  const passed = percentage >= 60

  return {
    quizId: quiz.quizId,
    totalQuestions: total,
    correctCount,
    percentage,
    passed,
    questionResults
  }
}
