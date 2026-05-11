import { IEventBus, IEvent, EventCallback } from './types';

class EventBus implements IEventBus {
  private handlers: Map<string, Set<EventCallback>> = new Map();
  private domainHandlers: Map<string, Set<EventCallback>> = new Map();
  
  // ⚡️ Hot-path optimization: Cache precomputed domain splits to bypass runtime allocations
  private domainCache: Map<string, string> = new Map();

  // 🛡️ HMR Armor: Registry ensuring exactly-once binding for static architectural listeners
  private namedSubscriptions: Map<string, () => void> = new Map();

  public publish(event: IEvent): void {
    const topic = event.type;
    
    // Determine domain (via cache first to optimize iteration floods)
    let domain = this.domainCache.get(topic);
    if (domain === undefined) {
      domain = topic.includes(':') ? topic.split(':')[0] : '';
      this.domainCache.set(topic, domain); // Permanently memoize structure
    }
    
    // 1. Direct Literal Subscribers
    this.executeCallbacks(this.handlers.get(topic), event);

    // 2. Domain-scoped Subscribers
    if (domain) {
      this.executeCallbacks(this.domainHandlers.get(domain), event);
    }

    // 3. Global Pipeline Subscribers (Telemetry only)
    this.executeCallbacks(this.handlers.get('*'), event);
  }

  private executeCallbacks(subscribers: Set<EventCallback> | undefined, event: IEvent) {
    if (!subscribers) return;
    subscribers.forEach((handler) => {
      try {
        handler(event);
      } catch (err) {
        console.error(`Error in event handler for ${event.type}:`, err);
      }
    });
  }

  public subscribe(type: string, handler: EventCallback, subscriberId?: string): () => void {
    // 🛡️ HMR Enforcement Logic
    // If ID specified, immediately clear previous registration to defend against lifecycle leaks
    if (subscriberId && this.namedSubscriptions.has(subscriberId)) {
      console.debug(`[EventBus] HMR/Duplicate Reflesh: Detaching legacy subscriber '${subscriberId}'`);
      this.namedSubscriptions.get(subscriberId)!(); 
    }

    let cleanup: () => void;

    const isDomainWildcard = type.endsWith(':*');
    if (isDomainWildcard) {
      const domain = type.split(':')[0];
      if (!this.domainHandlers.has(domain)) this.domainHandlers.set(domain, new Set());
      this.domainHandlers.get(domain)!.add(handler);
      
      cleanup = () => {
        const subs = this.domainHandlers.get(domain);
        if (subs) {
          subs.delete(handler);
          if (subs.size === 0) this.domainHandlers.delete(domain);
        }
        if (subscriberId) this.namedSubscriptions.delete(subscriberId);
      };
    } else {
      if (!this.handlers.has(type)) {
        this.handlers.set(type, new Set());
      }
      this.handlers.get(type)!.add(handler);

      cleanup = () => {
        const subscribers = this.handlers.get(type);
        if (subscribers) {
          subscribers.delete(handler);
          if (subscribers.size === 0) this.handlers.delete(type);
        }
        if (subscriberId) this.namedSubscriptions.delete(subscriberId);
      };
    }

    // Anchor current subscription in the safety harness
    if (subscriberId) {
      this.namedSubscriptions.set(subscriberId, cleanup);
    }

    return cleanup;
  }
}

export const eventBus = new EventBus();
