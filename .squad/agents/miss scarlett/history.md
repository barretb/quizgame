# Miss Scarlett — Frontend Dev History

## Session: 2026-05-09

### Work done
- Scaffolded full Vue 3 frontend: Vite, Pinia, Vue Router, TypeScript, Composition API
- Built HomeView, QuizView, ResultsView, QuizCard, QuestionDisplay, AnswerOption, StarRating, ProgressBar, ScoreTracker, ShareModal
- Created quizStore and scoreStore (two-store separation by concern)
- Wired POST /api/scores end-to-end: scoreStore.submitScore → ResultsView pass/fail badge + question review
- Added .env.local, tsconfig references, env.d.ts

## Learnings

### 2026-05-09 — Search, Sort, Score History features

- **dateAdded on QuizSummary**: Added `dateAdded: string` to the `QuizSummary` interface in `client.ts`. The backend will need to include this field in the `GET /api/quizzes` response; lexicographic ISO string comparison works for sort without Date parsing overhead, though we parse as Date for correctness.

- **Pinia store inside action**: `useScoreHistoryStore()` is called *inside* `submitScore()` rather than at store definition time to avoid circular dependency issues between Pinia stores. Pinia resolves the store instance correctly when called lazily.

- **Cookie encoding**: Used `encodeURIComponent/decodeURIComponent` around the JSON payload to safely handle quotes and special chars in quiz titles. Set `path=/` and 365-day expiry to ensure the cookie persists across routes.

- **historyExpanded default**: Initialized `historyExpanded` from `window.innerWidth >= 768` at script setup time (not reactive to resize) — a reasonable SSR-safe approximation; desktop users see history open, mobile users see it collapsed.

- **filteredQuizzes computed**: Applied search *before* sort so sort always operates on the already-filtered subset. Used spread (`[...list].sort(...)`) to avoid mutating the original array ref.

- **Empty state differentiation**: Two distinct empty states — `quizzes.length === 0` (no quizzes at all) vs `filteredQuizzes.length === 0` (no search match) — so the user gets appropriate messaging.

- **Build**: 66 modules (was 65 before scoreHistoryStore was added). All clean, exit 0.

- **Cross-team coordination**: Orchestration log recorded by Scribe. Tests written by Mrs. Peacock verify search, sort, and score history features. Decision document merged to decisions.md.
