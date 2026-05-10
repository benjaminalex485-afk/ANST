/**
 * Centralized Feature Flags
 * Used for progressive rollout, partial testing, and conditional execution paths.
 */
export const FEATURES = {
  replay: false,      // Architectural hook for deterministic logic capture
  websocket: false,   // Hook for real-time broker connectivity
  observability: false, // Hook for automated runtime traces
  aiSignals: true,    // Artificial generation logic for demo flows
} as const;

export type FeatureFlags = typeof FEATURES;
