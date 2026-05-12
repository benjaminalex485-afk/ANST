# Master Event Payload Schema & Safety Contracts

This governance specification establishes mandatory protocols for runtime message architecture, enforcing telemetry tracing, security shielding, and execution deterministic stability.

---

## 1. The Event Envelope Spec

Every event published into the messaging core MUST mathematically strictly adhere to this unified static footprint:

```typescript
interface IMessageMetadata {
  version: number;        // 🔒 Immutable Schema Rev (e.g. 1)
  eventId: string;        // 🔍 Unique UUID v4 Trace ID
  correlationId: string;  // 🧵 Ancestral Trace Vector for causality tracking
  timestamp: number;      // ⏱️ Sourced EXCLUSIVELY via TimeAuthority.now()
  source?: string;        // 🏷️ Generating Component (e.g. "MarketFeedService")
}

interface IEvent<P = any> {
  metadata: IMessageMetadata;
  type: string;            // 📝 Domain Descriptor "domain:action"
  payload: Readonly<P>;    // 📦 Sealed Immutable Payload Body
}
```

---

## 2. Strict Routing Constraints

### 2.1 The Wildcard Law
Listeners to the global `"*"` wildcard partition are restricted by mandate.
- **AUTHORIZED**: System Monitors, Analytics Sinks, Telemetry Transports, LocalStorage Sync.
- **PROHIBITED**: Business logic engines, React render-triggers, Order Flow routing.
Violation compromises algorithmic performance thresholds.

### 2.2 Directionality (No Loops)
To prevent infinite cascading cycles, state vectors observe unidirectional propagation laws:
1. **Services generate Facts** (`market:*`).
2. **Stores ingest Facts** into State.
3. **Stores MUST NEVER publish facts** to the bus from within their reducer/dispatch logic. 
*Store-to-Store direct event triggering violates domain isolation boundary layer security.*

---

## 3. Critical Invariants

- **Zero Mutability**: Modifying an event payload object reference directly causes runtime execution contamination. Use structural cloning (`{ ...old }`) within state transitions.
- **Idempotent Safety**: Handlers MUST guarantee deterministic output even if duplicate network deliveries inadvertently inject duplicate trace IDs.
- **String Allocation Safety**: The core routing engine employs a `domainCache` lookup map to bypass dynamic regex/split execution overhead during live-stream execution.
