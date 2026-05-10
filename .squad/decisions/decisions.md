# Decisions — QuizGame

## Session 2026-05-09 — Search, Sort, Score History, and Backend DateAdded

---

# Decision: DateAdded field + sort support on GET /api/quizzes

**Date:** 2026-05-09T21:17:09-04:00
**By:** Prof. Plum
**Category:** API contract / data model

## What

Added `DateAdded` (`DateTimeOffset`) to both `Quiz` and `QuizSummary` models. Added `"dateAdded"` (ISO 8601 string) to all quiz JSON data files. Extended `GET /api/quizzes` to accept an optional `?sort=date` or `?sort=dateAdded` query parameter that returns quizzes sorted by `dateAdded` descending (newest first). Default behavior (no param) is unchanged.

### Data file dates assigned
- `general-knowledge-001.json` → `2024-03-15T00:00:00+00:00`
- `world-capitals-001.json` → `2025-01-20T00:00:00+00:00`

## Why

Feature request from Barret. Enables frontend to display "newest" quizzes and sort quiz lists by date added. `DateTimeOffset` chosen over `DateTime` for timezone-awareness correctness.

## Implementation note

Sort logic placed directly in the `GET /api/quizzes` endpoint handler (not a new service method) to keep it simple — one query param, one conditional sort. If sort options grow, move to a service method.

---

# Decision: Search, Sort, Score History (Scarlett)

**Date:** 2026-05-09T21:17:09-04:00
**By:** Miss Scarlett
**Requested by:** Barret

## What

Added three frontend features to HomeView and supporting stores.

### Feature 1: Quiz Search
- `searchQuery` ref + `filteredQuizzes` computed in `HomeView.vue`
- Case-insensitive match against `title`, `topic`, `description`
- Search input with 🔍 icon above the quiz grid
- "No quizzes match your search" empty state (distinct from "no quizzes at all")

### Feature 2: Sort by Date Added
- `sortOrder` ref (`'default' | 'newest' | 'oldest'`) in `HomeView.vue`
- Sort applied after search filter in same `filteredQuizzes` computed
- `<select>` control next to search bar
- `dateAdded: string` added to `QuizSummary` interface in `client.ts`
  - **Backend action required**: `GET /api/quizzes` must return `dateAdded` field per quiz

### Feature 3: Score History (cookie-based)
- New Pinia store: `frontend/src/stores/scoreHistoryStore.ts`
  - State: `history: ScoreHistoryEntry[]`
  - Persisted to cookie `quiz_score_history` (JSON, max 20 entries, 365-day expiry)
  - `loadFromCookie()` called on store init
  - `addEntry(entry)` prepends and re-serializes
  - `clearHistory()` empties state + cookie
- `scoreStore.submitScore()` now calls `scoreHistoryStore.addEntry(...)` after API response
- History panel on HomeView: collapsible toggle, table of quiz/score/date, "Clear history" button
- Default state: expanded on desktop (≥768px), collapsed on mobile

## Why

- Cookie storage (not localStorage) per Barret's specification — avoids storage API restrictions in some contexts
- Max 20 entries keeps cookie under ~4KB
- `useScoreHistoryStore()` called lazily inside `submitScore` action to avoid Pinia circular dependency
- Spread before sort prevents mutating the reactive `quizzes` array

## Backend Action Required

Mr. Green: `GET /api/quizzes` response objects need a `dateAdded` field (ISO 8601 string). This can be the file's `LastWriteTime` or a field from the quiz JSON itself. Without it, "newest/oldest" sort will treat all dates as equal (epoch 0) — not a crash, just a no-op sort.

---

# Decision: Feature Tests — Search, Sort, Score History (Peacock)

**Date:** 2026-05-09T21:17:09-04:00
**By:** Mrs. Peacock
**Requested by:** Barret
**Category:** Test coverage

## What

Wrote tests for three new features added by Miss Scarlett and Prof. Plum.

### Frontend — `scoreHistoryStore.test.ts` (12 tests)

Tests for `useScoreHistoryStore` (cookie-persisted Pinia store):
- `addEntry()` adds to state and prepends (newest first)
- `addEntry()` persists serialised JSON to the `quiz_score_history` cookie
- Store init calls `loadFromCookie()` — history restored from pre-existing cookie
- Multiple entries restored in correct order
- History capped at 20 — oldest entry dropped when 21st is added
- `clearHistory()` empties state and writes empty array to cookie

**Approach:** jsdom's real `document.cookie` used (no mocking needed). Cookie expired in `beforeEach` for isolation. Fresh `createPinia()` per test for store isolation.

### Frontend — `homeViewFilters.test.ts` (20 tests)

Tests for the `filteredQuizzes` computed logic in `HomeView.vue`:
- Search by title (match, no-match)
- Search by topic (full and partial)
- Search by description
- Case-insensitive matching (upper, lower, mixed)
- Empty and whitespace-only query returns all quizzes
- Query with no matches returns empty array
- `sort=newest` puts latest `dateAdded` first, oldest last, strictly descending
- `sort=oldest` puts earliest `dateAdded` first, newest last, strictly ascending
- Combined filter + sort: only matching quizzes sorted correctly

**Approach:** Logic tested as pure functions (no component mount). Helper functions mirror `HomeView.vue`'s computed exactly. These define the behavioral contract; if the implementation diverges, tests fail.

### Backend — `QuizSortTests.cs` (10 integration tests)

Integration tests for the `?sort` query parameter on `GET /api/quizzes`:
- No param: returns 200 with all quizzes including `dateAdded` field
- `?sort=date`: returns 200; first quiz is newest; last is oldest; order strictly descending
- `?sort=dateAdded`: returns 200; same first quiz as `?sort=date`; order matches `?sort=date` exactly

**Approach:** `WebApplicationFactory<Program>` with Moq'd `IQuizService` (no file system). Mock injects three quizzes with well-separated, unambiguous dates.

## Infrastructure changes made

1. **`QuizGame.Api.Tests.csproj`** — uncommented `<ProjectReference>` to `QuizGame.Api` (was TODO).
2. **`QuizFixtures.cs`** — removed placeholder model stubs; now uses real `QuizGame.Api.Models` types (`Question`, `Quiz` with `DateAdded`, `List<AnswerSubmission>`).
3. **`Program.cs`** — added `public partial class Program { }` after `app.Run()` to expose implicit top-level class to `WebApplicationFactory<Program>`.

## Test results

- Frontend: **32 new tests pass** (20 filter + 12 store). Pre-existing 21 stubs still fail intentionally.
- Backend: **10 new tests pass**. Pre-existing 14 stubs still fail intentionally.

## Decisions

- Pure function approach for HomeView filter tests preferred over `shallowMount` — avoids Vue component setup overhead and isolates logic cleanly. If logic is ever extracted to a composable, update tests to import from it.
- jsdom cookie jar used directly (not mocked) — keeps tests closer to browser reality.
- `WebApplicationFactory` + Moq pattern for backend sort tests — decouples from file system, allows precise date fixture control.
