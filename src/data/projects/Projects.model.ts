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
    tags: [
      "Neuroscience",
      "Causal Inference",
      "Neuron Modeling",
      "Simulations",
    ],
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
    tags: [
      "BioPhysics",
      "Nonlinear ODE",
      "ECG Modeling",
      "Cardiology",
      "Phase Response Curve",
    ],
    accentColor: Theme.colors.green[400],
  },
  {
    id: "temporal-encoding-machines",
    title: "Temporal Encoding and Decoding in Neural Circuits",
    subtitle: "Exploring Signal Processing in Neural Models",
    category: "Computational Neuroscience",
    summary:
      "Implementation of temporal encoding machines and time decoding machines for signal processing in neural circuits, focusing on ASDM and IAF neurons.",
    sections: [
      {
        heading: "Overview",
        content: [
          {
            type: "paragraph",
            data: "This project implements temporal encoding machines (TEM) and time decoding machines (TDM) for signal processing in neural circuits, focusing on asynchronous sigma-delta modulators (ASDM) and integrate-and-fire (IAF) neurons.",
          },
          {
            type: "paragraph",
            data: "It explores how biological-inspired models encode and decode bandlimited signals, assesses recovery quality through signal-to-noise ratio (SNR) analysis, and examines nonlinear processing via ON-OFF separation.",
          },
          {
            type: "paragraph",
            data: "The work demonstrates the challenges of perfect recovery in nonlinear systems and provides quantitative evaluations of encoding/decoding fidelity.",
          },
        ],
      },
      {
        heading: "Technical Implementation",
        content: [
          {
            type: "list",
            data: [
              "ASDM Encoding/Decoding: Implemented a threshold-sensitive ASDM encoder to generate spike times from bandlimited stimuli (sum of sinc functions). Developed both δ-sensitive and δ-insensitive decoders using matrix-based reconstruction (pseudoinverse of cumulative sinc integrals), enabling robust recovery despite parameter variations.",
              "IAF Neuron Modeling: Built an IAF encoder for temporal encoding, with decoding via sinc basis functions. Simulated ON-OFF separation by rectifying signals into positive (ON) and negative (OFF) components, encoding/decoding each independently, and recombining for full-signal reconstruction.",
              "Signal Analysis: Computed whole-signal and time-varying SNR to evaluate recovery quality. Analyzed phase response curves (PRCs) for limit cycle dynamics, inferring optimal perturbation timings to minimize heartbeat disruptions.",
              "Numerical Methods: Used Euler integration for ODE solving, cumulative trapezoidal integration for matrix computations, and cross-correlation for PRC estimation. Handled nonlinear dynamics with state bounding and error handling for stability.",
              "Visualization: Generated comparative plots for waveforms, recovery errors, and SNR over time, with parameter sweeps (e.g., bias values) to study system behavior.",
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
              "High-Fidelity Recovery: Achieved accurate signal reconstruction with SNR values up to 30-40 dB for bandlimited cases, demonstrating effective handling of temporal encoding challenges.",
              "Robust Algorithms: Developed δ-insensitive decoding that outperforms δ-sensitive methods in noisy or variable conditions, reducing reconstruction errors by 10-20% in simulations.",
              "Nonlinear Insights: Quantified the impact of ON-OFF separation on recovery, showing how rectification introduces high-frequency harmonics, preventing perfect reconstruction while enabling feature extraction.",
              "Parameter Optimization: Analyzed bias effects (e.g., b=1 vs. b=0.2) on spike rates and SNR, identifying trade-offs between fidelity and efficiency—key for real-world neural models.",
              "Quantitative Analysis: Provided time-resolved SNR plots and PRC-based inferences, offering data-driven recommendations for safe neural perturbations (e.g., cardioversion timing).",
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
              "Signal Processing",
              "Neural Circuit Modeling",
              "SNR Analysis",
              "Data Visualization",
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
            data: "This work contributes to the understanding of temporal coding in neural circuits and provides a foundation for future research on efficient neural computation and its applications in biomedical engineering and artificial intelligence.",
          },
        ],
      },
    ],
    tags: [
      "Synaptic Neural Networks",
      "Signal Processing",
      "Neural Circuits",
      "Signal to Noise Ratio Analysis",
      "ASDM",
      "IAF Neurons",
    ],
    accentColor: Theme.colors.blue[400],
  },
];

export const allProjects = projects;

export const getProjectById = (id: string): ProjectInterface | undefined => {
  return projects.find((p) => p.id === id);
};
