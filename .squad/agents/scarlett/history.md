# Miss Scarlett — History

## Project: QuizGame

**Requested by:** Barret

### Context
Web app quiz game. Users select from installed quizzes (10+ multiple choice questions per topic), answer questions, track their score, and post final score to social media.

Key UI concerns: quiz selection screen, question/answer flow, score tracker, results screen with social share button.

Stack TBD — to be determined with Barret.

## Learnings

### 2026-05-09T20:36:16 — Vue Frontend Design

**Stack locked:** Vue 3 + Vite + Pinia + Vue Router. Composition API (`<script setup>`) throughout.

**Project structure:**
- `views/` — HomeView, QuizView, ResultsView
- `components/` — QuizCard, QuestionDisplay, AnswerOption, ScoreTracker, ShareModal, ProgressBar, StarRating
- `stores/` — quizStore (quiz nav), scoreStore (scoring)
- `router/` — route definitions (/, /quiz/:id, /results)
- `services/` — quizApi.js wrapping fetch against VITE_API_BASE_URL
- `assets/` — static assets

**UX patterns:**
- Auto-advance after answer: 1200ms highlight delay, then next question
- Progress bar driven by currentQuestionIndex / totalQuestions
- Star rating on results (0–5 stars from score percentage)

**State management:**
- quizStore owns: currentQuiz, questions[], currentQuestionIndex, answers[]
- scoreStore owns: currentScore, totalQuestions, quizTitle
- Reset called on new quiz start

**Social share:**
- Web Share API first (mobile-native dialog)
- Fallback: Twitter intent + Facebook sharer URL buttons
- Share text template: "I scored {score}/{total} on the {title} quiz! 🎯 Try it yourself at {url} #QuizGame"

**API integration:**
- All calls through services/quizApi.js
- GET /api/quizzes → HomeView list
- GET /api/quizzes/{id} → QuizView bootstrap
- Base URL from import.meta.env.VITE_API_BASE_URL

---

### 2026-05-09T20:36:16 — Scoring Approach Cross-Team Decision

**Decision:** Client-side scoring using `correctIndex` from backend API.

**Frontend implementation:** When user selects an answer, immediately compare against `correctIndex` from the question object. Render correct/incorrect visual state, then auto-advance after 1200ms. No server round-trip needed for scoring.

**API contract:** `GET /api/quizzes/{id}` response includes `correctIndex` (integer index into options array) for each question. This is intentional — UX trumps answer obscurity.

**Impact for component flow:**
- QuestionDisplay receives question with `correctIndex` prop
- AnswerOption compares selection to `correctIndex`, transitions to correct/incorrect state
- ScoreTracker increments running score only on correct selections
- ShareModal displays final score (calculated from running total)
