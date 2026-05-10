export interface SystemHealth {
  wsLatency: number;        // ms
  apiLatency: number;       // ms
  cpuUsage: number;         // percentage
  memoryUsage: number;      // percentage
  brokerConnected: boolean;
  dbHealth: boolean;
  inferenceLatency: number; // ms
  queueDepth: number;
}
