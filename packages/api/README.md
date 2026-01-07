# AutoATS API Service

Express.js API server for resume generation.

## Purpose

- `/api/generate-resume` — Main endpoint that:
  - Reads the LaTeX template
  - Calls Ollama to select projects and rewrite summary
  - Compiles LaTeX to PDF using pdflatex
  - Returns PDF URL and debug info
- `/api/status` — Health checks for Ollama and pdflatex
- `/api/pdf/[id]` — Serves generated PDFs

## Development

```bash
# From repo root
npm install
npm run dev

# Or from this directory
cd packages/api
npm install
npm run dev
```

## Environment Variables

- `OLLAMA_URL` (default: http://localhost:11434/api/generate)
- `OLLAMA_TIMEOUT_MS` (default: 20000)
- `PORT` (default: 3001)

## Dependencies

- Requires `pdflatex` installed system-wide
- Requires Ollama running with `llama3` model

## Architecture

- Uses Next.js API routes under the hood
- LaTeX work files in `/tmp/autoats/latex/<id>/`
- Generated PDFs served from `/tmp/autoats/pdf/`
