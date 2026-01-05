import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMMessage, LLMResponse } from "../LLMService";

interface RateLimitConfig {
  requestsPerMinute: number;
  tokensPerMinute: number;
  requestsPerDay: number;
}

interface RequestRecord {
  timestamp: number;
  inputTokens: number;
}

export class GeminiService {
  private apiKey: string;
  private genAI: GoogleGenerativeAI;

  // Rate limit configuration based on Gemini 2.5 Flash limits
  private rateLimits: RateLimitConfig = {
    requestsPerMinute: 5, // Peak RPM: 5
    tokensPerMinute: 200000, // Peak TPM: ~200K
    requestsPerDay: 20, // Peak RPD: 20
  };

  // Track requests for rate limiting
  private requestHistory: RequestRecord[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Estimate token count for a message (rough approximation)
   * @param text - The text to estimate tokens for
   * @returns Estimated token count
   */
  private estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  /**
   * Clean up old request records outside the time windows
   */
  private cleanupRequestHistory(): void {
    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Keep only requests from the last 24 hours
    this.requestHistory = this.requestHistory.filter(
      (record) => record.timestamp > oneDayAgo
    );
  }

  /**
   * Check if request would exceed rate limits
   * @param estimatedInputTokens - Estimated input tokens for the request
   * @returns Object with canProceed flag and waitTime in milliseconds
   */
  private checkRateLimits(estimatedInputTokens: number): {
    canProceed: boolean;
    waitTime: number;
    reason?: string;
  } {
    this.cleanupRequestHistory();

    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Get requests in the last minute
    const recentRequests = this.requestHistory.filter(
      (record) => record.timestamp > oneMinuteAgo
    );

    // Get requests in the last day
    const dailyRequests = this.requestHistory.filter(
      (record) => record.timestamp > oneDayAgo
    );

    // Check RPM (Requests Per Minute)
    if (recentRequests.length >= this.rateLimits.requestsPerMinute) {
      const oldestRecentRequest = recentRequests[0];
      const waitTime = 60 * 1000 - (now - oldestRecentRequest.timestamp);
      return {
        canProceed: false,
        waitTime: Math.max(0, waitTime),
        reason: `Rate limit: ${this.rateLimits.requestsPerMinute} requests per minute exceeded`,
      };
    }

    // Check TPM (Tokens Per Minute)
    const tokensInLastMinute = recentRequests.reduce(
      (sum, record) => sum + record.inputTokens,
      0
    );

    if (
      tokensInLastMinute + estimatedInputTokens >
      this.rateLimits.tokensPerMinute
    ) {
      const oldestRecentRequest = recentRequests[0];
      const waitTime = 60 * 1000 - (now - oldestRecentRequest.timestamp);
      return {
        canProceed: false,
        waitTime: Math.max(0, waitTime),
        reason: `Rate limit: ${this.rateLimits.tokensPerMinute} tokens per minute exceeded`,
      };
    }

    // Check RPD (Requests Per Day)
    if (dailyRequests.length >= this.rateLimits.requestsPerDay) {
      const oldestDailyRequest = dailyRequests[0];
      const waitTime = 24 * 60 * 60 * 1000 - (now - oldestDailyRequest.timestamp);
      return {
        canProceed: false,
        waitTime: Math.max(0, waitTime),
        reason: `Rate limit: ${this.rateLimits.requestsPerDay} requests per day exceeded`,
      };
    }

    return { canProceed: true, waitTime: 0 };
  }

  /**
   * Wait for a specified amount of time
   * @param ms - Milliseconds to wait
   */
  private async wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Record a request in the history
   * @param inputTokens - Number of input tokens used
   */
  private recordRequest(inputTokens: number): void {
    this.requestHistory.push({
      timestamp: Date.now(),
      inputTokens,
    });
  }

  /**
   * Call Gemini API with rate limiting
   * @param messages - Array of messages
   * @param maxTokens - Maximum output tokens
   * @returns LLM response
   */
  async call(
    messages: LLMMessage[],
    maxTokens: number = 2000
  ): Promise<LLMResponse> {
    const startTime = Date.now();

    // Get current rate limit status before making request
    const currentStatus = this.getRateLimitStatus();
    console.log("📊 Gemini Rate Limit Status:", {
      requestsInLastMinute: `${currentStatus.requestsInLastMinute}/${currentStatus.limits.requestsPerMinute}`,
      tokensInLastMinute: `${currentStatus.tokensInLastMinute}/${currentStatus.limits.tokensPerMinute}`,
      requestsInLastDay: `${currentStatus.requestsInLastDay}/${currentStatus.limits.requestsPerDay}`,
    });

    // Combine system and user messages for Gemini
    const systemMessage = messages.find((m) => m.role === "system");
    const userMessages = messages.filter((m) => m.role !== "system");

    let combinedPrompt = "";
    if (systemMessage) {
      combinedPrompt += systemMessage.content + "\n\n";
    }
    combinedPrompt += userMessages.map((m) => m.content).join("\n\n");

    // Estimate input tokens
    const estimatedInputTokens = this.estimateTokenCount(combinedPrompt);
    console.log(`🔢 Estimated input tokens: ${estimatedInputTokens}`);

    // Check rate limits
    const rateLimitCheck = this.checkRateLimits(estimatedInputTokens);

    if (!rateLimitCheck.canProceed) {
      console.warn(
        `⏸️ Rate limit reached: ${rateLimitCheck.reason}. Waiting ${Math.ceil(
          rateLimitCheck.waitTime / 1000
        )} seconds...`
      );

      // Wait before proceeding
      await this.wait(rateLimitCheck.waitTime);
    }

    // Make the API call
    const model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        maxOutputTokens: maxTokens,
      },
    });

    const result = await model.generateContent(combinedPrompt);
    const latency = Date.now() - startTime;

    // Record this request
    this.recordRequest(estimatedInputTokens);
    console.log(`✅ Request recorded. Total requests in history: ${this.requestHistory.length}`);

    // console.log(
    //   "gemini_data",
    //   "gemini-2.5-flash",
    //   result.response.text(),
    //   result.response.usageMetadata?.candidatesTokenCount
    // );

    return {
      text: result.response.text(),
      tokenCount: result.response.usageMetadata?.candidatesTokenCount || 0,
      latency,
      model: "gemini",
    };
  }

  /**
   * Get current rate limit status
   * @returns Current usage statistics
   */
  getRateLimitStatus(): {
    requestsInLastMinute: number;
    tokensInLastMinute: number;
    requestsInLastDay: number;
    limits: RateLimitConfig;
  } {
    this.cleanupRequestHistory();

    const now = Date.now();
    const oneMinuteAgo = now - 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const recentRequests = this.requestHistory.filter(
      (record) => record.timestamp > oneMinuteAgo
    );

    const dailyRequests = this.requestHistory.filter(
      (record) => record.timestamp > oneDayAgo
    );

    const tokensInLastMinute = recentRequests.reduce(
      (sum, record) => sum + record.inputTokens,
      0
    );

    return {
      requestsInLastMinute: recentRequests.length,
      tokensInLastMinute,
      requestsInLastDay: dailyRequests.length,
      limits: this.rateLimits,
    };
  }
}
