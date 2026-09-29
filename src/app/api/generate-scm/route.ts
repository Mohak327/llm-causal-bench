import { NextRequest, NextResponse } from 'next/server';
import { complete, httpStatusOf, parseJsonObject, parseUserKeys } from '@/services/llm/LLMService';
import { DEFAULT_GENERATE_MODEL, KEYS_HEADER } from '@/services/llm/models';

const SYSTEM_PROMPT = `You are an expert in causal reasoning and structural causal models (SCMs). Generate a causal reasoning benchmark based on the user's prompt.

Your response must be ONLY a valid JSON object with this exact structure:
{
  "G": {
    "nodes": {
      "A": "Variable_Name_A",
      "B": "Variable_Name_B",
      "C": "Variable_Name_C"
    },
    "edges": [
      ["A", "B"],
      ["B", "C"]
    ]
  },
  "T": "A narrative text describing the causal scenario with all variables in their original state.",
  "V": ["B"],
  "Q": "A counterfactual question asking what would happen if variable B had a different value.",
  "M": "P(T_{B=new_value} | T=t)",
  "S": "The ground truth answer showing the correct causal reasoning with downstream effects properly updated."
}

Guidelines:
- Create realistic scenarios from medicine, economics, physics, ecology, or social systems
- Ensure the causal graph is clear with 3-6 nodes
- The intervention variable V should be a mediator or root cause
- The query Q should test if models properly propagate causal changes
- Ground truth S should show correct counterfactual reasoning
- Make T detailed enough to establish clear causal relationships

Return ONLY the JSON object, no markdown, no explanation.`;

// Checks the shape the UI relies on; the model's JSON is otherwise untrusted.
function isSCM(value: Record<string, any>): boolean {
  const nodes = value.G?.nodes;
  const edges = value.G?.edges;
  return (
    nodes && typeof nodes === 'object' &&
    Array.isArray(edges) &&
    edges.every((e: unknown) => Array.isArray(e) && e.length === 2 && e.every((k) => k in nodes)) &&
    Array.isArray(value.V) && value.V.every((k: unknown) => typeof k === 'string' && k in nodes) &&
    ['T', 'Q', 'S'].every((k) => typeof value[k] === 'string')
  );
}

export async function POST(request: NextRequest) {
  const { prompt, model = DEFAULT_GENERATE_MODEL } = await request.json();

  if (!prompt) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
  }

  try {
    const response = await complete(
      model,
      {
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        // Room for reasoning models' thinking plus a detailed narrative.
        maxTokens: 8192,
        json: true,
      },
      parseUserKeys(request.headers.get(KEYS_HEADER))
    );

    const scmData = parseJsonObject(response.text);
    if (!isSCM(scmData)) {
      return NextResponse.json(
        { error: 'The model returned a scenario with a malformed graph', responseText: response.text },
        { status: 502 }
      );
    }

    return NextResponse.json({ scmData, generatedBy: response.model });
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate SCM' },
      { status: httpStatusOf(error) }
    );
  }
}
