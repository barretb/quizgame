# Prof. Plum — History

## Learnings

### 2026-05-09T21:17: DateAdded to Quiz model + sort support

**Task:** Add `DateAdded` to `QuizSummary` and `Quiz`, add `"dateAdded"` to JSON data files, add `?sort=date`/`?sort=dateAdded` to `GET /api/quizzes`.

**What was done:**
- Added `DateTimeOffset DateAdded` to `QuizSummary.cs` and `Quiz.cs`
- Updated `QuizService.GetSummariesAsync()` to pass `q.DateAdded` when projecting to `QuizSummary`
- Updated `GET /api/quizzes` endpoint in `Program.cs` to accept optional `?sort` query param; when `sort=date` or `sort=dateAdded`, returns summaries sorted by `DateAdded` descending
- Added `"dateAdded"` fields to both quiz JSON files: `general-knowledge-001.json` (2024-03-15) and `world-capitals-001.json` (2025-01-20)

**Key observations:**
- The quiz JSON serializer uses `PropertyNameCaseInsensitive = true` — PowerShell's `ConvertTo-Json` capitalizes properties (`QuizId`, etc.) but they still deserialize correctly
- `dateAdded` ends up at end of JSON file after PowerShell roundtrip due to `Add-Member` appending — cosmetic, not functional
- The existing binary was locked (app running at pid 79340), so `dotnet build` on the API project showed file-lock errors, but compilation was clean (confirmed via tests project build: 0 errors)
- Sort logic kept in the endpoint handler per task instructions — no new service layer
- Minimal API query param binding in .NET 10 works with a nullable `string? sort` parameter on the route handler
- Decision document written to inbox; merged to decisions.md by Scribe
- Orchestration log recorded; session log written
- Tests written by Mrs. Peacock verify sort endpoint behavior
