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
