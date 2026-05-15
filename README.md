# 0xe-space

A personal portfolio website built as an interactive terminal. Navigate with Unix-style commands in a VI-mode terminal — browse blog posts, view the CV, explore social links, and more.

## Features

- **VI-mode terminal** — INSERT/NORMAL modes, word motions (`w`, `b`, `e`), `d`/`c` operators, `r` replace, undo/redo, command history, numeric count multipliers (`3w`, `2dd`)
- **Blog** — list, create, edit, and delete posts (markdown, with syntax highlighting)
- **CV** — rendered as markdown or in a Star Wars crawl (`cv sw`), downloadable as PDF
- **Authentication** — login, register with email confirmation, resend code, logout
- **Dynamic content** — social links and about-me text served from the backend via keyed API

## Terminal Commands

| Command | Description |
|---|---|
| `help` / `ls` | List all commands |
| `about_me` | About me section |
| `cv` | View CV as markdown |
| `cv pdf` | Download CV as PDF |
| `cv sw` | View CV as Star Wars crawl |
| `blog` | Navigate to the blog page |
| `socials` | Show all social links |
| `leetcode` `codeforces` `topcoder` | Competitive programming profiles |
| `github` `twitter` `youtube` | Social profiles |
| `post ls` | List blog posts |
| `post new` | Create a post (opens editor) |
| `post edit <id>` | Edit a post |
| `post delete <id>` | Delete a post |
| `login` | Sign in |
| `register` | Create account |
| `confirm_code` | Verify registration code |
| `resend_code` | Resend verification code |
| `whoami` | Show current user |
| `logout` | Sign out |
| `set_key <key>` | Update a backend config key (admin) |
| `clear` | Clear the terminal |
| `reload` | Reload the page |

## Setup

```bash
cp .env.sample .env
# edit .env: set VITE_BASE_URL to your backend API base URL
make setup      # install dependencies
make dev        # start the dev server
```

Or without Make:

```bash
npm install
npm run dev
```

## Development

```bash
make dev        # start dev server (http://localhost:5173)
make build      # production build → dist/
make preview    # serve the production build locally
make lint       # ESLint
make typecheck  # type-check without building
make test       # run unit tests
make check      # lint + typecheck + test
make clean      # remove dist/
```

## Environment

| Variable | Description |
|---|---|
| `VITE_BASE_URL` | Backend API base URL (e.g. `https://api.example.com`) |

## Architecture

```
src/
├── commands/          one class/component per terminal command
├── components/        shared UI + React Contexts (Auth, Cursor)
├── facades/apiCall/   HTTP layer — BaseAPI + per-domain subclasses
├── helpers/
│   ├── chat/          multi-turn interactive command sessions
│   └── terminals/viTerminal/  VI-mode terminal engine + history
├── mediators/
│   ├── CommandMediator/   parses input, routes to command handlers
│   └── TypeSetterMediator/ programmatic keystroke injection
├── models/            TypeScript types (User, Post, ServerResponse)
├── factories/         object constructors (PostFactory)
├── orchestrators/     multi-step workflows (post-login user fetch)
├── actions/           side-effect operations (createGuestUser)
└── configs/           static config (general, typing, star-wars)
```

**Request flow:** user keystroke → `ViTerminal` → `onLineEnd` → `CommandMediator` → command class → `[JSX, Chat | null]`. Commands that need multi-turn input (login, register, set_key) return a `Chat` object; the terminal routes subsequent lines through `chat.receive()` until `chat.isEnded()`.

**Auth:** Bearer token stored in a session cookie via `CookiesFacade`. On page load, `postLoginProcess` reads the cookie and fetches user info to restore auth state.

## Tech Stack

- React 18 + TypeScript 5 + Vite 6
- Tailwind CSS + Open Props
- React Router v7
- react-markdown + rehype-highlight
- js-cookie
- Vitest (unit tests)
