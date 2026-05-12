# Architectural Manifesto

## Core Philosophy
This system operates as a Deterministic Event-Driven Application. Every action is derived from an underlying discrete event, which ensures maximum future capability for replay auditing, automated testing, and distributed tracing.

## Mandatory Boundary Rules
1. **UI Isolation**: Files within `src/components/**/*` are **STRICTLY FORBIDDEN** from importing modules directly from `src/services/**/*`. All interactions must flow through standardized state selectors, event triggers, or viewmodel bridges.
2. **Runtime Agnostic**: The user interface layer should remain entirely passive. It displays data and triggers command requests, it does not calculate business outcomes.
3. **Event Immutable Core**: All messages crossing the bridge support native telemetry tracing (`eventId`, `correlationId`, `timestamp`).

## Directory Responsibilities
- `/core`: The absolute foundation. Event types, core math, and time authority logic.
- `/services`: Engine logic, simulation generation, external connectivity.
- `/runtime`: System orchestration layer containing the environment state and future schedulers.
- `/shared`: Highly generic logic reusable across the stack (date formatters, hooks).
- `/viewmodels`: Strict adapter layer decoupling complex store entities from view layout primitives.
