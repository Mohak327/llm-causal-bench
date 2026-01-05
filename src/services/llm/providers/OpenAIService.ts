import { LLMMessage, LLMResponse } from "../LLMService";

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async call(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
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
}
