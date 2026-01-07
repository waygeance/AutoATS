# AutoATS Infrastructure

Deployment and orchestration files.

## Purpose

- Docker configurations (if needed)
- Deployment scripts
- Environment setup helpers

## Files

- `setup.sh` — One-command setup script (install deps, check Ollama)
- `deploy.sh` — Deploy to production (placeholder)

## Local Development Setup

```bash
./infra/setup.sh
```

This will:

- Check for Node.js, npm
- Install project dependencies
- Verify pdflatex installation
- Check Ollama availability
- Offer to pull the llama3 model if missing
