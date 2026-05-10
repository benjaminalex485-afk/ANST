/**
 * Execution Environment Distinction
 * Drives core capability isolation (e.g. live broker vs historical replay).
 */
export enum RuntimeMode {
  DEVELOPMENT = 'DEVELOPMENT',
  SIMULATION = 'SIMULATION',
  REPLAY = 'REPLAY',
  PRODUCTION = 'PRODUCTION',
  DEGRADED = 'DEGRADED'
}

/**
 * High-Level Lifecycle Phasing
 * Orchestrates application ready-state before logic engines ignite.
 */
export enum RuntimeState {
  BOOTING = 'BOOTING',
  READY = 'READY',
  SIMULATING = 'SIMULATING',
  PAUSED = 'PAUSED',
  REPLAYING = 'REPLAYING',
  ERROR = 'ERROR',
  DEGRADED = 'DEGRADED'
}
