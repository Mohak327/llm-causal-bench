export interface SCMData {
  G: {
    nodes: Record<string, string>;
    edges: string[][];
  };
  T: string;
  V: string[];
  Q: string;
  M: string;
  S: string;
}

export interface AnalysisResult {
  errorType: number;
  accuracy: number;
  ecr: number;
  hallucination: boolean;
  reasoning: string;
}

/**
 * Analysis Service for evaluating LLM responses against SCM benchmarks
 */
export class AnalysisService {
  /**
   * Analyze an LLM response against ground truth using semantic evaluation
   * @param scm - The SCM benchmark data
   * @param response - The LLM's response text
   * @returns Analysis result with error classification
   */
  static async analyzeWithLLM(
    scm: SCMData,
    response: string,
    evaluatorModel: string = 'claude'
  ): Promise<AnalysisResult> {
    try {
      // Build evaluation prompt
      const evaluationPrompt = this.buildEvaluationPrompt(scm, response);
      
      // Call evaluator LLM (you can use LLMService here)
      const evalResponse = await fetch('/api/evaluate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: evaluationPrompt,
          model: evaluatorModel
        })
      });

      const evalData = await evalResponse.json();
      
      if (!evalResponse.ok) {
        throw new Error('Evaluation failed');
      }

      return evalData.analysis;
    } catch (error) {
      console.error('Analysis error:', error);
      return this.fallbackAnalysis(scm, response);
    }
  }

  /**
   * Build a structured evaluation prompt for the evaluator LLM
   */
  private static buildEvaluationPrompt(scm: SCMData, response: string): string {
    return `You are an expert evaluator for causal reasoning benchmarks. Analyze whether the LLM's response correctly handles the counterfactual scenario.

CAUSAL GRAPH:
Nodes: ${Object.entries(scm.G.nodes).map(([k, v]) => `${k}=${v}`).join(', ')}
Edges: ${scm.G.edges.map(e => `${e[0]}→${e[1]}`).join(', ')}

ORIGINAL SCENARIO:
${scm.T}

COUNTERFACTUAL QUERY:
${scm.Q}

GROUND TRUTH ANSWER:
${scm.S}

LLM RESPONSE:
${response}

EVALUATION CRITERIA:

1. DOWNSTREAM CHANGES: Did the response correctly update variables that are causally downstream of the intervention?
   - Intervention variables: ${scm.V.join(', ')}
   - Downstream variables should change
   - Upstream/independent variables should NOT change

2. CAUSAL CONSISTENCY: Does the response follow the causal structure in the graph?

3. HALLUCINATIONS: Does the response introduce information not supported by the graph structure?

4. ACCURACY: How well does the response match the ground truth reasoning?

Classify the response into ONE of these error types:
- 0: NO ERROR - Correct causal reasoning
- 1: NOT CHANGING DOWNSTREAM - Failed to update variables affected by intervention
- 2: CHANGING UPSTREAM - Incorrectly changed variables not affected by intervention
- 3: CORRELATION ERROR - Confused correlation with causation

Return ONLY a JSON object:
{
  "errorType": <0-3>,
  "accuracy": <0.0-1.0>,
  "reasoning": "<brief explanation>",
  "hallucination": <true/false>
}`;
  }

  /**
   * Simple fallback analysis using heuristics
   * Used when LLM evaluation fails or for quick testing
   */
  static fallbackAnalysis(scm: SCMData, response: string): AnalysisResult {
    const responseText = response.toLowerCase();
    const groundTruth = scm.S.toLowerCase();
    
    // Get node names for analysis
    const nodeNames = Object.values(scm.G.nodes).map(n => n.toLowerCase());
    const interventionVars = scm.V.map(v => scm.G.nodes[v]?.toLowerCase());
    
    // Calculate downstream variables
    const downstreamVars = this.getDownstreamVariables(scm.G, scm.V);
    const downstreamNames = downstreamVars.map(v => scm.G.nodes[v]?.toLowerCase());
    
    // Check if response mentions downstream changes
    const mentionsDownstream = downstreamNames.some(name => 
      responseText.includes(name)
    );
    
    // Simple similarity check
    const similarityScore = this.simpleSimilarity(responseText, groundTruth);
    
    // Classify error type
    let errorType = 0;
    let accuracy = similarityScore;
    
    if (!mentionsDownstream && downstreamVars.length > 0) {
      errorType = 1; // Not changing downstream
      accuracy = Math.min(accuracy, 0.4);
    } else if (similarityScore < 0.3) {
      errorType = 3; // Poor reasoning
      accuracy = similarityScore;
    }
    
    const ecr = (1 - accuracy) * 0.5;
    
    return {
      errorType,
      accuracy,
      ecr,
      hallucination: false,
      reasoning: 'Fallback heuristic analysis'
    };
  }

  /**
   * Get all variables downstream of the intervention variables
   */
  private static getDownstreamVariables(
    graph: { edges: string[][] },
    interventionVars: string[]
  ): string[] {
    const downstream = new Set<string>();
    const queue = [...interventionVars];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Find all edges where current is the source
      graph.edges.forEach(([source, target]) => {
        if (source === current && !downstream.has(target)) {
          downstream.add(target);
          queue.push(target);
        }
      });
    }
    
    return Array.from(downstream);
  }

  /**
   * Simple text similarity using word overlap
   */
  private static simpleSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(text2.split(/\s+/).filter(w => w.length > 3));
    
    const intersection = new Set(
      [...words1].filter(w => words2.has(w))
    );
    
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Batch analyze multiple responses
   */
  static async analyzeBatch(
    scm: SCMData,
    responses: Array<{ model: string; text: string; success: boolean }>,
    useAI: boolean = false
  ): Promise<Array<any>> {
    return Promise.all(
      responses.map(async (resp) => {
        if (!resp.success) {
          return {
            ...resp,
            accuracy: 0,
            errorType: -1,
            ecr: 0,
            hallucination: false,
            reasoning: 'API call failed'
          };
        }

        const analysis = useAI 
          ? await this.analyzeWithLLM(scm, resp.text)
          : this.fallbackAnalysis(scm, resp.text);

        return {
          ...resp,
          response: resp.text,
          ...analysis
        };
      })
    );
  }
}
