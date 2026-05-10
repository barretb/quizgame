# 🎯 QuizGame

A browser-based quiz application where users select from multiple quiz topics, answer multiple-choice questions, track their score in real-time, and receive immediate feedback with per-question explanations.

## 🌟 Features

- **Multiple Quiz Topics** — Choose from 10+ curated quiz categories including entertainment, history, geography, and more
- **Instant Feedback** — See immediate green/red visual feedback for each answer with explanations
- **Star Rating System** — Results displayed as a 5-star rating plus numeric score
- **Score History** — Quiz results persisted in browser storage for tracking progress over time
- **Social Sharing** — Share results to social media using the Web Share API with fallback support for Twitter/X and Facebook
- **Fully Client-Side** — No backend or server required; all data served from static JSON files

## 🛠️ Tech Stack

- **Vue 3** — Progressive UI framework
- **Vite** — Lightning-fast build tool and dev server
- **Pinia** — State management for quiz flow and scoring
- **Vue Router** — Client-side navigation
- **TypeScript** — Type-safe development
- **Vitest** — Unit and integration test framework
- **Quiz Data** — Static JSON files served from `frontend/public/quizzes/`

## 📚 Available Quizzes

| Title | Topic | Questions |
|-------|-------|-----------|
| Software Development Languages | Programming / Software Development | 40 |
| Star Trek: TV & Movies Trivia | Star Trek | 30 |
| Star Wars: Movies & TV Trivia | Star Wars | 30 |
| Ohio History | US History | 20 |
| Babylon 5 Trivia | TV Shows | 30 |
| Firefly Trivia | TV Shows | 20 |
| Marvel Movie Trivia | Movies | 20 |
| US State Capitals | US Geography | 50 |
| World Capitals | Geography | 30 |
| General Knowledge | General Knowledge | 10 |

## 📋 Prerequisites

- **Node.js** — 18+ (check `frontend/package.json` for specifics)
- **npm** — Comes with Node.js

## 🚀 Quick Start

### Setup

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app runs at `http://localhost:5173` (Vite default). Vite provides hot module reloading for instant feedback on code changes.

### Production Build

```bash
npm run build
```

Output is generated in `frontend/dist/`. Deploy using any static file server (e.g., nginx, Apache, GitHub Pages, Netlify).

## ✅ Running Tests

### Run all tests once

```bash
cd frontend
npm run test
```

### Watch mode (re-run on file changes)

```bash
npm run test:watch
```

Tests use Vitest with jsdom environment for DOM simulation.

## 📦 Adding New Quizzes

### Schema

Each quiz is a JSON file in `frontend/public/quizzes/` with the following structure:

```json
{
  "quizId": "my-quiz-001",
  "title": "My Quiz Title",
  "topic": "Category Name",
  "questions": [
    {
      "questionId": "q1",
      "text": "What is the question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why option A is correct."
    }
  ]
}
```

### Requirements

- Minimum **10 questions** per quiz
- `quizId` must match the filename (e.g., `my-quiz-001.json`)
- `correctIndex` is 0-based (0 = first option, 1 = second, etc.)
- Each question must have an `explanation` for user feedback

### Steps

1. Create a new `.json` file in `frontend/public/quizzes/` following the schema above
2. Add a summary entry to `frontend/public/quizzes/index.json`:

```json
{
  "quizId": "my-quiz-001",
  "title": "My Quiz Title",
  "topic": "Category Name",
  "description": "Brief description of the quiz",
  "questionCount": 15,
  "dateAdded": "2026-05-10T00:00:00Z"
}
```

3. No restart needed — the app automatically discovers new quizzes on page load

## 📖 Project Structure

```
frontend/
├── public/
│   └── quizzes/           # Static quiz data files
│       ├── index.json     # Quiz manifest
│       └── *.json         # Individual quiz files
├── src/
│   ├── api/
│   │   └── client.ts      # API client for fetching quiz data
│   ├── components/        # Reusable Vue components
│   ├── stores/            # Pinia stores (quizStore, scoreStore, scoreHistoryStore)
│   ├── views/             # Page views (HomeView, QuizView, ResultsView)
│   ├── App.vue            # Root component
│   └── main.ts            # App entry point
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## 🎮 Usage Flow

1. **Home** — Browse available quizzes, search by title or topic, filter by date
2. **Quiz** — Answer 10+ multiple-choice questions with instant feedback
3. **Results** — View score, star rating, detailed per-question review, and share to social media
4. **History** — Access past quiz scores stored in browser storage

## 📄 License

[Add your license here]
