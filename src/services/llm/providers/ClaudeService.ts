import Anthropic from "@anthropic-ai/sdk";
import type { ModelConfig } from "../models";
import {
  LLMError,
  parseRetryAfter,
  type LLMCompletion,
  type LLMProvider,
  type LLMRequest,
} from "../types";

export class AnthropicProvider implements LLMProvider {
  private readonly client: Anthropic;

  constructor(apiKey: string) {
    // Retries are handled once, in LLMService, for every provider.
    this.client = new Anthropic({ apiKey, maxRetries: 0 });
  }

  async complete(
    model: ModelConfig,
    { messages, maxTokens }: LLMRequest,
    signal: AbortSignal
  ): Promise<LLMCompletion> {
    const system = messages
      .filter((m) => m.role === "system")
      .map((m) => m.content)
      .join("\n\n");

    try {
      const response = await this.client.beta.messages.create(
        {
          model: model.modelId,
          max_tokens: maxTokens,
          ...(system && { system }),
          messages: messages
            .filter((m) => m.role !== "system")
            .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
          // If a safety classifier declines, the API retries on a fallback model.
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
        },
        { signal }
      );

      if (response.stop_reason === "refusal") {
        throw new LLMError("declined to answer");
      }
      const text = response.content
        .flatMap((block) => (block.type === "text" ? [block.text] : []))
        .join("");
      if (!text.trim()) {
        throw new LLMError(
          response.stop_reason === "max_tokens"
            ? "ran out of tokens before answering"
            : "returned an empty answer"
        );
      }
      return { text, outputTokens: response.usage.output_tokens };
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        throw new LLMError(
          error.message,
          error.status,
          parseRetryAfter(error.headers?.get("retry-after"))
        );
      }
      throw error;
    }
  }
}
