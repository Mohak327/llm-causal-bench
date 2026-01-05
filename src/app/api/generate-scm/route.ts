import { NextRequest, NextResponse } from 'next/server';
import { LLMService } from '@/services/llm/LLMService';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an expert in causal reasoning and structural causal models (SCMs). Generate a causal reasoning benchmark based on the user's prompt.

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

    // Use LLM Service to call the selected model
    const response = await LLMService.call(
      model || 'claude',
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      4000 // Increased token limit to handle complex SCMs with detailed narratives
    );

    const responseText = response.text;

    // Parse the JSON response
    let scmData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scmData = JSON.parse(jsonMatch[0]);
      } else {
        scmData = JSON.parse(responseText);
      }
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Failed to parse SCM data from model response', responseText },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      scmData,
      generatedBy: model || 'claude'
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate SCM' },
      { status: 500 }
    );
  }
}
