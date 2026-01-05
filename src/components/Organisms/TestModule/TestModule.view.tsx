"use client";
import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle,
  PlayCircle,
  TestTube,
  BarChart3,
} from "lucide-react";
import { AnalysisService } from "@/services/analysis/AnalysisService";

// Error type definitions
const ERROR_TYPES = [
  { code: 0, name: "No Error", color: "text-emerald-400" },
  { code: 1, name: "Not Changing Downstream Variables", color: "text-red-400" },
  { code: 2, name: "Changing Upstream Variables", color: "text-orange-400" },
  { code: 3, name: "Correlation Effect", color: "text-yellow-400" },
];

// Sample data structure
const SAMPLE_SCM = {
  G: {
    nodes: { A: "Rainfall", B: "Soil_Moisture", C: "Crop_Yield" },
    edges: [
      ["A", "B"],
      ["B", "C"],
    ],
  },
  T: "Heavy rainfall saturated the soil, leading to abundant crop yield.",
  V: ["A"],
  Q: "What if there was a drought instead?",
  M: "P(T_{A=drought} | T=t)",
  S: "A drought depleted soil moisture, causing crop failure.",
};

export const TestModule = () => {
  const [textInput, setTextInput] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [selectedModels, setSelectedModels] = useState([
    "claude",
    "gpt4",
    "gemini",
  ]);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  const availableModels = [
    { id: "claude", name: "Claude Sonnet 4.5", color: "bg-orange-500" },
    { id: "gpt4", name: "GPT-4", color: "bg-green-500" },
    { id: "gemini", name: "Gemini Pro", color: "bg-blue-500" },
    { id: "llama", name: "Llama 3", color: "bg-purple-500" },
  ];

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((m) => m !== modelId)
        : [...prev, modelId]
    );
  };

  const runTest = async () => {
    setTesting(true);

    try {
      const response = await fetch("/api/test-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput,
          query: queryInput,
          models: selectedModels,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to run tests");
      }

      // Analyze each response using AI-powered evaluation for accuracy
      const analyzedResponses = await AnalysisService.analyzeBatch(
        SAMPLE_SCM,
        data.responses,
        true // Always use AI evaluation for benchmarking accuracy
      );

      setResults({
        scm: SAMPLE_SCM,
        responses: analyzedResponses,
      });
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <TestTube className="w-6 h-6 text-cyan-400" />
          <h2 className="text-2xl font-bold text-white">Test LLM Models</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Text (T) - Causal Scenario
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter the original causal scenario text..."
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Query (Q) - Counterfactual Question
            </label>
            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Enter the counterfactual query..."
              className="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select Models to Test
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => toggleModel(model.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedModels.includes(model.id)
                      ? `${model.color} border-white text-white`
                      : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <CheckCircle
                    className={`w-4 h-4 mx-auto mb-1 ${
                      selectedModels.includes(model.id)
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  <div className="text-sm font-medium">{model.name}</div>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={runTest}
            disabled={
              testing ||
              !textInput ||
              !queryInput ||
              selectedModels.length === 0
            }
            className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {testing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                Run Causal Reasoning Test
              </>
            )}
          </button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 rounded-lg p-4 border border-red-700/50">
              <div className="text-red-300 text-sm mb-1">
                Avg Calibration Error
              </div>
              <div className="text-3xl font-bold text-white">
                {(
                  results.responses.reduce(
                    (acc: number, r: any) => acc + r.ecr,
                    0
                  ) / results.responses.length
                ).toFixed(4)}
              </div>
              <div className="text-xs text-red-400 mt-1">Lower is better</div>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 border border-slate-600">
              <div className="text-slate-300 text-sm mb-1">Total Tests</div>
              <div className="text-3xl font-bold text-white">
                {results.responses.length}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Models evaluated
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 rounded-lg p-4 border border-emerald-700/50">
              <div className="text-emerald-300 text-sm mb-1">
                Ground Truth Match
              </div>
              <div className="text-3xl font-bold text-white">
                {Math.round(
                  (results.responses.filter((r: any) => r.errorType === 0)
                    .length /
                    results.responses.length) *
                    100
                )}
                %
              </div>
              <div className="text-xs text-emerald-400 mt-1">
                Correct responses
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-900/40 to-red-800/20 rounded-lg p-4 border border-red-700/50">
              <div className="text-red-300 text-sm mb-1">Failures</div>
              <div className="text-3xl font-bold text-white">
                {results.responses.filter((r: any) => r.hallucination).length}
              </div>
              <div className="text-xs text-red-400 mt-1">
                With hallucinations
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">Model Comparison</h3>
            </div>

            <div className="space-y-4">
              {results.responses.map((result: any, idx: number) => {
                const model = availableModels.find(
                  (m) => m.id === result.model
                ) || {
                  id: result.model,
                  name: result.model,
                  color: "bg-gray-500",
                };
                const errorType = ERROR_TYPES.find(
                  (e) => e.code === result.errorType
                ) || { code: -1, name: "API Error", color: "text-gray-400" };

                return (
                  <div
                    key={idx}
                    className="bg-slate-900 rounded-lg p-5 border border-slate-700"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${model.color}`}
                        />
                        <span className="text-lg font-semibold text-white">
                          {model.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Accuracy</div>
                          <div
                            className={`text-sm font-bold ${
                              result.accuracy > 0.7
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {(result.accuracy * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Latency</div>
                          <div className="text-sm font-bold text-slate-300">
                            {result.latency}ms
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950 rounded p-3 mb-3">
                      <div className="text-xs text-slate-400 mb-1">
                        Response:
                      </div>
                      <div className="text-sm text-white">
                        {result.response}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-800 rounded p-2">
                        <div className="text-xs text-slate-400">Error Type</div>
                        <div
                          className={`text-sm font-semibold ${errorType.color}`}
                        >
                          {errorType.name}
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded p-2">
                        <div className="text-xs text-slate-400">Tokens</div>
                        <div className="text-sm font-semibold text-white">
                          {result.tokenCount}
                        </div>
                      </div>
                      <div className="bg-slate-800 rounded p-2">
                        <div className="text-xs text-slate-400">
                          Calibration
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            result.ecr < 0.2
                              ? "text-emerald-400"
                              : "text-orange-400"
                          }`}
                        >
                          {result.ecr.toFixed(4)}
                        </div>
                      </div>
                    </div>

                    {result.hallucination && (
                      <div className="mt-3 flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        Potential hallucination detected
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
