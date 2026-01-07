# AutoATS LaTeX Service

LaTeX compilation utilities and templates.

## Purpose

- Provides LaTeX resume template (`user_resume.tex`)
- Handles LaTeX-to-PDF compilation via pdflatex
- Sanitizes LaTeX syntax to prevent compilation errors
- Parses project blocks from template for selection

## Files

- `user_resume.tex` — Resume template with markers for Summary and Projects
- Template markers: `% START SUMMARY` / `% END SUMMARY`, `% START PROJECTS` / `% END PROJECTS`

## Requirements

- `pdflatex` (TeX Live) must be installed system-wide
- LaTeX packages: `geometry`, `hyperref`, `parskip`, `titlesec`, `fontawesome5`, `enumitem`, `xcolor`

## Usage

Used internally by the API service; not a standalone service.

## Template Customization

- Add more projects in the Projects section to expand the selection pool
- Keep `\resumeProject` calls with exactly 4 arguments
- Avoid `%` comments inside `\resumeProject` arguments
