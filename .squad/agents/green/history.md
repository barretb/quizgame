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
