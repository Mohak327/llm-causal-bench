import { NextRequest, NextResponse } from "next/server";
import { LLMService } from "@/services/llm/LLMService";

export async function POST(request: NextRequest) {
  try {
    const { text, query, models } = await request.json();

    if (!text || !query || !models || !Array.isArray(models)) {
      return NextResponse.json(
        { error: "Text, query, and models array are required" },
        { status: 400 }
      );
    }

    // Call all selected models in parallel using LLMService
    const responses = await Promise.all(
      models.map((modelId: string) => 
        LLMService.callForTest(modelId, text, query)
      )
    );

    return NextResponse.json({
      success: true,
      responses,
    });
  } catch (error: any) {
    console.error("Test error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to run tests" },
      { status: 500 }
    );
  }
}
