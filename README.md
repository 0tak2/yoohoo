# 유리들의 후가

`유리들의 후가`는 단체 대화방에 공유할 수 있는 휴가 일정 조율 서비스입니다.
서비스명은 `우리들의 휴가`를 의도적으로 비튼 표현이며, `유후`라는 두문자를
드러내기 위한 이름입니다.

관리자는 계획을 만들고 공유 URL을 발급합니다. 참여자는 닉네임, 가능한 일정
범위, 희망 숙박수, 추가 질문 답변을 제출합니다. 관리자는 답변과 일정 범위를
한 화면에서 확인합니다.

## Requirements

- Node.js 20+
- pnpm 11+

## Apps

- `apps/frontend`: Next, React Hook Form, Zod, FullCalendar, Playwright
- `apps/backend`: Nest, Drizzle schema, Zod DTO validation
- `packages/shared`: shared Zod schemas and TypeScript DTO types

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm e2e
```

The frontend dev server runs on port `3001`. The backend dev server runs on port
`3000`.

For a production-style local run after build:

```bash
pnpm --filter @yoohoo/backend start:e2e
pnpm --filter @yoohoo/frontend start
ngrok http 3001
```

The frontend listens on `0.0.0.0:3001` in `start` mode. Backend CORS can be
configured with `.env`:

```bash
FRONTEND_ORIGINS=https://example.ngrok-free.app,http://localhost:3001
```

Ngrok subdomains under `ngrok-free.app` and `ngrok.app` are allowed by default.
The frontend proxies `/api/*` to `BACKEND_ORIGIN` through Next rewrites, so a
single frontend ngrok URL can exercise the app locally.

## Product Note

모든 주요 화면은 개인정보를 적거나 묻지 말라는 고지를 포함합니다. 이 서비스는
개인정보 수집을 목적으로 하지 않으며, 입력 내용과 공유 책임은 사용자에게
있습니다.
