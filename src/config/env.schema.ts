import { z } from 'zod';

/**
 * Application Environment Contract
 * Validates that incoming runtime variables match expected schemas,
 * preventing failures deep in the system initialization tree.
 */
export const envSchema = z.object({
  VITE_RUNTIME_MODE: z.enum(['DEVELOPMENT', 'SIMULATION', 'REPLAY', 'PRODUCTION', 'DEGRADED']).default('DEVELOPMENT'),
  VITE_ENABLE_OBSERVABILITY: z.coerce.boolean().default(false),
});

export type EnvConfig = z.infer<typeof envSchema>;

// Optional utility to parse standard Vite Import Meta Environment
export const validateEnv = () => {
  return envSchema.parse(import.meta.env);
};
