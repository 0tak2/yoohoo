# pnpm Fullstack Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fresh pnpm workspace with frontend and backend apps plus standard scripts and verification.

**Architecture:** Use a root pnpm workspace with `apps/frontend` and `apps/backend`. The frontend is Vite React TypeScript; the backend is Fastify TypeScript with a testable app factory.

**Tech Stack:** pnpm, TypeScript, Vite, React, Fastify, Vitest, ESLint.

---

### Task 1: Root Workspace

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `README.md`

- [ ] Add root package metadata, workspace scripts, shared TypeScript config, ignore rules, and usage docs.

### Task 2: Frontend App

**Files:**
- Create: `apps/frontend/package.json`
- Create: `apps/frontend/index.html`
- Create: `apps/frontend/tsconfig.json`
- Create: `apps/frontend/tsconfig.node.json`
- Create: `apps/frontend/vite.config.ts`
- Create: `apps/frontend/eslint.config.js`
- Create: `apps/frontend/src/App.tsx`
- Create: `apps/frontend/src/App.test.tsx`
- Create: `apps/frontend/src/main.tsx`
- Create: `apps/frontend/src/styles.css`
- Create: `apps/frontend/src/test/setup.ts`

- [ ] Add a Vite React TypeScript app with lint, typecheck, test, build, and dev scripts.

### Task 3: Backend App

**Files:**
- Create: `apps/backend/package.json`
- Create: `apps/backend/tsconfig.json`
- Create: `apps/backend/eslint.config.js`
- Create: `apps/backend/src/app.ts`
- Create: `apps/backend/src/index.ts`
- Create: `apps/backend/src/app.test.ts`

- [ ] Add a Fastify TypeScript app with lint, typecheck, test, build, and dev scripts.

### Task 4: Verification

- [ ] Run `pnpm install`.
- [ ] Run `pnpm lint`.
- [ ] Run `pnpm typecheck`.
- [ ] Run `pnpm test`.
- [ ] Run `pnpm build`.
- [ ] Commit the scaffold.

