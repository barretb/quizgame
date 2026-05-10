# Miss Scarlett — History

## Project: QuizGame

**Requested by:** Barret

### Context
Web app quiz game. Users select from installed quizzes (10+ multiple choice questions per topic), answer questions, track their score, and post final score to social media.

Key UI concerns: quiz selection screen, question/answer flow, score tracker, results screen with social share button.

Stack TBD — to be determined with Barret.

## Learnings

### 2026-05-09T21:00:15 — POST /api/scores Wired End-to-End

**Task:** Wire `POST /api/scores` into the quiz completion flow.

**Actions:**
- Added `ScoreRequest`, `QuestionResult`, `ScoreResponse` interfaces + `postScore()` function to `frontend/src/api/client.ts`
- Added `scoreResponse` ref and `submitScore(quiz, answers)` action to `frontend/src/stores/scoreStore.ts`
  - Maps `answers: (number | null)[]` → `{questionId, selectedIndex}[]` skipping nulls
  - Calls `postScore()`, stores full response in `scoreResponse`, syncs `score`/`total` from API response
- Updated `frontend/src/views/QuizView.vue`: on last question, replaced `scoreStore.setResult()` with `await scoreStore.submitScore()`. Added `submitting` ref + "Submitting…" spinner overlay. Error state shown if API call fails.
- Updated `frontend/src/views/ResultsView.vue`: added passed/failed badge from `scoreStore.scoreResponse.passed`; added per-question review section from `scoreStore.scoreResponse.questionResults` (correct/incorrect, selected vs correct index, explanation).

**Findings:**
- `setResult()` preserved for backward compatibility (still exported, not removed) — useful if offline fallback is ever needed.
- The `quizStore.answers` array (indexed by question position) maps cleanly to `{questionId, selectedIndex}` using `quiz.questions[i].questionId`.
- Navigation to results only happens AFTER `postScore()` resolves, so the score data is guaranteed to be in the store when ResultsView mounts.
- Build clean: 65 modules, 678ms ✅

**Reported to:** `.squad/decisions/inbox/scarlett-postscore-wired.md`

### 2026-05-09T21:00:15 — Frontend Integration Check

**Task:** Verify env setup, build integrity, and API contract alignment.

**Actions:**
- Created `frontend/.env.local` (was missing) with `VITE_API_BASE_URL=http://localhost:5000`
- Confirmed clean production build: 65 modules, 670ms ✅

**Findings:**
- `client.ts` reads `VITE_API_BASE_URL` correctly with `localhost:5000` fallback ✅
- Router routes (`/`, `/quiz/:id`, `/results/:id`) are all correct, no hardcoded localhost in views ✅
- GET /api/quizzes and GET /api/quizzes/{id} field names are exact matches to API contract ✅
- **GAP: POST /api/scores is never called.** `client.ts` has no `postScore()`. `QuizView.vue` finishes the quiz client-side and navigates to results without any HTTP POST. The `scoreStore` computes all values locally.
- If POST is added later, `quizStore.answers` (`number[]` by position) will need to be mapped to `[{questionId, selectedIndex}]` using `quiz.questions[i].questionId`.
- API response fields `passed` and `questionResults` are not used anywhere in the frontend.

**Reported to:** `.squad/decisions/inbox/scarlett-integration-check.md`

### 2026-05-09T20:45:11 — Frontend Scaffold Complete

**Built:** Full Vue 3 + Vite + Pinia + Vue Router frontend at `frontend/`.

**Key files:**
- `frontend/src/api/client.ts` — typed fetch wrapper; `getQuizzes()` and `getQuiz(id)` against `VITE_API_BASE_URL`
- `frontend/src/stores/quizStore.ts` — quiz nav state: quiz data, currentQuestionIndex, answers array, submitAnswer/advance
- `frontend/src/stores/scoreStore.ts` — scoring: score/total/stars (0-3)/shareText computed from percentage buckets
- `frontend/src/router/index.ts` — `/`, `/quiz/:id`, `/results/:id` (lazy-loaded)
- `frontend/src/App.vue` — sticky header with brand logo
- `frontend/src/views/HomeView.vue` — grid of QuizCard components, loading/error/empty states
- `frontend/src/views/QuizView.vue` — full quiz loop: load on mount, one question at a time, immediate green/red feedback, explanation shown post-answer, auto-advance after 1500ms, lock options on selection
- `frontend/src/views/ResultsView.vue` — score display, star animation, share button; redirects home if no score data
- `frontend/src/components/QuizCard.vue` — clickable card with topic badge, title, description, question count
- `frontend/src/components/QuestionDisplay.vue` — question text + number/total meta
- `frontend/src/components/AnswerOption.vue` — 4-state button: default/selected/correct/incorrect; label letters A/B/C/D
- `frontend/src/components/ScoreTracker.vue` — live score pill shown in quiz header
- `frontend/src/components/ProgressBar.vue` — animated gradient fill, aria progressbar
- `frontend/src/components/ShareModal.vue` — Teleport modal; Web Share API + Twitter + Facebook fallback
- `frontend/src/components/StarRating.vue` — 3 stars, pop animation on fill

**UX decisions:**
- Auto-advance delay: 1500ms (slightly longer than original 1200ms plan — gives time to read explanation)
- Explanation text shown immediately after answer selection (UX bonus)
- Dark theme throughout; gradient hero text on HomeView
- Stars animate in 200ms after ResultsView mounts for drama

**Infra:**
- `src/env.d.ts` with `/// <reference types="vite/client" />` needed for `import.meta.env`
- tsconfig excludes `src/__tests__/**` — Peacock's test files were already present
- Clean production build confirmed: 65 modules, 670ms

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
