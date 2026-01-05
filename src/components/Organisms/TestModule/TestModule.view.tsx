import {
  AlertCircle,
  CheckCircle,
  PlayCircle,
  TestTube,
  BarChart3,
} from "lucide-react";
import { ERROR_TYPES, AVAILABLE_MODELS } from "./TestModule.model";
import { TestModuleViewProps } from "./TestModule.types";
import ReactMarkdown from "react-markdown";
import { ENV_CONFIG } from "@/config/env.config";

export const TestModuleView = ({
  textInput,
  setTextInput,
  queryInput,
  setQueryInput,
  selectedModels,
  toggleModel,
  testing,
  results,
  runTest,
  loadDummyData,
}: TestModuleViewProps) => {
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
              {AVAILABLE_MODELS.map((model) => (
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

          {ENV_CONFIG.SHOW_DEBUG_FEATURES && (
            <button
              onClick={loadDummyData}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <TestTube className="w-5 h-5" />
              Load Dummy Response (Testing)
            </button>
          )}
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
                const model = AVAILABLE_MODELS.find(
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

                    <div className="bg-slate-950 rounded p-4 mb-3">
                      <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">
                        Response:
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-strong:font-bold prose-li:text-slate-200">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 leading-relaxed text-sm">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            ol: ({ children }) => <ol className="list-decimal list-outside ml-5 space-y-2 my-3">{children}</ol>,
                            ul: ({ children }) => <ul className="list-disc list-outside ml-5 space-y-2 my-3">{children}</ul>,
                            li: ({ children }) => <li className="text-slate-200 leading-relaxed text-sm">{children}</li>,
                          }}
                        >
                          {result.response}
                        </ReactMarkdown>
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
