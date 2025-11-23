import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();

  // Mock Data - In a real app, this would fetch based on ID
  // Content derived from Resume [cite: 13, 14, 19, 20]
  const projectData = {
    title: id === 'neural' ? "Causal & Time Series Analysis" : "Computational Cardiac Modeling",
    subtitle: id === 'neural' ? "Investigating Synaptic Activity" : "Phase Response Curve Analysis",
    tags: id === 'neural' ? ["Neuroscience", "Python", "Hodgkin-Huxley"] : ["BioPhysics", "Nonlinear ODE", "Python"],
    color: id === 'neural' ? "bg-[#ff90e8]" : "bg-[#4ade80]", // Pink or Green
    description: id === 'neural' 
      ? "Conducted causal inference and time series analysis on simulated and recorded neural signals using Hodgkin-Huxley and Rinzel models. The goal was to investigate synaptic activity and signal propagation for neurotechnology applications." // [cite: 13]
      : "Engineered a Python-based computational framework for ECG signal modeling. Leveraged nonlinear ODE simulations to optimize cardiac intervention timing through Phase Response Curve (PRC) analysis.", // [cite: 14]
    results: id === 'neural'
      ? ["Simulated neural signals successfully.", "Identified key synaptic propagation paths.", "modeled Rinzel neuron behaviors."]
      : ["Optimized intervention timing.", "Built robust ECG modeling framework.", "Visualized nonlinear dynamics."],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Image / Banner Area */}
      <div className={`h-64 ${projectData.color} border-b-4 border-black relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20" 
             style={{backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '20px 20px'}}>
        </div>
        <div className="container mx-auto h-full flex items-end p-4 md:p-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black uppercase bg-white border-4 border-black px-4 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {projectData.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-2xl font-bold uppercase border-b-4 border-black inline-block mb-4">Overview</h2>
              <p className="text-lg leading-relaxed font-medium">
                {projectData.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold uppercase border-b-4 border-black inline-block mb-4">Key Outcomes</h2>
              <ul className="space-y-3">
                {projectData.results.map((res, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="bg-black text-white font-bold w-6 h-6 flex items-center justify-center text-sm mt-1 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-lg">{res}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="border-4 border-black p-6 bg-[#f0f0f0]">
              <h3 className="font-black uppercase mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {projectData.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 border-2 border-black bg-white font-bold text-xs uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-4 border-black p-6 bg-black text-white">
              <h3 className="font-black uppercase mb-4">Role</h3>
              <p className="font-bold">Researcher / Engineer</p>
              <div className="mt-4 pt-4 border-t-2 border-white/30 text-sm opacity-80">
                 Focus: Simulation & Analysis
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;