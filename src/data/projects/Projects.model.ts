import { Theme } from "../../Theme";
import { ProjectInterface } from "./projects.interface";

const projects: ProjectInterface[] = [
  {
    id: "neural",
    title: "Causal & Time Series Analysis of Neural Activity",
    subtitle: "Investigating Synaptic Activity",
    category: "Neuroscience / Causal ML",
    summary:
      "Using Hodgkin-Huxley & Rinzel models to investigate synaptic activity.",
    sections: [
      {
        heading: "Overview",
        content: [
          {
            type: "paragraph",
            data: "Conducted causal inference and time series analysis on simulated and recorded neural signals using Hodgkin-Huxley and Rinzel models.",
          },
          {
            type: "paragraph",
            data: "The goal was to investigate synaptic activity and signal propagation for neurotechnology applications.",
          },
        ],
      },
      {
        heading: "Key Outcomes",
        content: [
          {
            type: "list",
            data: [
              "Simulated neural signals successfully.",
              "Identified key synaptic propagation paths.",
              "Modeled Rinzel neuron behaviors.",
            ],
          },
        ],
      },
    ],
    tags: ["Neuroscience", "Python", "Hodgkin-Huxley", "Simulations"],
    accentColor: Theme.colors.pink[400],
  },
  {
    id: "cardiac",
    title: "Computational Cardiac Modeling",
    subtitle: "Phase Response Curve Analysis",
    category: "HealthTech / Biophysics",
    summary:
      "ECG signal modeling and Phase Response Curve (PRC) analysis using nonlinear ODE simulations.",
    sections: [
      {
        heading: "Overview",
        content: [
          {
            type: "paragraph",
            data: "Developed a comprehensive computational framework for ECG signal generation and cardiac intervention optimization using nonlinear dynamical systems and advanced phase response analysis. This project bridges theoretical cardiac electrophysiology with practical clinical applications, enabling precise timing of life-saving interventions like cardioversion.",
          },
        ],
      },
      {
        heading: "Technical Implementation",
        content: [
          {
            type: "list",
            data: [
              "Mathematical Derivation: Reduced a complex 6-variable cardiac ODE system to a biologically faithful 4-variable model through rigorous algebraic manipulation, proving equivalence under specific initial conditions and coupling terms",
              "Nonlinear ODE Modeling: Implemented a physiologically accurate ECG generator using coupled nonlinear oscillators representing sinoatrial (SA) and atrioventricular (AV) nodes, incorporating realistic parameters for healthy and pathological (sinus tachycardia) conditions",
              "Advanced Numerical Simulation: Employed high-precision RK4 integration with adaptive state bounding to simulate cardiac dynamics over extended time periods, ensuring numerical stability despite system stiffness",
              "Phase Response Curve Analysis: Applied Winfree's method with cross-correlation techniques to characterize cardiac rhythm sensitivity, computing PRCs for both SA and AV nodes through systematic perturbation analysis across 120 phase points",
              "Clinical Translation: Identified optimal cardioversion windows (phases 0.65-1.0) where perturbations minimally affect heartbeat timing, providing quantitative guidance for defibrillation procedures",
            ],
          },
        ],
      },
      {
        heading: "Key Achievements",
        content: [
          {
            type: "ordered-list",
            data: [
              "Successfully generated realistic ECG waveforms distinguishing healthy vs. tachycardia states",
              "Achieved precise PRC estimation with sub-millisecond resolution using robust cross-correlation algorithms",
              "Implemented bonus comparative analysis against published literature (Fig 4a from Guevara et al.), converting phase shifts to physiological millisecond advances for clinical relevance",
              "Demonstrated interdisciplinary expertise combining dynamical systems theory, numerical methods, and biomedical signal processing",
            ],
          },
        ],
      },
      {
        heading: "Technologies & Skills",
        content: [
          {
            type: "list",
            data: [
              "Python (NumPy, SciPy, Matplotlib)",
              "Nonlinear ODE Integration",
              "Signal Processing",
              "Phase Response Analysis",
              "Biomedical Modeling",
              "Scientific Computing",
            ],
          },
        ],
      },
      {
        heading: "Impact",
        content: [
          {
            type: "paragraph",
            data: "This work provides a foundation for personalized cardiac intervention timing, potentially reducing complications from inappropriate defibrillation and advancing computational cardiology toward precision medicine applications.",
          },
        ],
      },
    ],
    tags: ["BioPhysics", "Nonlinear ODE", "Python"],
    accentColor: Theme.colors.green[400],
  },
];

export const allProjects = projects;

export const getProjectById = (id: string): ProjectInterface | undefined => {
  return projects.find((p) => p.id === id);
};
