<div align="center">

# CVForge AI

**An AI-powered CV / resume builder that interviews you, writes ATS-friendly content, and exports a clean A4 PDF.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-optional-47A248?logo=mongodb&logoColor=white)

</div>

---

## Overview

CVForge AI guides you from raw details to a polished, recruiter-ready CV:

**Profession → Basic info → Education → Skills → Projects → Experience → Achievements → AI interview → AI-generated CV → Live preview → Job optimization → PDF**

The AI never invents facts. It only rewrites and structures what you provide, which keeps your CV honest and safe to submit.

## Features

- **Profession-aware wizard**: 7-step guided form that adapts labels and sections for Engineering, Doctor, Nurse, Lawyer, Teacher, Business, and Other.
- **AI follow-up interview**: asks one smart question at a time based on your previous answers and pushes for measurable results.
- **AI writing tools** next to text fields: Improve Writing, More Professional, Concise, Strong Action Verbs, Improve for ATS, Generate Bullet Points (with one-level undo).
- **Auto-generation**: professional summary, career objective, project and experience bullet points, and skill grouping.
- **Live editor**: split-screen A4 preview with zoom, fit-to-width, fullscreen, font size, spacing, and section reordering.
- **7 ATS-friendly templates**: Modern, Minimal, Corporate, Developer, Clinical, Legal, Academic (single column, real selectable text).
- **Optimize for Job**: paste a job description to get a keyword match score, matched and missing keywords, suggestions, and a job-specific summary.
- **Multiple CV versions**: dashboard to create, duplicate, rename, and delete CVs (for example "Frontend CV", "Internship CV").
- **Validation and auto-save**: email, phone, URL, and date checks; drafts survive refreshes.
- **Works offline from AI**: a built-in rule-based engine is used automatically when no API key is set or the AI provider fails.
- **Privacy-minded**: photo and registration numbers are never sent to the AI; API keys stay on the server.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Lucide icons |
| Backend | Node.js, Express, Helmet, CORS, express-rate-limit, Morgan |
| Database | MongoDB with Mongoose (optional) |
| AI | Anthropic API, or any OpenAI-compatible API (OpenAI, OpenRouter, ...) with local fallback |

## Project Structure

```
cv-builder-ai/
├── client/                     React + Vite + Tailwind
│   └── src/
│       ├── components/         UI (CVDocument = all templates, Interview, AIText, steps/)
│       ├── pages/              Landing, Wizard, Editor, Dashboard, Privacy
│       ├── layouts/            MainLayout
│       ├── context/            CVContext (state + autosave), ToastContext
│       ├── services/           api.js (all HTTP calls)
│       ├── hooks/              useReveal
│       └── utils/              validators, helpers, default and sample CV
├── server/                     Node + Express (+ MongoDB)
│   ├── controllers/            cvController, aiController
│   ├── models/                 CV
│   ├── routes/                 cvRoutes, aiRoutes
│   ├── middleware/             clientId, requireDB, sanitize, error
│   ├── services/
│   │   ├── aiService.js        AI abstraction layer
│   │   ├── llm.js              provider client (Anthropic / OpenAI-compatible)
│   │   └── localAI.js          offline rule-based engine
│   ├── utils/                  textTools, keywords
│   ├── config/                 env, db
│   └── server.js
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- MongoDB (optional; the app works without it)

### Installation

```bash
git clone https://github.com/<your-username>/cv-builder-ai.git
cd cv-builder-ai

# install root, client and server dependencies
npm run install:all

# create your environment file
cp .env.example .env
```

### Run in development

```bash
npm run dev
```

- Client: http://localhost:5173
- API: http://localhost:5000
- Health check: http://localhost:5000/api/health

### Production build

```bash
npm run build     # builds the client into client/dist
npm start         # starts the API server
```

## Configuration

All settings live in a single `.env` file at the project root.

| Variable | Description | Default |
|---|---|---|
| `PORT` | API port | `5000` |
| `CLIENT_URL` | Allowed CORS origin(s), comma-separated | `http://localhost:5173` |
| `MONGO_URI` | MongoDB connection string (optional) | none |
| `AI_PROVIDER` | `local`, `anthropic`, or `openai` | `local` |
| `AI_API_KEY` | Provider API key (server-side only) | none |
| `AI_MODEL` | Model name (optional, sensible default per provider) | none |
| `AI_BASE_URL` | Custom API base URL (optional) | none |

> **Never commit your `.env` file.** It is already listed in `.gitignore`.

### Connecting an AI provider

**Local engine (no key needed)**
```env
AI_PROVIDER=local
```

**Anthropic**
```env
AI_PROVIDER=anthropic
AI_API_KEY=your-key
```

**OpenAI-compatible (example: OpenRouter)**
```env
AI_PROVIDER=openai
AI_API_KEY=your-key
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=your-model-name
```

If the provider fails or times out, the app silently falls back to the local engine. Every AI response includes a `source` field (`"ai"` or `"local"`) so you always know which engine produced it. To add another provider, edit only `server/services/llm.js`.

> Some free models do not support JSON mode reliably. If results look basic, check the server logs for `[ai] ... failed` warnings.

## Data Storage

- **Without MongoDB:** CVs are stored in the browser (`localStorage`).
- **With MongoDB:** CVs are also synced to the database under an anonymous client ID (`x-client-id` header), so they can be restored in the same browser profile.

## API Reference

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Server, database, and AI status |
| `POST` | `/api/ai/summary` | Generate professional summary |
| `POST` | `/api/ai/objective` | Generate career objective |
| `POST` | `/api/ai/project-bullets` | Bullets for a project |
| `POST` | `/api/ai/experience-bullets` | Bullets for a job or internship |
| `POST` | `/api/ai/follow-up` | Next interview question |
| `POST` | `/api/ai/improve` | Improve text (`improve`, `professional`, `concise`, `verbs`, `ats`, `bullets`) |
| `POST` | `/api/ai/optimize` | Job-description match, score, and suggestions |
| `POST` | `/api/ai/full-cv` | Generate full CV content from all answers |
| `GET` | `/api/cvs` | List saved CVs (needs MongoDB) |
| `GET` `PUT` `DELETE` | `/api/cvs/:cvId` | Read, save, or delete a CV (needs MongoDB) |

## Exporting a PDF

Click **Download PDF** to open the browser print dialog with the CV laid out for A4 (14 mm margins). Then:

1. Choose **Save as PDF** as the destination
2. Keep margins on **Default**
3. Turn **Headers and footers** off

Text stays selectable, which is what ATS parsers need.

## How the ATS Score Works

The score is a transparent, deterministic **keyword-overlap estimate** between your CV and the job description. It highlights matched and missing keywords so you can improve your CV truthfully. It is **not** a guarantee of how any real ATS or recruiter will rate you. Only add skills you genuinely have.

## Security Notes

- API keys are read from server-side environment variables and are never exposed to the browser.
- Request bodies are sanitized against NoSQL operator injection.
- Helmet, CORS allow-list, body size limit (2 MB), and a rate limit (120 requests/minute per IP) are enabled.
- Authentication is intentionally omitted (anonymous client ID). For production, add real authentication, HTTPS, and stricter limits on `/api/ai/*`.

## Roadmap

- [ ] User accounts and authentication
- [ ] Server-side PDF generation
- [ ] Cover letter generator
- [ ] Stricter per-user AI rate limiting
- [ ] Import an existing CV (PDF / DOCX)
- [ ] More templates and color themes

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for details.

## Author

**Your Name**
GitHub: [@your-username](https://github.com/your-username)
