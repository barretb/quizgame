# Squad Decisions

## Active Decisions

### 2026-05-09: Project initialized
**By:** Barret (via Squad)
**What:** QuizGame project initialized. Team cast from the Clue universe: Prof. Plum (Lead), Miss Scarlett (Frontend), Mr. Green (Backend), Mrs. Peacock (Tester).
**Why:** Squad init — day-one record.

### 2026-05-09T20:36:16: Tech stack directive
**By:** Barret (via Copilot)
**What:** Frontend: Vue.js. Backend: .NET Core 10.
**Why:** User request — captured for team memory.

### 2026-05-09T20:36:16: Scoring approach decision
**By:** Barret
**What:** correctIndex IS sent to the frontend in GET /api/quizzes/{id}. Client-side scoring with immediate per-question green/red feedback. Answers are visible in network tab — accepted tradeoff for better UX.
**Why:** User chose UX over security obscurity for this quiz game context.

### 2026-05-09T20:36:16: SPA + REST API, no SSR (ADR-001)
**By:** Prof. Plum
**What:** Vue 3 SPA served as static files, communicating with a .NET Core 10 Web API over REST/JSON. No server-side rendering.
**Why:** Quiz-taking is highly interactive and state-heavy on the client. SSR adds complexity without benefit. Static hosting for frontend keeps deployment simple.

### 2026-05-09T20:36:16: Quiz data as JSON files (ADR-002)
**By:** Prof. Plum
**What:** Each quiz is a single `.json` file in `/backend/Data/Quizzes/`. Backend scans at startup and caches manifest in memory.
**Why:** No database needed for v1. Installing a quiz = dropping a file. Simple operational model; easy migration path to database later.

### 2026-05-09T20:36:16: Score tracking - client-side primary (ADR-003)
**By:** Prof. Plum
**What:** Pinia store tracks question index and running score during session. POST to `/api/scores` only at completion.
**Why:** Avoids chatty mid-quiz API calls. Score data is ephemeral until completion.

### 2026-05-09T20:36:16: Web Share API with fallbacks (ADR-004)
**By:** Prof. Plum
**What:** ShareModal uses `navigator.share()` (Web Share API) when available. Falls back to Twitter/X and Facebook share URLs.
**Why:** Web Share API gives native sheet on mobile (best UX). Fallback ensures universal support without OAuth or third-party SDKs.

### 2026-05-09T20:36:16: Quiz JSON schema as team contract (ADR-005)
**By:** Prof. Plum
**What:** JSON schema from architecture doc is binding. Both loader and renderer must conform. Changes require Lead sign-off.
**Why:** Decouples frontend and backend development. Either side can be built/tested independently against schema.

### 2026-05-09T20:36:16: Backend file-based quiz storage
**By:** Mr. Green
**What:** Quizzes stored as JSON files in `/backend/Data/Quizzes/` named `{quiz-id}.quiz.json`.
**Why:** Zero infrastructure, no DB. File I/O adequate at this scale. Enables "quiz plugin" UX.

### 2026-05-09T20:36:16: Backend in-memory quiz caching
**By:** Mr. Green
**What:** `QuizService` scans quiz directory once at startup and caches parsed list in `IMemoryCache`.
**Why:** Quiz files don't change at runtime. `IMemoryCache` is built-in, no extra dependency.

### 2026-05-09T20:36:16: IScoreRepository pattern for score persistence
**By:** Mr. Green
**What:** Score writes go through `IScoreRepository`. Initial: `InMemoryScoreRepository` (ConcurrentBag).
**Why:** Isolates persistence behind interface — swap to EF Core/SQL/CosmosDB with one-line DI change. In-memory acceptable for MVP.

### 2026-05-09T20:36:16: CORS policy configuration
**By:** Mr. Green
**What:** Named CORS policy `QuizGamePolicy` allows `http://localhost:5173` (Vite dev server) and configurable production origin.
**Why:** Vite defaults to port 5173. Hardcoding dev origin is safe and explicit.

### 2026-05-09T20:36:16: Swagger in development only
**By:** Mr. Green
**What:** `app.UseSwagger()` and `app.UseSwaggerUI()` gated behind `app.Environment.IsDevelopment()`.
**Why:** Keeps production surface clean; devs get interactive docs automatically.

### 2026-05-09T20:36:16: Frontend tech stack (Vue 3 + Vite + Pinia + Router)
**By:** Miss Scarlett
**What:** Vue 3 + Vite + Pinia + Vue Router. Composition API (`<script setup>`) throughout — no Options API.
**Why:** Standard modern Vue stack. Composition API is simpler and more flexible.

### 2026-05-09T20:36:16: Two Pinia stores by concern
**By:** Miss Scarlett
**What:** `quizStore` manages quiz navigation; `scoreStore` manages scoring. Separated by concern.
**Why:** Keeps stores focused and testable.

### 2026-05-09T20:36:16: Auto-advance after answer (1200ms)
**By:** Miss Scarlett
**What:** On answer selection, highlight correct/incorrect for 1200ms, then auto-advance. Options locked until advance.
**Why:** Gives users time to register feedback without stalling flow.

### 2026-05-09T20:36:16: AnswerOption state machine
**By:** Miss Scarlett
**What:** Four states: `default` → `selected` → (`correct` | `incorrect`). All options non-interactive after submission.
**Why:** Clear visual feedback and prevents interaction bugs.

### 2026-05-09T20:36:16: Progress bar in QuizView
**By:** Miss Scarlett
**What:** Visual progress bar driven by `(currentQuestionIndex / totalQuestions) * 100`.
**Why:** Gives users sense of completion momentum.

### 2026-05-09T20:36:16: Results view score representation
**By:** Miss Scarlett
**What:** Star rating (0–5 stars) plus numeric display ("8 / 10"). Stars bucketed from percentage.
**Why:** Clean and immediately readable.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
