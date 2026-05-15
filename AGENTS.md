# Repository Guidelines

## Project Structure & Module Organization

This repository is currently empty aside from this guide. When adding code, keep the layout predictable and document deviations in the README.

Recommended structure:

- `app/` for Next.js app routes, layouts, and shared app components.
- `app/dashboard/` for dashboard routes and the shared dashboard layout.
- `app/components/` for reusable UI components used across routes.
- `app/lib/` for shared application types and browser storage helpers.
- `src/` for application source code.
- `tests/` for automated tests that mirror `src/` modules.
- `assets/` for static files such as images, fixtures, or sample data.
- `docs/` for design notes, setup details, and user-facing documentation.
- Config files, package manifests, and build scripts should stay at the repository root.

## Build, Test, and Development Commands

No build system or package manager is configured yet. Add commands to the relevant manifest when tooling is introduced.

Examples to add later:

- `npm run dev` starts a local development server.
- `npm test` runs the automated test suite.
- `npm run build` creates a production build.
- `npm run lint` checks formatting and static analysis rules.

For another stack, use its standard entry points, such as `pytest`, `cargo test`, `go test ./...`, or `make test`.

## Coding Style & Naming Conventions

Follow the conventions of the language and framework introduced here. Prefer small modules with clear ownership and explicit imports.

- Use consistent indentation from the chosen formatter.
- Name source files descriptively, such as `billing_checker.ts` or `billing_checker.py`.
- Keep test files easy to pair with source files, such as `billing_checker.test.ts` or `test_billing_checker.py`.
- Add a formatter and linter early, then document the command here.

## Testing Guidelines

No test framework is currently configured. Add tests with the first functional code.

Place tests under `tests/` or beside source files if that matches the chosen framework. Cover normal behavior, edge cases, and failure paths. New features should include tests, and bug fixes should include a regression test when practical.

## Commit & Pull Request Guidelines

This directory is not currently a git repository, so no local commit history is available. Until a convention is established, use short imperative commit subjects, for example `Add billing checker parser`.

Pull requests should include:

- A concise summary of the change.
- Test results or a clear note when tests were not run.
- Linked issues or context for the change.
- Screenshots for user-interface changes.

## Agent-Specific Instructions

Keep edits scoped to the requested task. Do not introduce project-wide tooling, generated files, or structural changes without a clear need. When adding commands, tests, or directories, update this guide.
