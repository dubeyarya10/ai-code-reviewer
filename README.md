# CodeLens — AI-Powered Code Reviewer

A full-stack code review app built with React + Vite and Flask. It reviews submitted snippets for likely bugs, security risks, maintainability, and improvement opportunities.

## Features
- Dark responsive review workspace with language selection and sample snippets
- Flask REST API with input validation and a 100 KB request limit
- Built-in static pattern scanner works without an API key
- Optional OpenAI-powered contextual review using a server-side API key
- Findings grouped by severity, line references, score, strengths, and suggested fixes
- Health endpoint reports whether the backend and AI key are configured
- No database: submitted code is not intentionally persisted by this starter project

## Requirements
- Python 3.10+
- Node.js 18+
- Optional OpenAI API key for AI reviews (static scan works without it)

## Run locally on macOS
Open Terminal in the project root.

### 1. Backend
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Optional: edit .env and add your OPENAI_API_KEY
python app.py
```
Backend runs at `http://localhost:5000`; health check: `http://localhost:5000/api/health`.

### 2. Frontend (new Terminal tab)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Open the Vite URL printed in the terminal (normally `http://localhost:5173`). Keep both servers running while using the local app.

## Enable AI mode
Set `OPENAI_API_KEY` in `backend/.env`. Never put this key in the frontend or commit `.env` to GitHub. Restart the backend after changing environment variables. The configured model defaults to `gpt-4o-mini` and can be changed with `OPENAI_MODEL`.

Without a key, the API intentionally returns a basic local static scan. Static scans are limited pattern checks, not a guarantee that code is secure. If AI service configuration or a request fails, the API falls back to the local scan.

## GitHub upload
From the project root:
```bash
git init
git add .
git commit -m "Initial working version of CodeLens AI Code Reviewer"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```
Create an empty GitHub repository first, then replace the example remote URL. `.gitignore` excludes `.env`, dependencies, and virtual environments.

## Deploy like CV Pilot

### Backend — Render
- Create a **Web Service** connected to the GitHub repository.
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `gunicorn app:app`
- Add environment variable `OPENAI_API_KEY` (optional) and `OPENAI_MODEL` (`gpt-4o-mini`).
- Set `FRONTEND_ORIGIN` to the deployed Vercel URL after creating the frontend. For local use, its default is `http://localhost:5173`.

### Frontend — Vercel
- Import the same GitHub repository as a separate Vercel project.
- Root Directory: `frontend`
- Framework preset: Vite
- Add `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`.
- Deploy, then set Render's `FRONTEND_ORIGIN` to the exact Vercel site origin and redeploy/restart the backend.

CORS is configured for one frontend origin via `FRONTEND_ORIGIN`; set it to the exact production origin. Avoid `*` in production. For Vercel preview deployments, use a suitable explicit origin strategy before testing previews.

## API
- `GET /api/health` — service status and whether an AI key is configured
- `POST /api/review` — JSON body: `{ "code": "print('hello')", "language": "python" }`

Supported language labels: `python`, `javascript`, `typescript`, `java`, `c`, `cpp`, `csharp`, `go`, `php`, `ruby`, `sql`.

## Security notes
- Keep provider keys only in backend environment variables.
- Treat findings as suggestions that need human verification.
- Do not submit private/proprietary source code unless you are authorized to send it to the configured AI provider.
- Before production use, add authentication, rate limiting, structured logging, automated tests, dependency scanning, and stronger language-specific analyzers.
