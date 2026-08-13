# Ondrift FE Development Conventions

## 1. Architecture

- React 18, TypeScript, and Vite are the default stack.
- `src/app` owns routing and the app shell, `src/features` owns business modules, `src/components` holds shared UI, `src/lib` holds API and general-purpose utilities, and `src/types` holds shared types.
- Server data is only ever fetched through the API layer. The base URL defaults to `http://localhost:8000/api/v1` and can be overridden with `VITE_API_BASE_URL`.
- List APIs use the `{ items, total, page, size, pages }` shape. Pages start at 1; the last page and empty lists must both be handled correctly.
- On API failure it's fine to fall back to demo data, but the screen must clearly label demo mode and show the original error — never hide the outage.

## 2. Components

- Components and files use PascalCase, hooks use the `use` prefix, and functions/variables use camelCase.
- A component has a single responsibility. Keep data loading, view state, and presentational components separate wherever possible.
- Shared state patterns (loading, error, empty results), pagination, badges, tables, and cards should be implemented as reusable components.
- Every list render uses a stable domain ID as its `key`.

## 3. Styling

- Declare global design tokens as CSS custom properties and reuse them for color, spacing, radius, and shadow.
- Apply a mobile-first responsive layout. On narrow screens, navigation collapses and tables allow horizontal scrolling.
- Never convey meaning through color alone; always pair it with a text or icon label.
- Reserve inline styles for values that genuinely need computation, such as data-driven visualizations.

## 4. Accessibility

- Use semantic HTML, a correct heading hierarchy, and `nav`, `main`, `table`, `button` elements.
- Every interactive element must be keyboard-accessible and show a clear focus indicator.
- Icon-only buttons need an accessible name.
- Charts need a text summary or data labels, and dynamic state should be announced via `aria-live` when needed.
- Body and UI text should target WCAG AA contrast.

## 5. Testing

- Use Vitest and Testing Library.
- Prioritize core user flows, pagination edge cases, loading/error/empty states, and the API-to-demo fallback.
- Prefer user-visible text and role-based queries over implementation details.
- `npm test` and `npm run build` must pass before shipping a change.

## 6. Commits

- Use Conventional Commits format (`type(scope): summary`).
- Pick whichever of `feat`, `fix`, `docs`, `test`, `refactor`, `chore` fits the purpose.
- Write commit messages in English, regardless of the language used elsewhere in the conversation.
- Each commit contains exactly one logical change; never commit build output (`dist`, coverage) or secrets.
- Review the changed files and test results before committing.
- Every completed unit of work must pass its relevant checks, be committed, and be pushed immediately to the current remote branch. If remote configuration or authorization prevents a push, do not report the work as complete; state the blocker explicitly.
