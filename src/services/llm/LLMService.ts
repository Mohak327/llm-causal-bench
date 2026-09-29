import { createHash } from "node:crypto";
import {
  BYOK_ENV,
  BYOK_PROVIDERS,
  findModel,
  JUDGE_MODELS,
  PROVIDERS,
  type ModelConfig,
  type ProviderId,
} from "./models";
import { AnthropicProvider } from "./providers/ClaudeService";
import { OpenAICompatibleProvider } from "./providers/OpenAIService";
import { LLMError, type LLMProvider, type LLMRequest, type LLMResponse } from "./types";

type Env = Record<string, string>;

// A user's own keys, from the request header. Only known key names survive,
// and the Cloudflare account ID must look like one since it goes in the URL.
export function parseUserKeys(header: string | null): Env {
  if (!header || header.length > 8_000) return {};
  try {
    const raw = JSON.parse(Buffer.from(header, "base64").toString("utf8"));
    const keys: Env = {};
    for (const name of BYOK_ENV) {
      const value = raw?.[name];
      if (typeof value === "string" && value.trim() && value.length <= 500) {
        keys[name] = value.trim();
      }
    }
    if (keys.CLOUDFLARE_ACCOUNT_ID && !/^[a-f0-9]{32}$/i.test(keys.CLOUDFLARE_ACCOUNT_ID)) {
      delete keys.CLOUDFLARE_ACCOUNT_ID;
    }
    return keys;
  } catch {
    return {};
  }
}

// Key-shaped strings and the user's own key values, scrubbed from messages
// before they reach logs or the browser.
const KEY_PATTERN = /\b(?:sk-(?:or-v1-|ant-)?[\w-]{12,}|gsk_\w{12,}|AIza[\w-]{20,})/g;
function redact(text: string, userKeys: Env) {
  let out = text;
  for (const value of Object.values(userKeys)) {
    if (value.length >= 8) out = out.split(value).join("[redacted]");
  }
  return out.replace(KEY_PATTERN, "[redacted]");
}

// The user's keys when they cover every env var the provider needs;
// otherwise the server's own.
function credentialsFor(id: ProviderId, userKeys: Env): { env: Env; own: boolean } | null {
  const names = PROVIDERS[id].env;
  if (BYOK_PROVIDERS.includes(id) && names.every((n) => userKeys[n])) {
    return { env: userKeys, own: true };
  }
  if (names.every((n) => process.env[n])) return { env: process.env as Env, own: false };
  return null;
}

// Base URL and key for each OpenAI-compatible provider, built from its env vars.
const ENDPOINTS: Record<Exclude<ProviderId, "anthropic">, (env: Env) => [string, string]> = {
  gemini: (env) => ["https://generativelanguage.googleapis.com/v1beta/openai", env.GEMINI_API_KEY],
  groq: (env) => ["https://api.groq.com/openai/v1", env.GROQ_API_KEY],
  openrouter: (env) => ["https://openrouter.ai/api/v1", env.OPENROUTER_API_KEY],
  cloudflare: (env) => [
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
    env.CLOUDFLARE_API_TOKEN,
  ],
  // Ollama ignores the key but the header must be present.
  ollama: (env) => [`${env.OLLAMA_BASE_URL.replace(/\/+$/, "")}/v1`, "ollama"],
};

const TIMEOUT_MS = 90_000;
// Local models on a CPU can take minutes for one answer.
const PROVIDER_TIMEOUT_MS: Partial<Record<ProviderId, number>> = { ollama: 300_000 };
const MAX_RETRIES = 2;
// Longer waits than this fail fast; free-tier daily limits reset in hours.
const MAX_WAIT_MS = 20_000;
const CACHE_SIZE = 200;

// Built once per server key. Users' keys get a fresh provider per request so
// one user's key can never serve another's call.
const providers = new Map<ProviderId, LLMProvider>();
// Per server instance, so it saves quota in dev and on warm instances only.
const cache = new Map<string, LLMResponse>();

export const isConfigured = (model: ModelConfig, userKeys: Env = {}) =>
  credentialsFor(model.provider, userKeys) !== null;

function createProvider(id: ProviderId, env: Env): LLMProvider {
  return id === "anthropic"
    ? new AnthropicProvider(env.ANTHROPIC_API_KEY)
    : new OpenAICompatibleProvider(...ENDPOINTS[id](env));
}

