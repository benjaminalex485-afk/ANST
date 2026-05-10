# AI-Native Trading Terminal — Frontend UI Shell

A pure UI/layout build. No backend, no stores, no realtime. All data is static mock data inline in components.

## Design system (src/styles.css)

Dark-first tokens in `oklch`. Add semantic tokens beyond shadcn defaults:

- `--background` deep neutral (~oklch 0.16 0.01 260)
- `--panel` slightly lighter surface for terminal panels
- `--panel-elevated` for hovered/active rows
- `--border` thin subtle line (~oklch 0.28 0.01 260)
- `--grid-line` even subtler for table rows
- `--bull` green (~oklch 0.72 0.17 150)
- `--bear` red (~oklch 0.65 0.22 25)
- `--warn` amber (~oklch 0.78 0.16 75)
- `--info` blue (~oklch 0.68 0.15 240)
- `--muted-foreground` mid gray for labels
- Tabular nums utility, mono font stack (JetBrains Mono / ui-monospace) for numbers
- Compact base font-size (12–13px), tight line-height
- Thin 1px borders, no large radii (radius-sm 2px, md 4px)

Register all new tokens in `@theme inline` so Tailwind classes like `bg-panel`, `text-bull`, `border-grid-line` work. No raw color classes in components.

## Routing (TanStack Start)

Create one route per nav item; each gets its own `head()` with title/description.

```
src/routes/
  __root.tsx              (existing — keep shell)
  _terminal.tsx           (layout: Sidebar + Topbar + <Outlet/>)
  _terminal.index.tsx     (/) Dashboard composition
  _terminal.market.tsx
  _terminal.signals.tsx
  _terminal.portfolio.tsx
  _terminal.orders.tsx
  _terminal.risk.tsx
  _terminal.strategy-lab.tsx
  _terminal.explainability.tsx
  _terminal.logs.tsx
  _terminal.health.tsx
  _terminal.settings.tsx
```

`_terminal.tsx` renders the chrome (sidebar + topbar) and an `<Outlet/>`. Index page is the full multi-panel dashboard; other routes reuse the same panel components focused on their domain (so the app feels real without business logic).

## Components (src/components/terminal/)

Reusable, dense, terminal-styled:

- `Sidebar.tsx` — collapsible icon+label nav, active highlight via `useRouterState`, bottom utility section with system state dot (green/amber/red), version label. Lucide icons: LayoutDashboard, CandlestickChart, Radio, Wallet, ListOrdered, ShieldAlert, FlaskConical, Brain, ScrollText, Activity, Settings.
- `Topbar.tsx` — left: logo mark + symbol selector (Select) + timeframe segmented control (1m/5m/15m/1H/4H/1D); center: price, change %, market status pill; right: WS dot, latency `12ms`, runtime badge (LIVE/PAPER), Bell, ⌘K button, avatar.
- `DashboardGrid.tsx` — CSS grid with named areas for desktop, stacks on smaller breakpoints.
- `TerminalPanel.tsx` — wrapper with thin border, header row (title, subtitle, actions slot), body slot, optional footer; supports `dense` and `scroll` variants.
- `StatusBadge.tsx` — variants: bull, bear, warn, info, neutral; sizes sm/xs.
- `MetricCard.tsx` — label (uppercase tracked) + big tabular value + delta.
- `SignalCard.tsx` — BUY/SELL/HOLD badge, confidence bar, strategy, regime tag, timestamp, reasoning line.
- `HoldingsTable.tsx` — dense table, sticky header, monochrome rows, green/red PnL, allocation mini-bar.
- `OrderBookSnippet.tsx` — small bid/ask ladder for visual richness (optional, mock).
- `RiskGauge.tsx` — horizontal progress with threshold ticks; KillSwitch is a prominent destructive button inside Risk panel.
- `SystemMetric.tsx` — sparkline-shaped placeholder (static svg) + value + label.
- `CommandPalette.tsx` — shadcn `Command` in a `Dialog`, open via ⌘K (local `useState`, no global store), grouped sections (Navigate, Symbols, Actions), keyboard hint footer.
- `NotificationToast.tsx` — uses existing `sonner`; add a small static "system alerts" stack in topbar dropdown for visual.

## Dashboard composition (index)

CSS grid (12-col, 12-row on xl):

```text
+------------------------------+----------------+
|         CHART (8x7)          |  SIGNALS (4x12)|
+------------------+-----------+                |
|  PORTFOLIO (5x5) | RISK (3x5)|                |
+------------------+-----------+----------------+
|         SYSTEM HEALTH (12x?)                  |
+-----------------------------------------------+
```

- md: 2-col stacks; sm: single column.

## Mock data

Inline `const` arrays per component (symbols, holdings, signals, risk metrics, health metrics). No fetches, no effects beyond local UI state (palette open, sidebar collapsed).

## Out of scope (explicit)

No websockets, stores, schedulers, AI calls, order execution, or DB. Charts are styled placeholders with axis lines + faint gridlines (pure SVG/divs).

## File deliverables

- Update `src/styles.css` with tokens + mono font + utilities
- New `src/components/terminal/*` (12 files above)
- New routes under `src/routes/_terminal.*`
- Replace `src/routes/index.tsx` with a redirect to the terminal index, OR convert it to be the `_terminal/index` content (simpler: keep `_terminal` layout and route `/` through it)
- Add Lucide imports as needed (already installed)

## Acceptance

- Dark, dense, monochrome workstation aesthetic — no gradients, no oversized cards
- Sidebar collapses, active route highlighted, ⌘K opens command palette modal
- Dashboard renders all panels with mock data, colors via semantic tokens only
- Each route has unique `head()` metadata
- Builds clean; desktop-first grid, graceful tablet/mobile stacking
