
import { Theme } from "../../Theme";
import { ProjectInterface } from "./projects.interface";

const projects: ProjectInterface[] = [
  {
    id: "neural",
    title: "Causal & Time Series Analysis of Neural Activity",
    subtitle: "Investigating Synaptic Activity",
    category: "Neuroscience / Causal ML",
    summary: "Using Hodgkin-Huxley & Rinzel models to investigate synaptic activity.",
    description: "Conducted causal inference and time series analysis on simulated and recorded neural signals using Hodgkin-Huxley and Rinzel models. The goal was to investigate synaptic activity and signal propagation for neurotechnology applications.",
    tags: ["Neuroscience", "Python", "Hodgkin-Huxley", "Simulations"],
    results: [
      "Simulated neural signals successfully.",
      "Identified key synaptic propagation paths.",
      "Modeled Rinzel neuron behaviors.",
    ],
    accentColor: Theme.colors.pink[400],
  },
  {
    id: "cardiac",
    title: "Computational Cardiac Modeling",
    subtitle: "Phase Response Curve Analysis",
    category: "HealthTech / Biophysics",
    summary: "ECG signal modeling and Phase Response Curve (PRC) analysis using nonlinear ODE simulations.",
    description: "Engineered a Python-based computational framework for ECG signal modeling. Leveraged nonlinear ODE simulations to optimize cardiac intervention timing through Phase Response Curve (PRC) analysis.",
    tags: ["BioPhysics", "Nonlinear ODE", "Python"],
    results: [
      "Optimized intervention timing.",
      "Built robust ECG modeling framework.",
      "Visualized nonlinear dynamics.",
    ],
    accentColor: Theme.colors.green[400],
  },
];

export const allProjects = projects;

export const getProjectById = (id: string): ProjectInterface | undefined => {
  return projects.find((p) => p.id === id);
};
