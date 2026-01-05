# CLAUDE.md - GitHub Explorer Dashboard

## Project Overview

GitHub Explorer Dashboard is a Next.js 16 application for searching, exploring, and comparing GitHub repositories. It provides a rich UI for discovering trending projects, analyzing repository health scores, and exporting data.

## Tech Stack

- **Framework**: Next.js 16.1.0 with App Router
- **UI**: React 19, Tailwind CSS 4, Shadcn/ui, Radix UI
- **Animation**: Framer Motion
- **Database**: PostgreSQL with Drizzle ORM
- **Testing**: Vitest, React Testing Library, MSW
- **Charts**: Chart.js with react-chartjs-2
- **Export**: jsPDF (PDF), PapaParse (CSV)

## Project Structure

```
github-explorer/
├── app/                      # Next.js App Router pages
│   ├── _components/          # Home page components
│   ├── repo/[owner]/[name]/  # Repository detail page
│   ├── trending/             # Trending repositories
│   ├── compare/              # Repository comparison
│   └── actions.ts            # Server actions
├── components/               # Reusable UI components
│   ├── ui/                   # Shadcn components
│   ├── SearchInput.tsx       # Main search component
│   ├── HealthBadge.tsx       # Health score badge
│   └── ...
├── lib/                      # Utility functions
│   ├── github/               # GitHub API integration
│   │   ├── api.ts            # API functions
│   │   └── types.ts          # TypeScript types
│   ├── hooks/                # Custom React hooks
│   │   └── useInfiniteScroll.ts
│   └── utils/                # Helper functions
│       ├── formatters.ts     # Number/date formatting
│       ├── health-score.ts   # Health score calculation
│       ├── query-builder.ts  # Search query building
│       ├── export.ts         # PDF/CSV export
│       └── array.ts          # Array utilities
├── tests/                    # Test suite (207 tests)
│   ├── setup.ts              # Test setup with polyfills
│   ├── mocks/                # MSW handlers & fixtures
│   ├── unit/                 # Unit tests
│   └── integration/          # Integration tests
├── config/                   # App configuration
└── db/                       # Database schema (Drizzle)
```

## Key Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint
npm test             # Run tests
npm run test:ui      # Vitest UI
npm run test:coverage # Coverage report
```

## Testing

Tests are located in `tests/` with full MSW mocking:

- **Unit tests**: `tests/unit/` - utilities, hooks, components, API
- **Integration tests**: `tests/integration/` - search flow, navigation
- **Mocks**: `tests/mocks/` - MSW handlers, fixtures

Run tests: `npm test -- --run`

### Test Coverage

- 207 tests total
- formatters.test.ts (32 tests)
- health-score.test.ts (31 tests)
- useInfiniteScroll.test.ts (19 tests)
- RepoCard.test.tsx (18 tests)
- SearchFilters.test.tsx (21 tests)
- github-api.test.ts (21 tests)
- And more...

## Key Features

### Search & Discovery
- Full-text repository search
- Language filtering (22+ languages)
- Minimum stars filtering
- Infinite scroll pagination

### Health Score (0-100)
Calculated from 4 categories:
- **Activity** (30 pts): Days since last update
- **Community** (30 pts): Stars + forks weighted
- **Documentation** (20 pts): Description, wiki, license
- **Maintenance** (20 pts): Issue ratio

### Repository Details
- Stats: stars, forks, watchers, issues
- Language breakdown chart
- Recent commits timeline
- Top contributors
- Package.json analysis

### Export
- PDF export for repo stats and comparisons
- CSV export for trending and search results

## API Integration

GitHub REST API v3 with:
- Server-side caching via Next.js `next.revalidate`
- Client-side fetching for infinite scroll
- Optional GitHub token for higher rate limits

## Environment Variables

```env
DATABASE_URL=postgres://...    # PostgreSQL connection
GITHUB_TOKEN=ghp_...           # Optional: GitHub API token
```

## Code Style

- TypeScript strict mode
- Prettier with Tailwind plugin
- ESLint with Next.js config
- Path aliases: `@/*` maps to project root

## Important Notes

1. **Radix UI requires polyfills** for testing (PointerEvent, hasPointerCapture)
2. **MSW** is used for all API mocking in tests
3. **React 19** with automatic memoization via React Compiler
4. **View Transitions** API for smooth page navigation
5. **ISR caching**: 1h static, 5m dynamic, 30m trending
