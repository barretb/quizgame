# Mr. Green — History

## Project: QuizGame

**Requested by:** Barret

### Context
Web app quiz game. Users select from installed quizzes (10+ multiple choice questions per topic), answer questions, track their score, and post final score to social media.

Key backend concerns: quiz file format/schema, quiz loader, score engine, social share data generation.

Stack TBD — to be determined with Barret.

## Learnings

### 2026-05-09T20:36:16 — Backend Architecture Design

**Stack confirmed:** .NET Core 10, Minimal API style (Controllers registered via `AddControllers`), Vue.js frontend on port 5173.

**API Design Decisions:**
- `GET /api/quizzes` returns `List<QuizSummary>` (no questions) for performance — avoids sending potentially large question arrays on the list view
- `GET /api/quizzes/{id}` returns full `Quiz` with all questions — called only when a user starts a quiz
- `POST /api/scores` is stateless from the client's perspective; server calculates percentage and returns a message; no auth required for MVP
- `GET /health` is a lightweight liveness check (returns 200 + timestamp)

**Data Model Patterns:**
- `Quiz` and `QuizSummary` are separate C# records — `QuizSummary` is a projection of `Quiz` minus the `Questions` array. This avoids a JsonIgnore hack and makes the API contract explicit.
- `Question.CorrectOptionIndex` stores an integer index into `Options[]` — simple, avoids a separate "correct answer" string that could drift out of sync
- `ScoreSubmission` keeps `PlayerName` nullable — social sharing is optional
- `ScoreResult` returns both a human `Message` and a numeric `Percentage` so the frontend can render a result card without doing math

**Quiz Plugin System:**
- Files named `{quiz-id}.quiz.json` in `/backend/Data/Quizzes/`
- `QuizService` uses `Directory.GetFiles(path, "*.quiz.json")` and deserializes with `System.Text.Json`
- Results cached via `IMemoryCache` under key `"all_quizzes"` — absolute expiry of 1 hour (configurable) so file changes take effect on next cache miss without a full restart

**.NET Core 10 Specifics:**
- Top-level `Program.cs` (no `Startup.cs`) — clean minimal hosting model
- `WebApplication.CreateBuilder(args)` → configure services → `builder.Build()` → configure middleware → `app.Run()`
- `IMemoryCache` registered via `builder.Services.AddMemoryCache()`
- `System.Text.Json` used (no Newtonsoft) — .NET 10 STJ is fully featured
- Swagger via `Microsoft.AspNetCore.OpenApi` package (built-in .NET 9/10 OpenAPI support)

**IScoreRepository Pattern:**
- Interface: `IScoreRepository` with `Task AddAsync(ScoreRecord)` and `Task<IEnumerable<ScoreRecord>> GetAllAsync()`
- `InMemoryScoreRepository` uses `ConcurrentBag<ScoreRecord>` — thread-safe, no locking
- DI registration: `builder.Services.AddSingleton<IScoreRepository, InMemoryScoreRepository>()`
- Swapping to EF Core later = add `DbScoreRepository : IScoreRepository`, change one DI line

**CORS:**
- Named policy `"QuizGamePolicy"` to avoid magic strings
- Origins configurable via `appsettings.json` key `AllowedOrigins` (string array)
- Dev default includes `http://localhost:5173`

---

### 2026-05-09T20:36:16 — Scoring Approach Cross-Team Decision

**Decision:** Client-side scoring with `correctIndex` exposed in API response.

**Backend responsibility:** Include `Question.CorrectOptionIndex` in `GET /api/quizzes/{id}` response. This integer index identifies the correct option in each question's `Options[]` array.

**Strategic note:** Answer correctness is intentionally visible in the network tab. This is a UX-first tradeoff — immediate client-side feedback is more valuable than security obscurity for this quiz game context.

**API impact:**
- `Question` C# record MUST include `int CorrectOptionIndex` (confirmed in backend design)
- `POST /api/scores` endpoint still validates scores server-side for audit (client sends selected answers, backend recalculates)
- No change to `ScoreSubmission` or `ScoreResult` contracts

---

### 2026-05-09T20:45:11 — Backend Scaffold Completed

