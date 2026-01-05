import { GoogleGenerativeAI } from "@google/generative-ai";

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
  private static async callClaude(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system: systemMessage?.content,
        messages: userMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Claude API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return {
      text: data.content[0].text,
      tokenCount: data.usage?.output_tokens || 0,
      latency,
      model: "claude",
    };
  }

  private static async callGPT4(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `GPT-4 API Error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    const latency = Date.now() - startTime;

    return {
      text: data.choices[0].message.content,
      tokenCount: data.usage?.completion_tokens || 0,
      latency,
      model: "gpt4",
    };
  }

  private static async callGemini(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: maxTokens,
      },
    });

    // Combine system and user messages for Gemini
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    let combinedPrompt = "";
    if (systemMessage) {
      combinedPrompt += systemMessage.content + "\n\n";
    }
    combinedPrompt += userMessages.map((m) => m.content).join("\n\n");

    const result = await model.generateContent(combinedPrompt);
    const latency = Date.now() - startTime;

    console.log(
      "gemini_data",
      model,
      result.response.text(),
      result.response.usageMetadata?.candidatesTokenCount
    );

    return {
      text: result.response.text(),
      tokenCount: result.response.usageMetadata?.candidatesTokenCount || 0,
      latency,
      model: "gemini",
    };
  }

  private static async callLlama(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    // Placeholder for Llama implementation
    throw new Error("Llama API not configured yet");
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
