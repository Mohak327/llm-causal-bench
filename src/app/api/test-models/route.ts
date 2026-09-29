import { NextRequest, NextResponse } from "next/server";
import { complete, isConfigured, parseUserKeys } from "@/services/llm/LLMService";
import { findModel, KEYS_HEADER, MODELS } from "@/services/llm/models";

// Which models can run, i.e. whose provider's env vars are set. Names only;
// no key values leave the server.
export async function GET() {
  return NextResponse.json({
    available: MODELS.filter((m) => isConfigured(m)).map((m) => m.id),
  });
}

export async function POST(request: NextRequest) {
  const { text, query, models } = await request.json();

  if (
    typeof text !== "string" ||
    typeof query !== "string" ||
    !Array.isArray(models) ||
    models.length === 0
  ) {
    return NextResponse.json(
      { error: "Text, query, and models array are required" },
      { status: 400 }
    );
  }
  const unknown = models.filter((id) => !findModel(id));
  if (unknown.length) {
    return NextResponse.json(
      { error: `Unknown models: ${unknown.join(", ")}` },
      { status: 400 }
    );
  }

  const userKeys = parseUserKeys(request.headers.get(KEYS_HEADER));

  // One failing model shouldn't sink the others, so errors stay per model.
  const responses = await Promise.all(
    models.map(async (model: string) => {
      try {
        const response = await complete(
          model,
          {
            messages: [{ role: "user", content: `${text}\n\n${query}` }],
            maxTokens: 4096,
          },
          userKeys
        );
        return { ...response, success: true };
      } catch (error) {
        return {
          model,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    })
  );

  return NextResponse.json({ responses });
}
