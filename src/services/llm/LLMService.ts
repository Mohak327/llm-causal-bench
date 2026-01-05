import { ClaudeService } from "./providers/ClaudeService";
import { OpenAIService } from "./providers/OpenAIService";
import { GeminiService } from "./providers/GeminiService";
import { LlamaService } from "./providers/LlamaService";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  text: string;
  tokenCount?: number;
  latency: number;
  model: string;
}

export class LLMService {
  // Singleton instances for each provider
  private static claudeService: ClaudeService;
  private static openAIService: OpenAIService;
  private static geminiService: GeminiService;
  private static llamaService: LlamaService;

  /**
   * Initialize service instances with API keys
   */
  private static initializeServices(): void {
    if (!this.claudeService) {
      this.claudeService = new ClaudeService(
        process.env.ANTHROPIC_API_KEY || ""
      );
    }
    if (!this.openAIService) {
      this.openAIService = new OpenAIService(process.env.OPENAI_API_KEY || "");
    }
    if (!this.geminiService) {
      this.geminiService = new GeminiService(process.env.GEMINI_API_KEY || "");
    }
    if (!this.llamaService) {
      this.llamaService = new LlamaService(process.env.LLAMA_API_KEY || "");
    }
  }

  private static async callClaude(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    this.initializeServices();
    return this.claudeService.call(messages, maxTokens);
  }

  private static async callGPT4(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    this.initializeServices();
    return this.openAIService.call(messages, maxTokens);
  }

  private static async callGemini(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    this.initializeServices();
    return this.geminiService.call(messages, maxTokens);
  }

  private static async callLlama(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    this.initializeServices();
    return this.llamaService.call(messages, maxTokens);
  }

  /**
   * Call any LLM with a unified interface
   * @param model - The model to use ('claude', 'gpt4', 'gemini', 'llama')
   * @param messages - Array of messages with roles and content
   * @param maxTokens - Maximum tokens to generate
   * @returns Standardized LLM response
   */
  static async call(
    model: string,
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    try {
      switch (model) {
        case "claude":
          return await this.callClaude(messages, maxTokens);
        case "gpt4":
          return await this.callGPT4(messages, maxTokens);
        case "gemini":
          return await this.callGemini(messages, maxTokens);
        case "llama":
          return await this.callLlama(messages, maxTokens);
        default:
          throw new Error(`Unsupported model: ${model}`);
      }
    } catch (error: any) {
      throw new Error(`LLM Service Error (${model}): ${error.message}`);
    }
  }

  /**
   * Call a single model with text and query (for testing)
   * @param model - The model to use
   * @param text - The context text
   * @param query - The query to answer
   * @returns LLM response with success flag
   */
  static async callForTest(
    model: string,
    text: string,
    query: string
  ): Promise<LLMResponse & { success: boolean }> {
    const startTime = Date.now();
    try {
      const response = await this.call(
        model,
        [{ role: "user", content: `${text}\n\n${query}` }],
        1000
      );

      return {
        ...response,
        success: true,
      };
    } catch (error: any) {
      return {
        text: `Error: ${error.message}`,
        tokenCount: 0,
        latency: Date.now() - startTime,
        model,
        success: false,
      };
    }
  }
}
