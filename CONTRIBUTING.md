# Contributing to AutoATS

Thanks for your interest in contributing! We welcome issues, bug fixes, features, tests, and documentation improvements.

**Code of Conduct**
Please follow the Contributor Covenant: https://www.contributor-covenant.org/ — be respectful, open, and collaborative.

Getting started

- Fork the repository and create a branch off `main` named `feat/your-feature` or `fix/issue-123`.
- If your change is non-trivial, open an issue first to discuss the design.

Submitting changes

1. Keep changes focused and scoped to a single logical purpose.
2. Ensure all existing tests pass and add tests for new behavior. Run tests with `npm test`.
3. Run lint/formatting if available (`npm run lint` / `npm run format`).
4. Push your branch to your fork and open a pull request against `main`.

PR checklist

- **Descriptive title** and description referencing related issues.
- Include screenshots or recordings for UI changes.
- Tests added or updated where appropriate.
- Code follows existing style and TypeScript types are used where applicable.
- CI checks pass.

Testing

- Unit tests live in `__tests__/` and use the project's test runner. Add tests that cover your changes.

Style and formatting

- Follow the repository's ESLint and Prettier rules if present.
- Use clear, descriptive commit messages (imperative tense, short summary then optional details).

Licensing and copyright

By contributing, you agree that your contributions will be licensed under the project's MIT License.

Need help?

Open an issue with the "help wanted" or "discussion" tag describing what you want to work on.
