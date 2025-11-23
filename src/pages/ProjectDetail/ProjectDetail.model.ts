import { Project } from "./ProjectDetail.interface";

const projectsData: Record<string, Project> = {
  neural: {
    title: "Causal & Time Series Analysis",
    subtitle: "Investigating Synaptic Activity",
    tags: ["Neuroscience", "Python", "Hodgkin-Huxley"],
    color: "bg-[#ff90e8]",
    description: "Conducted causal inference and time series analysis on simulated and recorded neural signals using Hodgkin-Huxley and Rinzel models. The goal was to investigate synaptic activity and signal propagation for neurotechnology applications.",
    results: ["Simulated neural signals successfully.", "Identified key synaptic propagation paths.", "modeled Rinzel neuron behaviors."],
  },
  cardiac: {
    title: "Computational Cardiac Modeling",
    subtitle: "Phase Response Curve Analysis",
    tags: ["BioPhysics", "Nonlinear ODE", "Python"],
    color: "bg-[#4ade80]",
    description: "Engineered a Python-based computational framework for ECG signal modeling. Leveraged nonlinear ODE simulations to optimize cardiac intervention timing through Phase Response Curve (PRC) analysis.",
    results: ["Optimized intervention timing.", "Built robust ECG modeling framework.", "Visualized nonlinear dynamics."],
  }
};

export const getProjectData = (id: string): Project | null => {
  return projectsData[id] || null;
};