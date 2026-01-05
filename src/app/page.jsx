"use client";
import React, { useState } from 'react';
import { Sparkles, TestTube, BarChart3 } from 'lucide-react';
import { GenerateModule } from '@/components/Organisms/GenerateModule/GenerateModule.view';
import { TestModule } from '@/components/Organisms/TestModule/TestModule.view';

export default function App() {
  const [activeTab, setActiveTab] = useState('test');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto p-6">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">CausalBench</h1>
              <p className="text-slate-400 mt-1">LLM Counterfactual Reasoning Observatory</p>
            </div>
          </div>
        </header>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'test'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <TestTube className="w-5 h-5" />
              Test Models
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'generate'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Benchmarks
            </div>
          </button>
        </div>

        {activeTab === 'test' ? <TestModule /> : <GenerateModule />}
      </div>
    </div>
  );
}