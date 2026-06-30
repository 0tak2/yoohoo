# pnpm Fullstack Workspace Design

## Goal

Create a fresh pnpm monorepo with separate frontend and backend apps that can be developed, built, linted, type-checked, and tested from the repository root.

## Architecture

The repository uses `pnpm-workspace.yaml` to include packages under `apps/*`. The frontend app is a Vite React TypeScript application. The backend app is a Fastify TypeScript service with a small application factory so tests can exercise routes without binding a network port.

## Components

- Root workspace: shared scripts, TypeScript baseline config, ignore rules, and project documentation.
- `apps/frontend`: React entry point, CSS, Vite config, Vitest setup, and a smoke test for the first screen.
- `apps/backend`: Fastify server factory, executable server entry, Vitest route test, and TypeScript config.

## Testing And Verification

Root scripts run all workspace checks through pnpm filters:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