function providerFor(id: ProviderId, userKeys: Env): LLMProvider {
  const credentials = credentialsFor(id, userKeys);
  if (!credentials) {
    const where = BYOK_PROVIDERS.includes(id) ? "My keys or .env.local" : ".env.local";
    throw new LLMError(`needs ${PROVIDERS[id].env.join(" and ")} in ${where}`);
  }
  if (credentials.own) return createProvider(id, credentials.env);
  let provider = providers.get(id);
  if (!provider) {
    provider = createProvider(id, credentials.env);
    providers.set(id, provider);
  }
  return provider;
}

function describe(error: unknown, model: ModelConfig, userKeys: Env): LLMError {
  if (error instanceof LLMError) {
    const wait = error.retryAfterMs ? `; try again in ${Math.ceil(error.retryAfterMs / 1000)}s` : "";
    const message = error.status === 429 ? `is rate-limited${wait}` : error.message;
    return new LLMError(
      redact(`${model.label} ${message}`, userKeys),
      error.status,
      error.retryAfterMs
    );
  }
  if (error instanceof Error && error.name === "TimeoutError") {
    return new LLMError(`${model.label} timed out after ${timeoutFor(model) / 1000}s`, 504);
  }
  // fetch reports a refused connection as "fetch failed"; locally that means
  // Ollama isn't running.
  if (model.provider === "ollama" && error instanceof TypeError) {
    return new LLMError(`${model.label} is unreachable; is Ollama running?`, 503);
  }
  const message = error instanceof Error ? error.message : String(error);
  return new LLMError(redact(`${model.label}: ${message}`, userKeys));
}

// Keeps cache entries apart per key without holding the key itself.
const keyTag = (id: ProviderId, userKeys: Env) => {
  const credentials = credentialsFor(id, userKeys);
  if (!credentials?.own) return "server";
  const values = PROVIDERS[id].env.map((n) => credentials.env[n]).join("\n");
  return createHash("sha256").update(values).digest("hex").slice(0, 16);
};

const timeoutFor = (model: ModelConfig) => PROVIDER_TIMEOUT_MS[model.provider] ?? TIMEOUT_MS;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function complete(
  modelId: string,
  request: LLMRequest,
  userKeys: Env = {}
): Promise<LLMResponse> {
  const model = findModel(modelId);
  if (!model) throw new LLMError(`Unknown model: ${modelId}`, 400);

  // Only deterministic calls are safe to answer from the cache.
  const cacheKey =
    model.temperature === 0
      ? JSON.stringify([model.id, keyTag(model.provider, userKeys), request])
      : null;
  const hit = cacheKey ? cache.get(cacheKey) : undefined;
  if (hit) return { ...hit, cached: true };

  const start = Date.now();
  for (let attempt = 0; ; attempt++) {
    try {
      const provider = providerFor(model.provider, userKeys);
      const completion = await provider.complete(model, request, AbortSignal.timeout(timeoutFor(model)));
      const response = { ...completion, model: model.id, latency: Date.now() - start, cached: false };
      if (cacheKey) {
        if (cache.size >= CACHE_SIZE) cache.delete(cache.keys().next().value!);
        cache.set(cacheKey, response);
      }
      return response;
    } catch (error) {
      const wait =
        error instanceof LLMError && error.retryable
          ? error.retryAfterMs ?? 1000 * 2 ** attempt
          : null;
      if (wait === null || attempt >= MAX_RETRIES || wait > MAX_WAIT_MS) {
        throw describe(error, model, userKeys);
      }
      await sleep(wait);
    }
  }
}

// The first configured judge from a different family than the graded model.
export function pickJudge(gradedModelId?: string, userKeys: Env = {}): ModelConfig {
  const graded = gradedModelId ? findModel(gradedModelId) : undefined;
  const judge = JUDGE_MODELS.map(findModel).find(
    (m): m is ModelConfig => !!m && isConfigured(m, userKeys) && m.family !== graded?.family
  );
  if (!judge) throw new LLMError("No judge model is configured", 503);
  return judge;
}

// The first JSON object in a reply, tolerating code fences and prose around it.
export function parseJsonObject(text: string): Record<string, unknown> {
  const start = text.indexOf("{");
  if (start === -1) throw new LLMError("reply contained no JSON object", 502);
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) {
      try {
        return JSON.parse(text.slice(start, i + 1));
      } catch {
        throw new LLMError("reply contained invalid JSON", 502);
      }
    }
  }
  throw new LLMError("reply's JSON was cut off", 502);
}

// Upstream failures surface as 502, except rate limits and our own 4xx.
export const httpStatusOf = (error: unknown) =>
  error instanceof LLMError && error.status && [400, 429, 503, 504].includes(error.status)
    ? error.status
    : 502;
