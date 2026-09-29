// The one list of models the app knows about. Safe to import on the client:
// it holds env var names, never keys. Free-tier limits checked 2026-09-27.

export type ProviderId =
  | "gemini"
  | "groq"
  | "openrouter"
  | "cloudflare"
  | "ollama"
  | "anthropic";

export interface ModelConfig {
  id: string;
  label: string;
  provider: ProviderId;
  // The provider's own model ID.
  modelId: string;
  // Model family, so a judge never grades its own family's answers.
  family: string;
  color: string;
  free: boolean;
  limits: string;
  // null means the model rejects a temperature setting.
  temperature: number | null;
  // Gemma on the Gemini API rejects system messages.
  systemAsUser?: boolean;
  // Whether the endpoint accepts a JSON response format.
  jsonMode: boolean;
}

// Env vars a provider needs before its models can run. Order is display order.
export const PROVIDERS: Record<
  ProviderId,
  { label: string; env: string[]; keyUrl?: string }
> = {
  gemini: {
    label: "Google Gemini",
    env: ["GEMINI_API_KEY"],
    keyUrl: "https://aistudio.google.com/apikey",
  },
  groq: { label: "Groq", env: ["GROQ_API_KEY"], keyUrl: "https://console.groq.com/keys" },
  openrouter: {
    label: "OpenRouter",
    env: ["OPENROUTER_API_KEY"],
    keyUrl: "https://openrouter.ai/settings/keys",
  },
  cloudflare: {
    label: "Cloudflare Workers AI",
    env: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"],
    keyUrl: "https://dash.cloudflare.com/profile/api-tokens",
  },
  // Local only: leave unset on Vercel, which can't reach your machine.
  ollama: { label: "Ollama (local)", env: ["OLLAMA_BASE_URL"] },
  anthropic: {
    label: "Anthropic (paid)",
    env: ["ANTHROPIC_API_KEY"],
    keyUrl: "https://console.anthropic.com/settings/keys",
  },
};

// Providers users can bring their own keys for. Ollama is excluded: its
// setting is a URL, and letting users aim our server at any URL invites SSRF.
export const BYOK_PROVIDERS: ProviderId[] = (Object.keys(PROVIDERS) as ProviderId[]).filter(
  (p) => p !== "ollama"
);
export const BYOK_ENV = BYOK_PROVIDERS.flatMap((p) => PROVIDERS[p].env);

// Header carrying a user's keys with each request (base64 JSON, never stored).
export const KEYS_HEADER = "x-causalitea-keys";

// Models a user's own keys can run.
export const modelsUnlockedBy = (keys: Record<string, string>) =>
  MODELS.filter(
    (m) => BYOK_PROVIDERS.includes(m.provider) && PROVIDERS[m.provider].env.every((n) => keys[n])
  ).map((m) => m.id);

