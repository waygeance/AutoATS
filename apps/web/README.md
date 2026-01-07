# AutoATS Web App

Next.js frontend for the AI-powered ATS resume builder.

## Purpose

- Provides a simple UI to paste a Job Description
- Calls the backend API to generate a tailored resume PDF
- Shows system status (Ollama, pdflatex health)
- Displays the generated PDF and debug info

## Development

```bash
# From repo root
npm install
npm run dev

# Or from this directory
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

- `OLLAMA_URL` (default: http://localhost:11434/api/generate)
- `OLLAMA_TIMEOUT_MS` (default: 20000)

## Tests

```bash
npm run test
```

## Deployment

Build with `npm run build` and deploy the `.next` directory.