**What was built:** Full .NET Core 10 Minimal API backend at `C:\projects\quizgame\backend\QuizGame.Api\`.

**Key file paths:**
- `Program.cs` — all endpoints wired up (minimal API style)
- `Models/Quiz.cs`, `Question.cs`, `QuizSummary.cs`, `ScoreRequest.cs`, `ScoreResult.cs`, `QuestionResult.cs`, `ScoreRecord.cs`
- `Services/IQuizService.cs`, `Services/QuizService.cs` — file-based loader with IMemoryCache (1hr expiry)
- `Repositories/IScoreRepository.cs`, `Repositories/InMemoryScoreRepository.cs` — ConcurrentDictionary<Guid, ScoreRecord>
- `Data/Quizzes/world-capitals-001.json` — 10 real world capitals questions
- `Data/Quizzes/general-knowledge-001.json` — 10 general knowledge questions
- `appsettings.json` — AllowedOrigins: ["http://localhost:5173"]
- `Properties/launchSettings.json` — port 5000 (HTTP), 5001 (HTTPS)

**Binding contract implemented:**
- Quiz JSON schema: `quizId`, `title`, `topic`, `description`, `version`, `questions[]` with `questionId`, `text`, `options[]`, `correctIndex`, `explanation`
- Filename rule: `{quizId}.json` must match internal `quizId` field — enforced at load time
- Min 10 questions enforced by QuizService (skips non-compliant files with log warning)
- All responses use camelCase (System.Text.Json `PropertyNamingPolicy.CamelCase`)

**Endpoints verified (smoke tested):**
- `GET /health` → `{ status: "healthy", timestamp: "..." }` ✅
- `GET /api/quizzes` → list of 2 QuizSummary objects, no questions array ✅
- `GET /api/quizzes/{id}` → full Quiz with `correctIndex` in every question ✅
- `POST /api/scores` → calculates score server-side, returns ScoreResult ✅

**OpenAPI:** `Microsoft.AspNetCore.OpenApi` 10.0.7 — docs served at `/openapi/v1.json` in dev only.

**Decisions made during scaffold:**
- Used `ConcurrentDictionary<Guid, ScoreRecord>` (per task spec) instead of ConcurrentBag
- `QuizSummary.Id` field (not `quizId`) to match task spec for the list endpoint
- `Content Update` (not `Include`) in .csproj for quiz JSON files to avoid NETSDK1022 duplicate items error
- Camelcase serialization applied globally via `ConfigureHttpJsonOptions` — no need for `[JsonPropertyName]` attributes on records

---

### 2026-05-09T21:00:15 — Backend Smoke Test (Live Run)

**All 4 endpoints verified against running server (PID 58580, port 5000):**

| Endpoint | Status | Notes |
|---|---|---|
| `GET /health` | 200 ✅ | `{"status":"healthy","timestamp":"..."}` |
| `GET /api/quizzes` | 200 ✅ | Returns list of 2 QuizSummary objects (no questions array) |
| `GET /api/quizzes/world-capitals-001` | 200 ✅ | Full quiz with `correctIndex` per question |
| `POST /api/scores` | 200 ✅ | Returns `ScoreResult` with `correctCount`, `percentage`, `passed`, `questionResults[]` |

**CORS verification:**
- Simple GET with `Origin: http://localhost:5173` → `Access-Control-Allow-Origin: http://localhost:5173` ✅
- OPTIONS preflight to `/api/scores` with `Access-Control-Request-Method: POST` → 204 with `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` ✅
- Note: OPTIONS without `Access-Control-Request-Method` header returns 405 — this is correct ASP.NET Core CORS behavior; only a proper preflight triggers the 204 response.

**Score calculation confirmed:** Submitting 10 answers for world-capitals-001 returned `correctCount: 3`, `percentage: 30`, `passed: false` — server-side recalculation is working.

**No issues found.** Backend is fully operational.

---

### 2026-05-09T21:00:15 — Squad Orchestration: Frontend Integration Complete

**Status:** ✅ Integration milestone reached

**What happened:** Miss Scarlett completed end-to-end wiring of `POST /api/scores` into quiz completion flow. Backend now receives score submissions from the frontend.

**Backend now serving:**
- Score submissions with full answer history via `POST /api/scores`
- Pass/fail determination returned in response
- Per-question correctness details in `questionResults[]`

**Team status:** All backend endpoints now actively consumed by frontend. Ready for end-to-end testing.
