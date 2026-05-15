.PHONY: dev build preview lint typecheck test test-watch check install clean env setup

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm run test

test-watch:
	npm run test:watch

check: lint typecheck test

install:
	npm install

clean:
	rm -rf dist

env:
	@[ -f .env ] && echo ".env already exists" || (cp .env.sample .env && echo "Created .env from .env.sample — set VITE_BASE_URL")

setup: env install
