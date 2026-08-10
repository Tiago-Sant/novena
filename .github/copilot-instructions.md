# Copilot instructions for novena-catolica-app

## Project overview

This repository is a small Next.js app for managing Catholic novenas. The app is intentionally simple: most content is static, user progress is stored locally in the browser, and there is no backend/API layer.

## Common commands

Install dependencies:
- `npm install`

Run locally:
- `npm run dev`

Build for production:
- `npm run build`

Lint the project:
- `npm run lint`

Test commands:
- There is no test script or existing test suite configured in this repository, so there is no single-test command to document yet.

## Architecture at a glance

- The app uses the Next.js App Router under [app/](../app).
  - [app/page.tsx](../app/page.tsx) is the home screen for creating and listing novenas.
  - [app/novena/[slug]/page.tsx](../app/novena/[slug]/page.tsx) renders the selected novena day content.
- Content is data-driven. Each novena is defined as a structured object in [data/](../data) and exported from [data/index.ts](../data/index.ts).
- UI pieces are split into reusable components under [components/](../components), such as navigation, actions, cards, and the header.
- Novena progress is managed with Zustand in [store/useNovenaStore.ts](../store/useNovenaStore.ts). The store uses `persist` middleware, so state is saved in browser storage under the `novenas-progress` key.
- Styling is Tailwind-based; the global stylesheet is [styles/globals.css](../styles/globals.css).

## Repository conventions

- Keep the UI copy in Brazilian Portuguese. Most user-facing text and labels already follow Portuguese.
- Follow the existing data shape when adding or editing a novena. Each novena object should include the same fields used by the page renderer: `slug`, `name`, `description`, `days`, and the optional prayer/image metadata expected by the detail page.
- New novenas should be added in the data layer first, then exported from [data/index.ts](../data/index.ts) and made available in the selection UI on the home page.
- Prefer Zustand for novena state instead of introducing local component state for progress that should survive navigation or refreshes.
- Keep changes aligned with the app’s simple, static-site spirit. There is no database, authentication layer, or API backend to integrate unless the project is intentionally expanded.
- Use the existing Next.js/React patterns already in the codebase: client components are marked with `'use client'`, and browser-only logic (router usage, store access, local state) stays in those components.
- Formatting follows Biome defaults: tabs for indentation, single quotes in JavaScript/TypeScript, and import organization is handled by the formatter/linter.

## Small implementation notes

- The home page includes a small hidden Tailwind block to ensure certain dynamic color classes are included in the built CSS. If you add new dynamic color classes for novena cards, add them there or make sure they are statically present in the component tree.
- The app is intentionally lightweight and deploy-friendly for Vercel; avoid introducing infrastructure or dependencies that would change that model unless explicitly requested.
