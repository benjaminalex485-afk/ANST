# System Event Taxonomy & Governance

This document formalizes the naming conventions, ownership models, and delivery guarantees governing the terminal's centralized reactive architecture.

## 1. Event Naming Contract

Events MUST adhere strictly to the bipartite nomenclature:  
**`<domain>:<verb>`** (e.g., `market:tick`, `risk:kill_switch_triggered`)

### Reserved Top-Level Domains
| Domain | Source Ownership | Responsibility |
| :--- | :--- | :--- |
| `market` | `MarketFeedService` | Physical or simulated raw tick/history feed propagation. |
| `portfolio` | Portfolio Engine / OMS | Ledger updates, order fills, valuation revisions. |
| `risk` | Risk Subsystem | Threshold telemetry, circuit breaker activations. |
| `signal` | AI Inference Core | Strategy generation outputs, regimen reclassification. |
| `ui` | React Runtime Layer | User intent primitives (Tab Switch, Focus Request). |

---

## 2. Standard Payload Contract

All events dispatched across the system MUST adhere to the standardized envelope architecture:

```typescript
export interface IEvent {
  metadata: {
    version: number;        // Schema version for deterministic backward compatibility
    eventId: string;        // Global unique identifier (UUID v4)
    correlationId: string;  // Thread tracing identity for async causal linkage
    timestamp: number;      // GENERATED STRICTLY VIA TimeAuthority.now()
  };
  type: string;            // Formal 'domain:verb' string
  payload: any;            // Context-specific immutable payload payload
}
```

---

## 3. Guarantees & Constraints

### Immutable Payloads
Event payloads are strictly **ReadOnly**. Once instantiated and published, mutation of internal fields is strictly prohibited. Stores creating derived state must use cloning/spread mechanisms.

### Delivery Semantics
1. **Autonomous Disjunction**: Listeners are strictly decoupled from publishers. Publishers assume zero awareness of subscriber lifecycle.
2. **Bounded Routing**: Optimized via prefix partitioning (e.g., `domain:*`). Subscription registration MUST occur at module-level init to guarantee deterministic routing graphs.
3. **No Sequential Dependency**: System execution flows must NEVER presuppose execution order between disparate listeners of the same event context.

---

## 4. Temporal Governance

All temporal field genesis (`metadata.timestamp`) MUST reference `TimeAuthority.now()`. Direct access to JavaScript global `Date.now()` triggers are strictly blocked by static analyzer policy to ensure forward compatibility with acceleration playback systems.
