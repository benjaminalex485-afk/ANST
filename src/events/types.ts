export interface IMessageMetadata {
  version: number;
  eventId: string;
  correlationId: string;
  timestamp: number;
}

export interface IEvent<T = any> {
  metadata: IMessageMetadata;
  type: string;
  payload: T;
}

export type EventCallback = (event: IEvent) => void;

export interface IEventBus {
  publish: (event: IEvent) => void;
  subscribe: (type: string, handler: EventCallback, subscriberId?: string) => () => void;
}
