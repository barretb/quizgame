# Miss Scarlett — Frontend Dev History

## Session: 2026-05-09

### Work done
- Scaffolded full Vue 3 frontend: Vite, Pinia, Vue Router, TypeScript, Composition API
- Built HomeView, QuizView, ResultsView, QuizCard, QuestionDisplay, AnswerOption, StarRating, ProgressBar, ScoreTracker, ShareModal
- Created quizStore and scoreStore (two-store separation by concern)
- Wired POST /api/scores end-to-end: scoreStore.submitScore → ResultsView pass/fail badge + question review
- Added .env.local, tsconfig references, env.d.ts

### 2026-05-09 — Quiz UX improvements (score history, pause delay, Next Question button)

- **Score history cap raised to 100**: Changed `MAX_ENTRIES` from 20 to 100 in `scoreHistoryStore.ts`. FIFO behaviour (`[entry, ...history].slice(0, MAX_ENTRIES)`) was already correct — only the constant needed updating.

- **Auto-advance delay increased to 3000ms**: Changed `ADVANCE_DELAY_MS` from 1500 to 3000 in `QuizView.vue`. This gives users more time to read the explanation and correct/incorrect feedback before the next question loads.

- **Next Question / See Results button**: Extracted advance logic from `selectAnswer` into a new `doAdvance()` async function that clears the timer and navigates. `selectAnswer` now sets a `setTimeout` (instead of `await`ing a Promise) so the timer ID is cancellable. A `btn-next` button renders (with `fade-in` animation) after an answer is selected; it calls `doAdvance()` immediately, cancelling the timer. Label is "See Results →" on the last question, "Next Question →" otherwise. Styled with the same primary gradient (`var(--color-primary) → #a78bfa`) used across the app.

- **Timer cleanup on remount**: `onMounted` now calls `clearTimeout` on any stale `advanceTimer` before resetting state, preventing ghost advances if the component is unmounted mid-timer.

- **Build**: 66 modules, 600ms, exit 0.

### 2026-05-09 — App link in social share feature

- **VITE_APP_URL env var**: Added `VITE_APP_URL=http://localhost:5173` to `frontend/.env` and `frontend/.env.example`. Read in `ShareModal.vue` via `import.meta.env.VITE_APP_URL || window.location.origin`. `.env` is for local dev; `.env.example` documents it for deployment.

- **shareText separation of concerns**: Moved the URL out of `scoreStore.shareText` so the store produces only the score message (`I scored X/Y on "Quiz" in Barret's Quiz Game! 🎉\n#BarretsQuizGame #QuizGame`). `ShareModal.vue` owns the "Play at: URL" line, keeping concerns clean.

- **fullShareText computed**: `ShareModal.vue` derives `fullShareText = shareText + \nPlay at: appUrl`. This is what gets encoded into Bluesky/Mastodon URLs and shown in the modal preview, ensuring the URL appears on its own line.

- **Web Share API `url` property**: Passing `url: appUrl` separately to `navigator.share()` is the correct Web Share API pattern — the OS/browser can display or handle the URL distinctly from the `text` field on mobile native share sheets.

- **Removed `shareUrl` prop**: The old `shareUrl?: string` prop on ShareModal was unused (ResultsView never passed it). Removed it to keep the API clean; `appUrl` is now always sourced from the env var with `window.location.origin` fallback.

- **Build**: 66 modules, 616ms, exit 0.

### 2026-05-09 — Search, Sort, Score History features

- **dateAdded on QuizSummary**: Added `dateAdded: string` to the `QuizSummary` interface in `client.ts`. The backend will need to include this field in the `GET /api/quizzes` response; lexicographic ISO string comparison works for sort without Date parsing overhead, though we parse as Date for correctness.

- **Pinia store inside action**: `useScoreHistoryStore()` is called *inside* `submitScore()` rather than at store definition time to avoid circular dependency issues between Pinia stores. Pinia resolves the store instance correctly when called lazily.

- **Cookie encoding**: Used `encodeURIComponent/decodeURIComponent` around the JSON payload to safely handle quotes and special chars in quiz titles. Set `path=/` and 365-day expiry to ensure the cookie persists across routes.

- **historyExpanded default**: Initialized `historyExpanded` from `window.innerWidth >= 768` at script setup time (not reactive to resize) — a reasonable SSR-safe approximation; desktop users see history open, mobile users see it collapsed.

- **filteredQuizzes computed**: Applied search *before* sort so sort always operates on the already-filtered subset. Used spread (`[...list].sort(...)`) to avoid mutating the original array ref.

- **Empty state differentiation**: Two distinct empty states — `quizzes.length === 0` (no quizzes at all) vs `filteredQuizzes.length === 0` (no search match) — so the user gets appropriate messaging.

- **Build**: 66 modules (was 65 before scoreHistoryStore was added). All clean, exit 0.

- **Cross-team coordination**: Orchestration log recorded by Scribe. Tests written by Mrs. Peacock verify search, sort, and score history features. Decision document merged to decisions.md.

### 2026-05-09 — App renamed to "Barret's Quiz Game"

- **Locations updated**: `frontend/index.html` `<title>`, `frontend/dist/index.html` `<title>`, `frontend/src/App.vue` nav brand-name span, `frontend/src/components/ShareModal.vue` `navigator.share` title string. No occurrences in HomeView (hero title is generic "Test Your Knowledge"), appsettings.json (no app name field), or package.json name (kept as `quizgame-frontend` — code identifier, not display text).
- **Apostrophe in JS**: Used double quotes for the `navigator.share` title string (`"Barret's Quiz Game"`) to avoid escaping the apostrophe inside single-quoted JS string.
- **dist/index.html**: Updated the build artifact alongside the source — it will be overwritten on next `npm run build`, but keeping it consistent avoids stale branding if the dist is served before a rebuild.
