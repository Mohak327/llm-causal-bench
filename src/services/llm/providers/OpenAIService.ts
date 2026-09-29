import type { ModelConfig } from "../models";
import {
  LLMError,
  parseRetryAfter,
  type LLMCompletion,
  type LLMMessage,
  type LLMProvider,
  type LLMRequest,
} from "../types";

// Folds system messages into the first user turn, for models without a
// system role.
const foldSystem = (messages: LLMMessage[]): LLMMessage[] => {
  const system = messages.filter((m) => m.role === "system").map((m) => m.content);
  const rest = messages.filter((m) => m.role !== "system");
  if (!system.length || !rest.length) return rest;
  const [first, ...others] = rest;
  return [{ ...first, content: `${system.join("\n\n")}\n\n${first.content}` }, ...others];
};

// Some open models (Gemma, Qwen) put their reasoning inline in the answer.
const stripThinking = (text: string) =>
  text.replace(/<(thought|think)>[\s\S]*?<\/\1>/g, "").trim();

// Groq, OpenRouter and Gemini all accept the OpenAI chat-completions format.
export class OpenAICompatibleProvider implements LLMProvider {
  constructor(
    private readonly baseURL: string,
    private readonly apiKey: string
  ) {}

  async complete(
    model: ModelConfig,
    { messages, maxTokens, json }: LLMRequest,
    signal: AbortSignal
  ): Promise<LLMCompletion> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: model.modelId,
        messages: model.systemAsUser ? foldSystem(messages) : messages,
        max_tokens: maxTokens,
        ...(model.temperature !== null && { temperature: model.temperature }),
        ...(json && model.jsonMode && { response_format: { type: "json_object" } }),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      let message = body;
      try {
        message = JSON.parse(body)?.error?.message ?? body;
      } catch {}
      throw new LLMError(
        `${response.status} ${message}`.slice(0, 500),
        response.status,
        parseRetryAfter(response.headers.get("retry-after"))
      );
    }

    const data = await response.json();
    // OpenRouter can report an upstream failure inside a 200 response.
    if (data.error) {
      const status = Number(data.error.code) || undefined;
      throw new LLMError(`${status ?? ""} ${data.error.message ?? "upstream error"}`.trim(), status);
    }
    const choice = data.choices?.[0];
    const text = stripThinking(choice?.message?.content ?? "");
    if (!text) {
      throw new LLMError(
        choice?.finish_reason === "length"
          ? "ran out of tokens before answering"
          : "returned an empty answer"
      );
    }
    return { text, outputTokens: data.usage?.completion_tokens };
  }
}
