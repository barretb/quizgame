# Miss Scarlett — History

## Project: QuizGame

**Requested by:** Barret

### Context

Web app quiz game. Users select from installed quizzes (10+ multiple choice questions per topic), answer questions, track their score, and post final score to social media.

Key frontend concerns: interactive quiz UX, component state management, API type safety, responsive design, social share integration.

Stack: Vue 3 + Vite + Pinia + Vue Router, Composition API, TypeScript, dark theme.

## Learnings

### 2026-05-09 — Frontend SPA scaffolded

**Frontend deliverables:**
- Vue 3 SPA with Vite at frontend/
- 7 components: QuizList, QuizView, ResultsView, AnswerOption, ProgressBar, ExplanationDisplay, ShareModal
- 3 views: Home (quiz listing), Quiz (interactive taking), Results (final score)
- 2 Pinia stores: quizStore (quiz navigation), scoreStore (scoring/results)
- Typed API client with fetch wrapper for backend endpoints
- Vue Router for client-side navigation

**UX features:**
- Auto-advance delay: 1500ms (extended 300ms to allow explanation reading)
- Explanation text displayed immediately after answer selection (UX bonus, pre-advance)
- 3-star rating system: 0-39%→0, 40-59%→1, 60-79%→2, 80-100%→3
- Progress bar showing (currentQuestion / totalQuestions) * 100
- AnswerOption state machine: default → selected → (correct|incorrect), all locked after submission
- Rapid clicking protection: options non-interactive after first selection

**Build & tooling:**
- 65 modules, clean build verified
- src/env.d.ts added for Vite import.meta.env type support (prevents TS errors in vue-tsc)
- tsconfig.json excludes src/__tests__/** from main build (allows build success despite test file imports)
- Dark theme: CSS custom properties with dark background (#0f0f1a), purple primary (#6c63ff), green/red success/error accents

**API contract integration:**
- Consumes GET /api/quizzes (returns QuizSummary list without questions array)
- Consumes GET /api/quizzes/{id} (returns full Quiz with correctIndex for client-side scoring)
- Posts to POST /api/scores (sends answers, receives ScoreResult)
- Full camelCase property name handling

**Cross-agent notes for Green:** Backend API contract is binding—all responses must use camelCase. GET /api/quizzes returns "id" field (used for routing). GET /api/quizzes/{id} must include correctIndex. All property names must match contract exactly.

**Cross-agent notes for Peacock:** tsconfig.json excludes src/__tests__/** from main TypeScript build. Test files should use separate tsconfig.test.json or vitest include config with vitest type definitions. The exclude ensures npm run build succeeds even with pending test stubs.
