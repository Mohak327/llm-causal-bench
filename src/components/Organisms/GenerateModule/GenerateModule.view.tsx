import { AlertCircle, Copy, Sparkles, FileJson } from "lucide-react";
import { AVAILABLE_MODELS } from "./GenerateModule.model";
import ReactMarkdown from "react-markdown";
import { ENV_CONFIG } from "@/config/env.config";
import { SCMGraph } from "@/components/Molecules/SCMGraph/SCMGraph";
import { GenerateModuleViewProps } from "./GenerateModule.types";

export const GenerateModuleView = ({
  prompt,
  setPrompt,
  generating,
  generatedSCMs,
  selectedModel,
  setSelectedModel,
  error,
  generateSCMs,
  copyToClipboard,
  loadDummyData,
}: GenerateModuleViewProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">
            Generate SCM Benchmarks
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Foundation Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Generation Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scenario you want to generate causal graphs for... (e.g., 'Create a medical scenario involving drug effectiveness')"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <button
            onClick={generateSCMs}
            disabled={generating || !prompt}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate SCM Benchmark
              </>
            )}
          </button>

          {ENV_CONFIG.SHOW_DEBUG_FEATURES && (
            <button
              onClick={loadDummyData}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FileJson className="w-5 h-5" />
              Load Dummy SCMs (Testing)
            </button>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}
        </div>
      </div>

      {generatedSCMs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileJson className="w-5 h-5 text-purple-400" />
            Generated SCMs ({generatedSCMs.length})
          </h3>

          {generatedSCMs.map((scm) => (
            <div
              key={scm.id}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-2">
                    Generated: {new Date(scm.timestamp).toLocaleString()} •
                    Model: {scm.generatedBy || "claude"}
                  </div>
                  <div className="bg-slate-900 rounded p-4 mb-3">
                    <div className="text-slate-400 mb-2 font-semibold text-xs uppercase tracking-wide">Text (T):</div>
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-strong:font-bold prose-li:text-slate-200">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                          ol: ({ children }) => <ol className="list-decimal list-outside ml-5 space-y-2 my-3">{children}</ol>,
                          ul: ({ children }) => <ul className="list-disc list-outside ml-5 space-y-2 my-3">{children}</ul>,
                          li: ({ children }) => <li className="text-slate-200 leading-relaxed">{children}</li>,
                        }}
                      >
                        {scm.T}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-4 mb-3">
                    <div className="text-slate-400 mb-2 font-semibold text-xs uppercase tracking-wide">Query (Q):</div>
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-strong:font-bold prose-li:text-slate-200">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                          ol: ({ children }) => <ol className="list-decimal list-outside ml-5 space-y-2 my-3">{children}</ol>,
                          ul: ({ children }) => <ul className="list-disc list-outside ml-5 space-y-2 my-3">{children}</ul>,
                          li: ({ children }) => <li className="text-slate-200 leading-relaxed">{children}</li>,
                        }}
                      >
                        {scm.Q}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {scm.S && (
                    <div className="bg-slate-900 rounded p-4">
                      <div className="text-slate-400 mb-2 font-semibold text-xs uppercase tracking-wide">Solution (S):</div>
                      <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-strong:font-bold prose-li:text-slate-200">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                            strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                            ol: ({ children }) => <ol className="list-decimal list-outside ml-5 space-y-2 my-3">{children}</ol>,
                            ul: ({ children }) => <ul className="list-disc list-outside ml-5 space-y-2 my-3">{children}</ul>,
                            li: ({ children }) => <li className="text-slate-200 leading-relaxed">{children}</li>,
                          }}
                        >
                          {scm.S}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => copyToClipboard(scm)}
                  className="ml-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title="Copy JSON"
                >
                  <Copy className="w-4 h-4 text-slate-300" />
                </button>
              </div>

              <div className="mt-4 flex flex-col lg:flex-row gap-4">
                {/* Left side - Nodes and Edges stacked vertically */}
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="bg-slate-900 rounded p-4">
                    <div className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wide">
                      Nodes
                    </div>
                    <div className="space-y-2">
                      {Object.entries(scm.G.nodes).map(([key, val]) => (
                        <div key={key} className="text-sm text-white">
                          <span className="font-bold text-purple-400">
                            {key}:
                          </span>{" "}
                          {String(val)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-900 rounded p-4">
                    <div className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wide">
                      Edges
                    </div>
                    <div className="space-y-2">
                      {scm.G.edges.map((edge: string[], i: number) => (
                        <div key={i} className="text-sm text-white">
                          {edge[0]} → {edge[1]}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side - Graph Visualization */}
                <div className="w-full lg:w-1/2">
                  <div className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wide">
                    Causal Graph Visualization
                  </div>
                  <SCMGraph nodes={scm.G.nodes} edges={scm.G.edges} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
