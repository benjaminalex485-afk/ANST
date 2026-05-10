/**
 * Market Transport Lifecycle Registry
 */
export enum FeedStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  HYDRATING = 'HYDRATING',   // REST Backfill active
  STREAMING = 'STREAMING',   // Live WebSocket Active
  STALE = 'STALE',           // Keep-alive mismatch
  ERROR = 'ERROR'
}

export interface IMarketFeedConfig {
  apiKey: string;
  enableWebsocket: boolean;
}

export interface IFeedStatusEvent {
  status: FeedStatus;
  timestamp: number;
  message?: string;
}
