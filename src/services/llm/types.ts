import type { ModelConfig } from "./models";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  maxTokens: number;
  // Ask for a single JSON object back (providers enforce it where they can).
  json?: boolean;
}

export interface LLMCompletion {
  text: string;
  outputTokens?: number;
}

export interface LLMResponse extends LLMCompletion {
  model: string;
  latency: number;
  cached: boolean;
}

// One implementation per API shape, not per model.
export interface LLMProvider {
  complete(
    model: ModelConfig,
    request: LLMRequest,
    signal: AbortSignal
  ): Promise<LLMCompletion>;
}

export class LLMError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly retryAfterMs?: number
  ) {
    super(message);
    this.name = "LLMError";
  }

  get retryable() {
    return this.status === 429 || (this.status !== undefined && this.status >= 500);
  }
}

// Retry-After is either seconds or an HTTP date.
export function parseRetryAfter(value: string | null | undefined): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return seconds * 1000;
  const date = Date.parse(value);
  return Number.isNaN(date) ? undefined : Math.max(0, date - Date.now());
}
