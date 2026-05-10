# Architectural Decisions Log (ADR)

Record of significant governance decisions, ensuring continuity over time.

## ADR-001: React 18 (Wait mode on React 19)
**Status**: Approved
**Context**: React 19 introduces novel rendering behaviors, while 18.3.1 represents the absolute limit of stability for ecosystem adapters, chart drivers, and state managers.
**Decision**: Locked to `^18.3.1` to prioritize environment predictability and deterministic scheduler behavior over bleeding-edge features.

## ADR-002: Direct Component Mounting (Removal of TanStack Router)
**Status**: Approved
**Context**: The initial iteration acts as a cohesive standalone dashboard. Advanced routing introduces high upfront abstraction overhead.
**Decision**: Replaced routing abstractions with direct dashboard mounting to accelerate primary view stabilizing. Can be refactored back when distinct navigable domain scopes emerge.

## ADR-003: Core Time Authority Established
**Status**: Approved
**Context**: Native `Date.now()` introduces clock drift breaking future replay capabilities.
**Decision**: Explicit folder created in `src/core/time/` establishing the concept of a synchronized clock driver for eventual deterministic operation.
