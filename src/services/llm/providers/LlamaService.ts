import { LLMMessage, LLMResponse } from "../LLMService";

export class LlamaService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async call(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    // Placeholder for Llama implementation
    throw new Error("Llama API not configured yet");
  }
}
