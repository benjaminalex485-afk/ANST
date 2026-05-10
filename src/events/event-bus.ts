import { IEventBus, IEvent, EventCallback } from './types';

class EventBus implements IEventBus {
  private handlers: Map<string, Set<EventCallback>> = new Map();
  
  // 🎯 High-performance partitioned lookup for domain-scoped subscribers (e.g., 'market:*')
  private domainHandlers: Map<string, Set<EventCallback>> = new Map();

  public publish(event: IEvent): void {
    const topic = event.type;
    const [domain] = topic.split(':'); // Fast partition extraction
    
    // 1. Direct Literal Subscribers
    this.executeCallbacks(this.handlers.get(topic), event);

    // 2. Domain-scoped Subscribers (e.g., 'market:*')
    if (domain) {
      this.executeCallbacks(this.domainHandlers.get(domain), event);
    }

    // 3. Global Pipeline Subscribers
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

  public subscribe(type: string, handler: EventCallback): () => void {
    const isDomainWildcard = type.endsWith(':*');
    
    if (isDomainWildcard) {
      const domain = type.split(':')[0];
      if (!this.domainHandlers.has(domain)) this.domainHandlers.set(domain, new Set());
      this.domainHandlers.get(domain)!.add(handler);
      
      return () => {
        const subs = this.domainHandlers.get(domain);
        if (subs) {
          subs.delete(handler);
          if (subs.size === 0) this.domainHandlers.delete(domain);
        }
      };
    }

    // Fallback to standard literal matching
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    return () => {
      const subscribers = this.handlers.get(type);
      if (subscribers) {
        subscribers.delete(handler);
        if (subscribers.size === 0) {
          this.handlers.delete(type);
        }
      }
    };
  }
}

export const eventBus = new EventBus();
