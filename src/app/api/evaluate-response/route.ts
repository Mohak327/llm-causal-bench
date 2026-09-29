import { NextRequest, NextResponse } from 'next/server';
import {
  complete,
  httpStatusOf,
  parseJsonObject,
  parseUserKeys,
  pickJudge,
} from '@/services/llm/LLMService';
import { KEYS_HEADER } from '@/services/llm/models';

export async function POST(request: NextRequest) {
  const { prompt, gradedModel } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    // A judge from another model family, so no model grades its own answers.
    // The user's keys pay for judging when they cover a judge model.
    const userKeys = parseUserKeys(request.headers.get(KEYS_HEADER));
    const judge = pickJudge(gradedModel, userKeys);
    const response = await complete(
      judge.id,
      {
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 2048,
        json: true,
      },
      userKeys
    );

    const raw = parseJsonObject(response.text);
    const { errorType, accuracy, reasoning, hallucination } = raw;
    if (
      !Number.isInteger(errorType) || (errorType as number) < 0 || (errorType as number) > 3 ||
      typeof accuracy !== 'number' ||
      typeof reasoning !== 'string' ||
      typeof hallucination !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'The judge returned a malformed grade', rawResponse: response.text },
        { status: 502 }
      );
    }

    return NextResponse.json({
      analysis: {
        errorType,
        accuracy: Math.min(1, Math.max(0, accuracy)),
        reasoning,
        hallucination,
        judge: judge.id,
      },
    });
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to evaluate response' },
      { status: httpStatusOf(error) }
    );
  }
}
