# Prof. Plum — History

## Project: QuizGame

**Requested by:** Barret

### Context
Web app quiz game. Users select from installed quizzes (10+ multiple choice questions per topic), answer questions, track their score, and post final score to social media.

Stack TBD — to be determined with Barret.

## Learnings

### 2026-05-09T20:36:16 — Full System Architecture Designed

**Stack confirmed:** Vue 3 + Vite + Pinia + Vue Router (frontend) / .NET Core 10 Web API (backend).

**Key architectural decisions:**
- SPA + REST API pattern. No SSR. Static frontend, JSON REST backend.
- Quiz data = JSON files in `/backend/Data/Quizzes/`, auto-discovered at startup. No database for v1.
- Quiz JSON schema is the team contract between Mr. Green (loader) and Miss Scarlett (renderer).
- Score tracking is fully client-side (Pinia) until quiz completion; only then POST /api/scores.
- Social sharing: Web Share API first, fallback to Twitter/X + Facebook direct links. No OAuth SDKs.
- Decisions filed to `.squad/decisions/inbox/plum-architecture.md` (ADR-001 through ADR-005).

**API surface defined:**
- GET /api/quizzes
- GET /api/quizzes/{id}
- POST /api/scores
- GET /api/health

**Vue component hierarchy defined:** HomeView → QuizCard list / QuizView → QuestionDisplay + AnswerOption + ScoreTracker / ResultsView → ShareModal.

---

### 2026-05-09T20:36:16 — Scoring Approach Cross-Team Decision

**Decision:** Client-side scoring with correctIndex sent to frontend.

**What this means:** `GET /api/quizzes/{id}` response includes `correctIndex` for each question. Frontend performs scoring immediately. Answers are visible in browser network tab.

**Strategic note:** This is a UX-first decision. The team accepts that answer correctness is visible to users (good UX for feedback) over security obscurity (preventing casual cheating). For a quiz game context, immediate feedback is more valuable than obscuring answers.

**Impact for this team:**
- Mr. Green: Include `Question.CorrectOptionIndex` in API response (confirmed in backend design)
- Miss Scarlett: Use correctIndex immediately for green/red visual feedback (1200ms delay before auto-advance)
- Barret: Intentional tradeoff documented and approved

---

### 2026-05-09T21:02:56 — Initial Source Code Committed

**Action:** Committed all source code scaffolding to main branch.

**Commit hash:** 5954ccc7ef08ae615c45fa8106c07c826355566c

**What was committed:**
- Backend: Complete .NET Core 10 Web API scaffold with 4 endpoints, service interfaces, 2 sample quizzes with 10 questions each
- Frontend: Complete Vue 3 + Vite + Pinia + TypeScript application with 7 components, 3 views, 2 stores (.env.local for dev setup)
- Tests: Test stubs for backend (xUnit) and frontend (Vitest with jsdom)
- Infra: .github/ workflows, .gitignore, .gitattributes, .specify/ extensions, .copilot/ skills

**Git status after:** Only .squad/ files remain untracked (owned by Scribe for team state management)

**Team readiness:** Backend and frontend are ready for feature branch development. Next: staging area protocols via .specify/ workflows.

---

### 2026-05-09T21:00:15 — Squad Orchestration: POST /api/scores Integration Complete

**Status:** ✅ Integration milestone reached

**What happened:** Miss Scarlett completed end-to-end wiring of `POST /api/scores` into quiz completion flow. This was the final integration gap (identified in her integration check).

**Integration complete:**
- Frontend now POSTs quiz answers to `/api/scores` on completion
- Results navigation gated on successful API response
- Pass/fail badge + per-question review now displayed in ResultsView
- Build verified clean: 65 modules, 678ms

**Commit incoming:** Two commits queued:
1. Source code commit with POST integration (client.ts, scoreStore, QuizView, ResultsView)
2. Squad state commit (.squad/ files)

**Team status:** All core features now wired end-to-end. Ready for testing and QA.
