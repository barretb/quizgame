# QuizGame — Test Plan

**Version:** 1.0  
**Author:** Mrs. Peacock (Tester)  
**Date:** 2026-05-09  
**Status:** Draft — implementation stubs created, full implementation pending scaffold

---

## 1. Scope

This plan covers quality verification for the **QuizGame** web application:

| Layer | In Scope |
|---|---|
| Backend (.NET Core 10 Web API) | QuizService, score calculation, REST endpoints, health check |
| Frontend (Vue 3 + Pinia) | `useQuizStore`, `useScoreStore`, `AnswerOption` component |
| Integration | Full quiz flow: load → answer → score → share |
| Edge cases | See §4 |

**Out of scope (v1):** Performance load testing, accessibility auditing, browser compatibility matrix, database persistence (in-memory only for v1).

---

## 2. Test Strategy

### 2.1 Layers

```
┌─────────────────────────────────┐
│  Integration Tests (API)        │  WebApplicationFactory, in-process HTTP
├─────────────────────────────────┤
│  Unit Tests — Backend           │  xUnit + Moq + FluentAssertions
├─────────────────────────────────┤
│  Unit Tests — Frontend          │  Vitest + @vue/test-utils + Pinia test utils
└─────────────────────────────────┘
```

### 2.2 Guiding Principles

- **Adversarial first:** Tests are designed to find what breaks, not confirm what works.
- **Schema as contract:** Both backend and frontend tests validate against the agreed JSON schema (ADR-005). Any schema drift is a test failure.
- **Boundary values everywhere:** Star thresholds (40/60/80%), question count minimum (10), correctIndex range (0–3).
- **Isolation:** Unit tests mock all I/O. Integration tests use a controlled in-process API with seeded quiz fixtures.
- **No implementation details in frontend:** Frontend tests interact with the public store API and rendered DOM, not internal state.

---

## 3. Test Categories and Ownership

| Category | File(s) | Owner | Framework |
|---|---|---|---|
| Quiz loading & validation | `QuizServiceTests.cs` | Mrs. Peacock | xUnit |
| Score calculation | `ScoreCalculatorTests.cs` | Mrs. Peacock | xUnit |
| API endpoints (integration) | `ApiEndpointTests.cs` | Mrs. Peacock | xUnit + WebApplicationFactory |
| Quiz store (state management) | `quizStore.test.ts` | Mrs. Peacock | Vitest |
| Score store (star logic) | `scoreStore.test.ts` | Mrs. Peacock | Vitest |
| AnswerOption component | `AnswerOption.test.ts` | Mrs. Peacock | Vitest + vue/test-utils |

---

## 4. Edge Cases to Verify

### 4.1 Backend Edge Cases

| # | Scenario | Expected Behaviour | Test Location |
|---|---|---|---|
| B-1 | Quiz JSON file with **9 questions** | Excluded from loaded quiz list | `QuizServiceTests` |
| B-2 | Quiz JSON file with **exactly 10 questions** | Included (boundary — minimum valid) | `QuizServiceTests` |
| B-3 | Quiz directory is **empty** (no .quiz.json files) | Returns empty list, no crash | `QuizServiceTests` |
| B-4 | Quiz JSON is **malformed** (invalid JSON) | Quiz skipped or graceful error logged | `QuizServiceTests` |
| B-5 | GET `/api/quizzes/{id}` for **non-existent id** | 404 Not Found | `ApiEndpointTests` |
| B-6 | POST `/api/scores` with **all wrong answers** | `correctCount=0`, `percentage=0`, `passed=false` | `ScoreCalculatorTests` |
| B-7 | POST `/api/scores` with **all correct answers** | `percentage=100`, `passed=true` | `ScoreCalculatorTests` |
| B-8 | POST `/api/scores` — **answers array missing some questions** | Graceful handling (missing = wrong, or 400 Bad Request) | `ApiEndpointTests` |
| B-9 | `correctIndex` values in GET `/api/quizzes/{id}` response | All values are integers in range [0, 3] | `ApiEndpointTests` |
| B-10 | GET `/api/quizzes` (list) — **questions NOT in response** | Summary payload omits questions array | `QuizServiceTests` |

