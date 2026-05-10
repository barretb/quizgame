# Mrs. Peacock — History

## Project: QuizGame

**Requested by:** Barret

### Context
Web app quiz game. Users select from installed quizzes (10+ multiple choice questions per topic), answer questions, track their score, and post final score to social media.

Key test concerns: score calculation accuracy, question progression edge cases, social share failure handling, empty/malformed quiz handling.

Stack TBD — to be determined with Barret.

## Learnings

### 2026-05-09 — Test infrastructure compile fixes

**Backend (xUnit):**
- All three stub files were missing `using Xunit;`. With `<ImplicitUsings>enable</ImplicitUsings>`, Xunit types (`[Fact]`, `Assert`) are NOT auto-imported — explicit using is required.
- `ApiEndpointTests.cs` already had `using Microsoft.AspNetCore.Mvc.Testing;`, `System.Net`, `System.Net.Http.Json` — only `using Xunit;` was missing.
- After fix: `Build succeeded with 14 warning(s)` — all warnings are xUnit2020 (`Assert.True(false)` → `Assert.Fail`), intentional for stubs, not errors.

**Frontend (Vitest):**
- `package.json` had no Vitest-related packages. Added: `vitest@^1.0.0`, `@vitest/ui@^1.0.0`, `jsdom@^24.0.0`, `@vue/test-utils@^2.4.0`.
- `vite.config.ts` imports changed from `vitest/config` (not `vite`) to get proper TypeScript typing for the `test` block. Added `test: { globals: true, environment: 'jsdom', include: ['src/**/*.{test,spec}.{ts,tsx}'] }`.
- Created `frontend/tsconfig.test.json` extending base tsconfig with `"types": ["vitest/globals"]` and test file includes.
- Also added `test` and `test:watch` npm scripts for convenience.
- Result: `npx vitest run` discovers all 21 stubs across 3 test files — all fail with `expected true to be false` as designed. No TypeScript errors.

### 2026-05-09 — Test infrastructure scaffolded

**Test strategy:**
- Adversarial approach: tests designed to find breakage at boundaries, not confirm happy paths.
- Three-layer model: backend unit (xUnit + Moq + FluentAssertions), backend integration (WebApplicationFactory), frontend unit (Vitest + @vue/test-utils).
- Schema-as-contract: both sides must conform to ADR-005 quiz JSON schema; schema drift = test failure.
- All stubs are marked `Assert.True(false, "Not implemented")` (C#) or `expect(true).toBe(false)` (TS) so CI will fail loud until implemented.

**Key edge cases identified:**
- Quiz with 9 questions must be excluded (minimum is 10, boundary is 10 = included).
- Star thresholds: 0–39 → 0, 40–59 → 1, 60–79 → 2, 80+ → 3. Exact boundary values tested.
- Web Share API unavailable → fallback to Twitter/X and Facebook URLs (ShareModal — future sprint).
- Rapid clicking must not register multiple answers (AnswerOption disabled after selection).
- GET /api/quizzes (list) must NOT include questions array (bandwidth / UX concern).
- GET /api/quizzes/{id} MUST include correctIndex — client-side scoring per ADR.

**Files created:**
- `backend/QuizGame.Api.Tests/QuizGame.Api.Tests.csproj` — xUnit test project
- `backend/QuizGame.Api.Tests/Helpers/QuizFixtures.cs` — shared test data builders
- `backend/QuizGame.Api.Tests/QuizServiceTests.cs` — 5 stubs
- `backend/QuizGame.Api.Tests/ScoreCalculatorTests.cs` — 4 stubs
- `backend/QuizGame.Api.Tests/ApiEndpointTests.cs` — 5 stubs
- `frontend/src/__tests__/quizStore.test.ts` — 6 stubs
- `frontend/src/__tests__/scoreStore.test.ts` — 8 stubs
- `frontend/src/__tests__/AnswerOption.test.ts` — 5 stubs
- `tests/TEST-PLAN.md` — full test plan with scope, edge cases, pass/fail criteria

**Cross-agent notes for Scarlett:** tsconfig.json excludes src/__tests__/** from build. Peacock needs separate tsconfig.test.json or vitest config to include test file types. Frontend build succeeds with test exclusion.


## [2026-05-09 21:02 UTC] Team Coordination
- Inbox decision from peacock-1 merged to decisions.md
- Orchestration log recorded for peacock-1 execution
- Session log created for test infrastructure work
