import { IEventBus, IEvent, EventCallback } from './types';

class EventBus implements IEventBus {
  private handlers: Map<string, Set<EventCallback>> = new Map();

  public publish(event: IEvent): void {
    const topic = event.type;
    const subscribers = this.handlers.get(topic);
    if (subscribers) {
      subscribers.forEach((handler) => {
        try {
          handler(event);
        } catch (err) {
          console.error(`Error in event handler for ${topic}:`, err);
        }
      });
    }

    // Support wildcard subscription
    const wildcards = this.handlers.get('*');
    if (wildcards) {
      wildcards.forEach((handler) => {
        try {
          handler(event);
        } catch (err) {
          console.error(`Error in wildcard handler for ${topic}:`, err);
        }
      });
    }
  }

  public subscribe(type: string, handler: EventCallback): () => void {
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