### 4.2 Frontend Edge Cases

| # | Scenario | Expected Behaviour | Test Location |
|---|---|---|---|
| F-1 | **0% score** — all wrong | 0 stars displayed | `scoreStore.test.ts` |
| F-2 | **39% score** (boundary below 1-star threshold) | 0 stars | `scoreStore.test.ts` |
| F-3 | **40% score** (boundary — exactly 1 star) | 1 star | `scoreStore.test.ts` |
| F-4 | **59% score** (boundary below 2-star threshold) | 1 star | `scoreStore.test.ts` |
| F-5 | **60% score** (boundary — exactly 2 stars) | 2 stars | `scoreStore.test.ts` |
| F-6 | **79% score** (boundary below 3-star threshold) | 2 stars | `scoreStore.test.ts` |
| F-7 | **80% score** (boundary — exactly 3 stars) | 3 stars | `scoreStore.test.ts` |
| F-8 | **100% score** (perfect) | 3 stars | `scoreStore.test.ts` |
| F-9 | **Rapid clicking** — click answer multiple times | Only first click registered; subsequent clicks ignored | `AnswerOption.test.ts` |
| F-10 | **AnswerOption disabled** after selection | Click does not emit `select` event | `AnswerOption.test.ts` |
| F-11 | **nextQuestion at last question** | Does not overflow; quiz ends or index clamped | `quizStore.test.ts` |
| F-12 | **resetQuiz** mid-quiz | All state cleared; can start a new quiz cleanly | `quizStore.test.ts` |

### 4.3 Social Sharing Edge Cases

| # | Scenario | Expected Behaviour | Test Location |
|---|---|---|---|
| S-1 | **Web Share API available** (`navigator.share` exists) | Native share sheet invoked | ShareModal tests (future) |
| S-2 | **Web Share API NOT available** | Falls back to Twitter/X and Facebook URL buttons | ShareModal tests (future) |
| S-3 | **`navigator.share()` throws** (user cancels or permission denied) | Error caught silently; fallback links still visible | ShareModal tests (future) |

> **Note:** ShareModal tests are marked for a future sprint once the component is scaffolded by Miss Scarlett.

---

## 5. Test Data

### 5.1 Minimum Valid Quiz Fixture
```json
{
  "quizId": "test-quiz-1",
  "title": "Test Quiz",
  "topic": "Testing",
  "description": "Used for automated tests only",
  "version": "1.0",
  "questions": [ /* 10 entries minimum */ ]
}
```

### 5.2 Question Structure
```json
{
  "questionId": "q0",
  "text": "Sample question 0?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Explanation text."
}
```

Shared fixtures are codified in `backend/QuizGame.Api.Tests/Helpers/QuizFixtures.cs`.

---

## 6. Pass/Fail Criteria

| Gate | Threshold |
|---|---|
| All unit tests | 100% pass |
| All integration tests | 100% pass |
| No test stubs left un-implemented at launch | 0 stubs |
| Score calculation accuracy | Exact match (no floating-point approximation tolerance beyond 0.01%) |
| Star boundary accuracy | Exact boundary values per design decision |

---

## 7. Out-of-Scope for v1

- Load / stress testing
- Accessibility (WCAG) auditing
- Cross-browser visual regression
- E2E Playwright/Cypress tests (considered for v2)
- Authentication (not in v1)

---

## 8. File Index

```
backend/
  QuizGame.Api.Tests/
    QuizGame.Api.Tests.csproj       — xUnit project, NuGet refs
    QuizServiceTests.cs             — quiz loading + validation stubs
    ScoreCalculatorTests.cs         — score math stubs
    ApiEndpointTests.cs             — HTTP integration stubs
    Helpers/
      QuizFixtures.cs               — shared test data builders

frontend/
  src/
    __tests__/
      quizStore.test.ts             — Pinia quiz store stubs
      scoreStore.test.ts            — Pinia score/star store stubs
      AnswerOption.test.ts          — AnswerOption component stubs

tests/
  TEST-PLAN.md                      — this document
```
