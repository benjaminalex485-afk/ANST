# Naming Conventions

Uniform nominal grammar preventing entropy and enhancing searchability.

## Event Tokens
All system events use the rigid lowercase, delimited structure: `domain:action_qualifier`.
- ✅ `market:tick_received`
- ✅ `portfolio:position_updated`
- ❌ `UPDATE_DATA`
- ❌ `set_market`

## File Grammar
- **React Components**: PascalCase (`ChartPanel.tsx`)
- **Services & Engines**: kebab-case (`simulation-engine.ts`)
- **Types**: kebab-case (`event-types.ts`)
- **Stores**: kebab-case prefixed or suffixed clearly (`runtime-store.ts`)

## React Component Grammar
Export explicit named exports along with sensible defaults for maximum import tree flexibility. Use functional components always. Keep handlers prefixed with `handle` (e.g., `handleTabClick`).

## Interface/Type Naming
- Interfaces must prefix with `I`: `interface IEventPayload`.
- Enums use PascalCase, members use SCREAMING_SNAKE_CASE: `enum Mode { LIVE_MODE = 'LIVE_MODE' }`.
