import { z } from 'zod';

/**
 * Application Environment Contract
 * Validates that incoming runtime variables match expected schemas,
 * preventing failures deep in the system initialization tree.
 */
export const envSchema = z.object({
  VITE_RUNTIME_MODE: z.enum(['DEVELOPMENT', 'SIMULATION', 'REPLAY', 'PRODUCTION', 'DEGRADED']).default('DEVELOPMENT'),
  VITE_ENABLE_OBSERVABILITY: z.coerce.boolean().default(false),
  VITE_TWELVE_DATA_API_KEY: z.string().optional().default('demo'), // Allow fallback to prevent immediate startup crash
});

export type EnvConfig = z.infer<typeof envSchema>;

// Static mapping is MANDATORY for Vite's compile-time substitution engine to function correctly.
export const validateEnv = () => {
  return envSchema.parse({
    VITE_RUNTIME_MODE: import.meta.env.VITE_RUNTIME_MODE,
    VITE_ENABLE_OBSERVABILITY: import.meta.env.VITE_ENABLE_OBSERVABILITY,
    VITE_TWELVE_DATA_API_KEY: import.meta.env.VITE_TWELVE_DATA_API_KEY,
  });
};
