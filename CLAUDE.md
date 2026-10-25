# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build
npm run lint      # ESLint (eslint .)
npm run preview   # Preview production build locally
```

## Architecture

This is a React + TypeScript + Vite SPA built as an interactive terminal/portfolio site. The UI simulates a Unix shell where users type commands to navigate content (blog posts, profile, CV, social links).

**Environment:** Copy `.env.sample` to `.env` and set `VITE_BASE_URL` to the backend API URL, including `/api/v1` (Go backend: `0xe-space-api`).

### Core Data Flow

1. User types in the VI-like terminal (`ViTerminal` component)
2. On line submit, the command string is passed to `CommandMediator`
3. `CommandMediator` parses the input and delegates to the matching command class (e.g., `LoginCMD`, `PostCMD`, `HelpCMD`)
4. The command returns JSX (the terminal response) and optionally a `Chat` object for multi-turn interactive sessions
5. `TypeSetterMediator` can programmatically simulate keystrokes into the terminal

### Key Patterns

**`CommandMediator`** (`src/helpers/mediators/`) — the single entry point for all terminal input. Add new commands here and create the corresponding class under `src/commands/`.

**Facade pattern for API** (`src/facades/apiCall/`) — `BaseAPI.request` sends JSON, throws `ApiError` (`{error:{code,message}}`; show it with `errorMessage`) and, when a stored token is rejected, drops it and retries GETs anonymously. Specialized classes (`AuthAPI`, `BlogAPI`, `UserAPI`, `GeneralAPI`) extend it. Bearer tokens are managed by `CookiesFacade`; the session is restored in `AuthProvider` on every page.

**React Context** — two contexts in `src/components/context/`:
- `AuthContext` — user auth state (username, token, email, is_admin)
- `CursorContext` — which terminal has keyboard focus

**Chat system** (`src/helpers/chat/`) — commands that need multi-step user input (e.g., login, register) return a `Chat` object. The terminal renders follow-up prompts and routes responses back through the chat until it resolves.

### Path Alias

`@` maps to `./src` (configured in `vite.config.ts` and `tsconfig.json`).

### Styling

Tailwind CSS + Open Props (CSS custom properties). The FiraCode monospace font is used for terminal text. Theme tokens are defined in `index.css`.