export const MODELS: ModelConfig[] = [
  {
    id: "gemini-3.8-flash",
    label: "Gemini 3.8 Flash",
    provider: "gemini",
    modelId: "gemini-3.8-flash",
    family: "gemini",
    color: "bg-[#4E66B8]",
    free: true,
    limits: "~20 requests/day",
    // Google advises keeping Gemini 3 at its default temperature of 1.
    temperature: 1,
    jsonMode: true,
  },
  {
    id: "gemini-3.5-flash-lite",
    label: "Gemini 3.5 Flash-Lite",
    provider: "gemini",
    modelId: "gemini-3.5-flash-lite",
    family: "gemini",
    color: "bg-[#6F84C9]",
    free: true,
    limits: "~500 requests/day",
    temperature: 1,
    jsonMode: true,
  },
  {
    id: "gemma-4-31b",
    label: "Gemma 4 31B",
    provider: "gemini",
    modelId: "gemma-4-31b-it",
    family: "gemma",
    color: "bg-[#3B8C8C]",
    free: true,
    limits: "free",
    temperature: 0,
    systemAsUser: true,
    jsonMode: false,
  },
  {
    id: "gpt-oss-120b",
    label: "GPT-OSS 120B",
    provider: "groq",
    modelId: "openai/gpt-oss-120b",
    family: "gpt-oss",
    color: "bg-[#2F7D5B]",
    free: true,
    limits: "30/min, 1K/day",
    temperature: 0,
    jsonMode: true,
  },
  {
    id: "gpt-oss-20b",
    label: "GPT-OSS 20B",
    provider: "groq",
    modelId: "openai/gpt-oss-20b",
    family: "gpt-oss",
    color: "bg-[#5C9C7E]",
    free: true,
    limits: "30/min, 1K/day",
    temperature: 0,
    jsonMode: true,
  },
  {
    id: "qwen3.8-27b",
    label: "Qwen 3.8 27B",
    provider: "groq",
    modelId: "qwen/qwen3.8-27b",
    family: "qwen",
    color: "bg-[#7A5AA6]",
    free: true,
    limits: "30/min, 1K/day",
    temperature: 0,
    jsonMode: true,
  },
  {
    id: "nemotron-3-ultra",
    label: "Nemotron 3 Ultra",
    provider: "openrouter",
    modelId: "nvidia/nemotron-3-ultra-550b-a55b:free",
    family: "nemotron",
    color: "bg-[#76A33A]",
    free: true,
    limits: "50/day shared across OpenRouter free models",
    temperature: 0,
    jsonMode: false,
  },
  {
    id: "laguna-s-2.1",
    label: "Laguna S 2.1",
    provider: "openrouter",
    modelId: "poolside/laguna-s-2.1:free",
    family: "laguna",
    color: "bg-[#C8862A]",
    free: true,
    limits: "50/day shared across OpenRouter free models",
    temperature: 0,
    jsonMode: false,
  },
  {
    id: "nemotron-3-super",
    label: "Nemotron 3 Super 120B",
    provider: "openrouter",
    modelId: "nvidia/nemotron-3-super-120b-a12b:free",
    family: "nemotron",
    color: "bg-[#94BA5E]",
    free: true,
    limits: "50/day shared across OpenRouter free models",
    temperature: 0,
    jsonMode: false,
  },
  {
    id: "gemma-4-26b-moe",
    label: "Gemma 4 26B-A4B",
    provider: "openrouter",
    modelId: "google/gemma-4-26b-a4b-it:free",
    family: "gemma",
    color: "bg-[#62A8A8]",
    free: true,
    limits: "50/day shared across OpenRouter free models",
    temperature: 0,
    jsonMode: false,
  },
  {
    id: "laguna-xs-2.1",
    label: "Laguna XS 2.1",
    provider: "openrouter",
    modelId: "poolside/laguna-xs-2.1:free",
    family: "laguna",
    color: "bg-[#DDA75A]",
    free: true,
    limits: "50/day shared across OpenRouter free models",
    temperature: 0,
    jsonMode: false,
  },
  {
    id: "llama-3.3-70b",
    label: "Llama 3.3 70B",
    provider: "cloudflare",
    modelId: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    family: "llama",
    color: "bg-[#3F6FD8]",
    free: true,
    limits: "~75 short requests/day (10K neurons)",
    temperature: 0,
    jsonMode: false,
  },
  {
    id: "llama-4-scout",
    label: "Llama 4 Scout",
    provider: "cloudflare",
    modelId: "@cf/meta/llama-4-scout-17b-16e-instruct",
    family: "llama",
    color: "bg-[#7195E3]",
    free: true,
    limits: "~150 short requests/day (10K neurons)",
    temperature: 0,
    jsonMode: false,
  },
  {
    // Mistral's own free tier isn't offered to new accounts; Cloudflare's is.
    id: "mistral-small-3.1",
    label: "Mistral Small 3.1 24B",
    provider: "cloudflare",
    modelId: "@cf/mistralai/mistral-small-3.1-24b-instruct",
    family: "mistral",
    color: "bg-[#E1702F]",
    free: true,
    limits: "~100 short requests/day (10K neurons)",
    temperature: 0,
    jsonMode: false,
  },
  {
    id: "ollama-gemma4-12b",
    label: "Gemma 4 12B (local)",
    provider: "ollama",
    modelId: "gemma4:12b",
    family: "gemma",
    color: "bg-[#2E6E6E]",
    free: true,
    limits: "unlimited, runs on your machine",
    temperature: 0,
    jsonMode: true,
  },
  {
    id: "ollama-qwen3-8b",
    label: "Qwen 3 8B (local)",
    provider: "ollama",
    modelId: "qwen3:8b",
    family: "qwen",
    color: "bg-[#5E4287]",
    free: true,
    limits: "unlimited, runs on your machine",
    temperature: 0,
    jsonMode: true,
  },
  {
    id: "ollama-phi4-mini",
    label: "Phi-4 Mini (local)",
    provider: "ollama",
    modelId: "phi4-mini",
    family: "phi",
    color: "bg-[#4A7FB5]",
    free: true,
    limits: "unlimited, runs on your machine",
    temperature: 0,
    jsonMode: true,
  },
  {
    id: "claude-opus-5",
    label: "Claude Opus 5",
    provider: "anthropic",
    modelId: "claude-opus-5",
    family: "claude",
    color: "bg-[#C9693C]",
    free: false,
    limits: "paid",
    temperature: null,
    jsonMode: false,
  },
];

export const findModel = (id: string) => MODELS.find((m) => m.id === id);

export interface ModelGroup {
  provider: ProviderId;
  label: string;
  models: ModelConfig[];
  // False when the server lacks this provider's env vars.
  enabled: boolean;
  missingEnv: string[];
}

// Models grouped by provider for the pickers. `available` is null while the
// server's answer is loading, in which case every group shows as enabled.
export function modelGroups(available: string[] | null): ModelGroup[] {
  return (Object.keys(PROVIDERS) as ProviderId[]).map((provider) => {
    const models = MODELS.filter((m) => m.provider === provider);
    const enabled = !available || models.some((m) => available.includes(m.id));
    return {
      provider,
      label: PROVIDERS[provider].label,
      models,
      enabled,
      missingEnv: enabled ? [] : PROVIDERS[provider].env,
    };
  });
}

// IDs of models whose provider is configured on the server (not counting a
// user's own keys).
export async function loadAvailableModels(): Promise<string[] | null> {
  try {
    const response = await fetch("/api/test-models");
    return response.ok ? (await response.json()).available : null;
  } catch {
    return null;
  }
}

// One fast model per family; the pickers drop any whose key isn't set.
export const DEFAULT_TEST_MODELS = ["gemini-3.5-flash-lite", "gpt-oss-120b", "qwen3.8-27b"];
export const DEFAULT_GENERATE_MODEL = "gemini-3.8-flash";

// Judges in order of preference; the first configured one from a different
// family than the model being graded is used.
export const JUDGE_MODELS = ["gpt-oss-120b", "gemini-3.5-flash-lite", "gemma-4-31b"];

// (Inkling is left out: OpenRouter only serves it to registered agent apps.)
