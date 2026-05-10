# Mr. Green — History

## Project: QuizGame

**Requested by:** Barret

### Context

Web app quiz game. Users select from installed quizzes (10+ multiple choice questions per topic), answer questions, track their score, and post final score to social media.

Key backend concerns: quiz file loading/caching, score calculation accuracy, API contract stability, CORS configuration.

Stack: .NET Core 10 Web API with Minimal APIs, in-memory caching, file-based quiz storage.

## Learnings

### 2026-05-09 — Backend API scaffolded

**Backend deliverables:**
- .NET Core 10 Minimal API at backend/QuizGame.Api/
- 4 endpoints: GET /health, GET /api/quizzes, GET /api/quizzes/{id}, POST /api/scores
- Quiz file storage: backend/Data/Quizzes/{quizId}.json with file-based loading
- IMemoryCache for quiz caching (reads on startup, no runtime reloads)
- IScoreRepository pattern with InMemoryScoreRepository (ConcurrentBag for v1)
- CORS policy "QuizGamePolicy" allows http://localhost:5173 (Vite dev server)
- Swagger UI enabled in Development, disabled in Production

**API contract (binding for frontend + tests):**
- QuizSummary: id, title, topic, description, questionCount (no questions array)
- Full Quiz: quizId, title, topic, description, version, questions[] with correctIndex
- ScoreRequest: quizId, answers[] (questionId, selectedIndex)
- ScoreResult: quizId, totalQuestions, correctCount, percentage, passed (>=60%), questionResults[]

**Quiz file validation:**
- Minimum 10 questions enforced (files with <10 skipped with log warning)
- Two sample quizzes: world-capitals-001.json, general-knowledge-001.json
- Filename must match internal quizId field exactly

**Infrastructure notes:**
- HTTP dev server: http://localhost:5000
- HTTPS dev server: https://localhost:5001
- OpenAPI JSON: http://localhost:5000/openapi/v1.json (dev only)
- Run: cd backend/QuizGame.Api && dotnet run --launch-profile http

**Cross-agent notes for Scarlett:** All responses use camelCase property names. GET /api/quizzes returns "id" (use for routing). GET /api/quizzes/{id} returns "quizId". Always include correctIndex in questions. Validate selectedIndex 0-3 (400 if outside). CORS preset for localhost:5173.

**Cross-agent notes for Peacock:** QuizService skips invalid files—design test cases for wrong id, <10 questions edge cases. Score calculation purely server-side (client answers recalculated, not trusted). Passed threshold is 60% (>=60.0). InMemoryScoreRepository (ConcurrentDictionary) means scores reset on restart (v1 acceptable).
