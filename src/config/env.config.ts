/**
 * Environment Configuration
 * Centralized access to environment variables
 */

export const ENV_CONFIG = {
  // Environment Information
  ENV_NAME: process.env.NEXT_PUBLIC_ENV_NAME || "LOCAL",
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",
  
  // API Configuration
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
  
  // Feature Flags
  IS_PRODUCTION: process.env.NEXT_PUBLIC_ENV_NAME === "PROD",
  IS_DEVELOPMENT: process.env.NEXT_PUBLIC_ENV_NAME === "LOCAL",
  IS_QA: process.env.NEXT_PUBLIC_ENV_NAME === "QA1",
  
  // Show debug features (dummy data buttons, etc.)
  SHOW_DEBUG_FEATURES: process.env.NEXT_PUBLIC_ENV_NAME !== "PROD",
} as const;

// Type for the config
export type EnvConfig = typeof ENV_CONFIG;

// Helper function to get environment display name
export const getEnvDisplayName = (): string => {
  const envMap: Record<string, string> = {
    LOCAL: "Local Development",
    QA1: "QA Environment",
    PROD: "Production",
  };
  return envMap[ENV_CONFIG.ENV_NAME] || ENV_CONFIG.ENV_NAME;
};

// Helper to check if we're in a specific environment
export const isEnvironment = (env: "LOCAL" | "QA1" | "PROD"): boolean => {
  return ENV_CONFIG.ENV_NAME === env;
};
