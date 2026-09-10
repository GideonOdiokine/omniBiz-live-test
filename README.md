# Transfer to Bank

A responsive React and TypeScript bank-health picker. It displays five banks,
polls their service health every 30 seconds, supports manual refresh, and
includes complete loading, empty, error, and loaded states.

## Running the Project

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Architecture

The implementation is separated into data, business logic, state management,
and presentation layers.

```text
TransferToBank
|-- useBanks
|   `-- getBanks mock service
|-- StatusTabs
|-- Skeleton / Empty / Error states
|-- BankList
|   `-- BankRow
|       `-- HealthBadge
`-- HealthLegend
```

The shared TypeScript contract lives in `src/types/bank.types.ts`. This keeps
the `Bank`, `HealthStatus`, and preview-state definitions consistent throughout
the application.

## Data Layer

`src/services/bank.service.ts` simulates a backend containing five banks. Each
request introduces a short delay and slightly changes the percentages, making
refreshes and polling visually demonstrable.

The service accepts an `AbortSignal`, so requests can be cancelled cleanly.
Percentage values are also clamped between 0 and 100.

In production, this service could be replaced with `fetch('/api/banks')`
without changing the presentation components.

## State Management

`src/hooks/useBanks.ts` owns all asynchronous behavior:

- Initial loading
- Background refreshing
- Errors
- Bank data
- Last-updated time
- Manual refresh
- Thirty-second polling

`isLoading` and `isRefreshing` are intentionally separate. Initial loading
displays the skeleton, while background refreshes preserve the existing list
and only animate the refresh button.

Before starting a request, the hook cancels the previous one. Its cleanup
function clears both timers and aborts outstanding work, preventing duplicate
polling and state updates after unmounting.

## Business Logic

`src/utils/getHealthStatus.ts` contains the health thresholds:

```text
Below 50%  -> Critical
50-64%     -> Degraded
65%+       -> Healthy
```

The function returns semantic values rather than colors.
`src/components/TransferToBank/HealthBadge.tsx` decides how those meanings
should look. This keeps the business rule independent from the current theme.

## Component Design

`TransferToBank.tsx` is the orchestration component. It consumes the hook,
coordinates user actions, and selects the appropriate view through
`renderContent`.

`BankList.tsx` only maps data, while `BankRow.tsx` renders one interactive bank.
Each row is a real `<button>`, providing keyboard interaction and focus
behavior automatically. Bank IDs are used as React keys because they represent
stable identity.

The state selector is a controlled segmented control. It lets the interviewer
demonstrate loaded, skeleton, empty, and error states without modifying the
service.

## Accessibility

The implementation uses semantic lists, buttons, headings, `role="status"` for
loading, `role="alert"` for errors, and `aria-live` for selection confirmation.

Health is communicated through text and percentages as well as color, so
meaning does not depend on color perception. Icon-only controls include
accessible labels and visible tooltips. Reduced-motion preferences are also
respected in `src/index.css`.

## Design Decisions

- Tailwind CSS keeps component styling colocated and makes responsive states
  easy to review during a live exercise.
- Lucide supplies consistent, recognizable interface icons.
- Mobile-first sizing preserves the supplied design while the constrained
  desktop layout remains easy to scan.
- Health calculations are separate from visual styling, allowing either layer
  to change independently.
- Dedicated state components keep the main orchestration component readable.

## Trade-offs

For this exercise, a custom hook is clearer than introducing TanStack Query or
SWR. In production, one of those libraries could provide caching, retries,
visibility-aware polling, and stale-data handling.

The state-preview control is useful for assessment and development, but it
would normally live in Storybook or behind a development flag in production.

The mock service stores values in module memory. A real implementation would
treat the backend as the source of truth.

Bank selection currently shows a confirmation message. In the full product,
the component could expose an `onBankSelect` callback or navigate to the next
step in the transfer flow.

## Verification

The implementation was verified with TypeScript, Oxlint, a production Vite
build, and browser checks at desktop and mobile viewport sizes. The browser
checks covered all four display states, both retry paths, manual refresh, bank
selection, horizontal overflow, and clipped controls.
# omniBiz-live-test
