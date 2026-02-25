# GoPilot — Engineering Standards & Claude Code Guide

This document defines the engineering standards for the GoPilot codebase.
**Claude must follow these rules on every task, without exception.**

---

## 1. Non-Negotiable: Tests Come First

**After writing or modifying any code, you must run the test suite and confirm it passes before considering the task done.**

```bash
npm test
```

All 130+ tests must pass. If any fail, fix them before stopping.

**When to write new tests:**
- Every new utility function in `lib/` → unit test in `tests/unit/`
- Every new React component → component test in `tests/components/`
- Every new data file or schema change → data integrity test in `tests/unit/data-integrity.test.js`
- Every new validation rule → test in `tests/unit/validators.test.js`

Tests are **not optional**. A feature without a test is not done.

---

## 2. Project Architecture

```
gopilot/
├── app/               # Next.js App Router pages and layout
├── components/        # React UI components (all 'use client')
├── data/              # Static question banks (JS modules, no React)
├── lib/               # Pure business logic — no React, no Next.js
│   ├── quiz.js        # Quiz engine utilities (shuffle, scoring, badges)
│   └── validators.js  # Schema validators for question/scenario data
├── public/            # Static assets served at / (akts.pdf lives here)
└── tests/
    ├── setup.js
    ├── unit/          # Pure function and data integrity tests
    └── components/    # React component tests
```

### The golden rule: keep `lib/` pure

`lib/` must never import from React, Next.js, or any browser API.
This guarantees every function in `lib/` can be tested without a DOM,
and can be reused in API routes, CLI scripts, or a future mobile app.

---

## 3. Adding AI-Generated Questions

When integrating AI-generated questions into the question banks, **always validate before adding**:

```js
import { validateParQuestion, validateParQuestionBank } from '@/lib/validators';

// Validate a single AI-generated question
const result = validateParQuestion(aiGeneratedQuestion);
if (!result.valid) {
  throw new Error(`Invalid question: ${result.errors.join(', ')}`);
}
```

### PAR question schema
```js
{
  id: number,           // sequential, unique (next integer after last in bank)
  question: string,     // full question text, min 10 chars
  figures: number[],    // AKTS figure numbers (e.g. [17] or [32, 33] or [])
  options: [            // exactly 3 options
    { letter: 'A', text: string, correct: boolean },
    { letter: 'B', text: string, correct: boolean },
    { letter: 'C', text: string, correct: boolean },
  ],
  explanation: string,  // explains correct answer AND why distractors are wrong; min 20 chars
  acsCode: string,      // e.g. 'PA.I.B.K1b'
}
```

**Exactly one option must have `correct: true`.** The validator will catch violations.

### ATC scenario schema
```js
{
  id: string,          // format: 's01', 'g01', 'c01' (level prefix + 2-digit number)
  atcMessage: string,  // the ATC transmission to read back
  situation: string,   // context for the pilot
  options: [           // 2–4 options
    { text: string, correct: boolean },
    ...
  ],
  explanation: string, // educational explanation; min 20 chars
}
```

### After adding questions, run data integrity tests:
```bash
npm test tests/unit/data-integrity.test.js
```

---

## 4. Figure References

The AKTS supplement (FAA-CT-8080-2H) is served from `/public/akts.pdf`.
The mapping of figure numbers to PDF page numbers lives in `data/parQuestions.js`:

```js
export const figurePdfPages = { 8: 42, 17: 50, 20: 53, ... };
```

When a question references a figure, add the figure number to its `figures` array.
The `PdfFigure` component will render the correct PDF page automatically.
The data integrity test will fail if you reference a figure not in `figurePdfPages`.

---

## 5. Security Rules

**Never introduce these vulnerabilities:**

| Risk | Rule |
|------|------|
| XSS | Never use `dangerouslySetInnerHTML` with untrusted content |
| Secrets in client code | API keys belong in `.env.local` (never committed), accessed server-side only |
| Path traversal | Never construct file paths from user input |
| Prototype pollution | Use `validateParQuestion()` on all AI-generated data before insertion |
| Supply chain | Pin major library versions; run `npm audit` before deploying |

**For future AI integration (Claude API calls for question generation):**
- All API calls go in `app/api/` route handlers (server-side), never in client components
- Validate and sanitize every AI response with the validators before using it
- Rate-limit API routes — do not let the browser call Claude directly
- Never expose your Anthropic API key to the browser

---

## 6. Code Style

- **No TypeScript** — JSDoc types document all public functions in `lib/`
- **No magic numbers** — define named constants (`QUESTIONS_PER_SESSION = 10`)
- **No inline business logic in components** — logic lives in `lib/`, components only call it
- **No `console.log` in production code** — use it only in tests (as `console.error` for debugging)
- **No unused imports** — clean up before committing
- **Prefer explicit over clever** — readable code beats a one-liner

---

## 7. Node.js Setup

nvm is installed. To activate Node.js in a new shell:
```bash
source ~/.nvm/nvm.sh
```

To install dependencies for the first time:
```bash
npm install
```

To run the dev server:
```bash
npm run dev
```

---

## 8. Deployment (Vercel)

This is a standard Next.js 14 (App Router) project. Vercel detects it automatically.

- Push to `main` → auto-deploy via Vercel GitHub integration
- No server-side database; all data is static JS modules
- The AKTS PDF (`public/akts.pdf`) is ~8.7MB — it's a Vercel static file asset
- PDF rendering uses `react-pdf` with a CDN worker URL (no server-side PDF processing)

---

## 9. Quick Reference: Running Tests

```bash
npm test                          # Run all tests once
npm run test:watch                # Watch mode for development
npm run test:coverage             # Coverage report
npm test tests/unit/quiz.test.js  # Run a single file
```

Expected output: **all tests must pass** — zero failures tolerated.
