"use client";
import React, { useState } from 'react';
import { AlertCircle, Copy, Sparkles, FileJson } from 'lucide-react';

export const GenerateModule = () => {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedSCMs, setGeneratedSCMs] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState('claude');
  const [error, setError] = useState('');

  const generateSCMs = async () => {
    setGenerating(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-scm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.status}`);
      }
      
      const generated = {
        id: Date.now(),
        ...data.scmData,
        timestamp: new Date().toISOString(),
        generatedBy: data.generatedBy
      };
      
      setGeneratedSCMs([generated, ...generatedSCMs]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate SCM');
      console.error('Generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">Generate SCM Benchmarks</h2>
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
              <option value="claude">Claude Sonnet 4.5</option>
              <option value="gpt4">GPT-4</option>
              <option value="gemini">Gemini Pro</option>
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
            <div key={scm.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="text-sm text-slate-400 mb-2">
                    Generated: {new Date(scm.timestamp).toLocaleString()} • Model: {scm.generatedBy || 'claude'}
                  </div>
                  <div className="text-white font-mono text-sm bg-slate-900 rounded p-3 mb-3">
                    <div className="text-slate-400 mb-1">Text (T):</div>
                    {scm.T}
                  </div>
                  <div className="text-white font-mono text-sm bg-slate-900 rounded p-3">
                    <div className="text-slate-400 mb-1">Query (Q):</div>
                    {scm.Q}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(scm)}
                  className="ml-4 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  title="Copy JSON"
                >
                  <Copy className="w-4 h-4 text-slate-300" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-2">Nodes</div>
                  <div className="space-y-1">
                    {Object.entries(scm.G.nodes).map(([key, val]) => (
                      <div key={key} className="text-sm text-white">
                        <span className="font-bold text-purple-400">{key}:</span> {String(val)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-900 rounded p-3">
                  <div className="text-xs text-slate-400 mb-2">Edges</div>
                  <div className="space-y-1">
                    {scm.G.edges.map((edge: string[], i: number) => (
                      <div key={i} className="text-sm text-white">
                        {edge[0]} → {edge[1]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
