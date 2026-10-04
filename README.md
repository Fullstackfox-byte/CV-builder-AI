# CVForge AI - AI-powered CV / Resume Builder

A full-stack (MERN) AI career assistant: the user enters basic information, an AI interview asks smart follow-up
questions, and the app produces an ATS-friendly CV with live A4 preview, 4 templates, job-specific optimization
and PDF export.

**Flow:** Basic info -> AI interview -> AI analysis -> Professional CV -> Live preview -> ATS optimization -> PDF

## Features
- Landing page, 7-step guided form with validation (email, phone, URLs, date ranges) and auto-save
- AI follow-up interview (questions depend on previous answers, ask for numbers, never repeat)
- AI tools next to text fields: Improve Writing, More Professional, Concise, Action Verbs, ATS, Bullet Points
- Project / experience bullet generation, professional summary, career objective
- Split-screen editor: live A4 preview, zoom, fit, fullscreen, template switcher, font size, spacing, section reordering
- Templates: Modern, Minimal, Corporate, Developer (single-column, real text, ATS friendly)
- "Optimize for Job": keyword match, missing skills, job-specific summary, **estimated** ATS score
- Dashboard with multiple CV versions (Frontend Developer CV, Internship CV, ...), duplicate, delete
- Print / Download PDF (A4, selectable text), Save Draft, privacy page
- The AI never invents facts: it only rewrites what the user provided

## Project structure
```
cv-builder-ai/
|-- client/                 React + Vite + Tailwind
|   `-- src/
|       |-- components/     UI (CVDocument = all templates, Interview, AIText, steps/...)
|       |-- pages/          Landing, Wizard, Editor, Dashboard, Privacy
|       |-- layouts/        MainLayout
|       |-- hooks/          useReveal
|       |-- services/       api.js (all HTTP calls)
|       |-- context/        CVContext (state + autosave), ToastContext
|       `-- utils/          validators, helpers, default/sample CV
|-- server/                 Node + Express + MongoDB
|   |-- controllers/        cvController, aiController
|   |-- models/             CV
|   |-- routes/             cvRoutes, aiRoutes
|   |-- middleware/         clientId, requireDB, sanitize, error
|   |-- services/
|   |   |-- aiService.js    AI abstraction (generateProfessionalSummary, generateProjectBullets, ...)
|   |   |-- llm.js          provider client (Anthropic / OpenAI-compatible)
|   |   `-- localAI.js      offline rule-based engine (works with no API key)
|   |-- utils/              textTools, keywords
|   |-- config/             env, db
|   `-- server.js
|-- .env  /  .env.example
`-- README.md
```

## Quick start
Requirements: Node 18+ (MongoDB optional).
```bash
npm run install:all        # installs root, client and server dependencies
npm run dev                # starts API (http://localhost:5000) + client (http://localhost:5173)
```
Open http://localhost:5173.

- **Without MongoDB:** CVs are saved in the browser (localStorage). Remove or leave `MONGO_URI`; the server just warns.
- **With MongoDB:** CVs are also synced to the database under an anonymous client id.

## Connecting a real AI
Edit the root `.env` (server-side only - keys are never exposed to the browser):
```
AI_PROVIDER=anthropic        # or openai (any OpenAI-compatible API; set AI_BASE_URL if needed)
AI_API_KEY=your-key
AI_MODEL=                    # optional; sensible default per provider
```
Restart the server. If the provider fails, the app falls back to the local engine automatically.
All responses are structured JSON with a `source` field (`"ai"` or `"local"`).
To add another provider, only edit `server/services/llm.js`.

## API
| Method | Route | Purpose |
|---|---|---|
| POST | `/api/ai/summary` `/objective` `/project-bullets` `/experience-bullets` `/follow-up` `/improve` `/optimize` `/full-cv` | AI features |
| GET/PUT/DELETE | `/api/cvs`, `/api/cvs/:cvId` | CV storage (needs MongoDB + `x-client-id` header) |
| GET | `/api/health` | status |

## Exporting a PDF
"Download PDF" opens the browser print dialog with the CV laid out for A4 (14 mm margins). Choose
**Save as PDF**, keep margins on *Default* and turn off *Headers and footers*. Text stays selectable, which is what ATS parsers need.

## Notes
- The ATS match score is a keyword-overlap **estimate**, not a guarantee.
- Auth is intentionally omitted (anonymous client id). For production add real authentication, HTTPS and stricter rate limits.
