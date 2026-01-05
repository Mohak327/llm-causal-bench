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

    // Use LLM to evaluate the response
    const response = await LLMService.call(
      model || 'claude',
      [{ role: 'user', content: prompt }],
      1000
    );

    // Parse the JSON from the evaluator's response
    let analysis;
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        analysis = JSON.parse(response.text);
      }
      
      // Calculate ECR (Expected Calibration Error)
      analysis.ecr = (1 - analysis.accuracy) * 0.5;
      
    } catch (parseError) {
      return NextResponse.json(
        { 
          error: 'Failed to parse evaluation',
          rawResponse: response.text 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error: any) {
    console.error('Evaluation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to evaluate response' },
      { status: 500 }
    );
  }
}
