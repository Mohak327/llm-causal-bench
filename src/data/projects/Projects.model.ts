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
  {
    id: "dft-image-reconstruction",
    title:
      "Behind the Waves: Visualizing Image Reconstruction with 2D Discrete Fourier Transform",
    subtitle: "Visualizing Image Reconstruction with Fourier Transform",
    category: "Computational Imaging / Signal Processing",
    summary:
      "Exploring the decomposition and reconstruction of images using 2D Discrete Fourier Transform (DFT) to understand the role of frequency components in image structure.",
    tags: [
      "Image Reconstruction",
      "Fourier Transform",
      "Computer Vision",
      "Signal Processing",
      "Computational Imaging",
    ],
    role: "Researcher / Engineer",
    focus: "Simulation & Analysis",
    github: new URL("https://github.com/Mohak327/2D-DFT-Visualisation"),
    accentColor: Theme.colors.orange[400],
    sections: [
      {
        heading: "Overview",
        content: [
          {
            type: "paragraph",
            data: "There is something wild about realizing that <span class='highlight'><b>every scene, every photograph, every pattern your eyes can register is, at some level, just a particular mixture of waves</b></span>. Even beyond what humans can see, there is an endless spectrum of frequencies, and yet with the right combination of them, you can recreate any image, any signal, with almost absurd precision. The idea that an image of a face, a galaxy, or a handwritten digit can all be broken down into oscillations—and then rebuilt from those oscillations—makes the Fourier transform feel less like a technical tool and more like a fundamental language of structure and pattern.",
          },
          {
            type: "paragraph",
            data: "Encountering the discrete and fast Fourier transform in a quantum computing class made this even more striking: here was the same mathematical idea quietly real-world signal processing and the inner workings of quantum algorithms. The leap from <b>“here is a beautiful equation”</b> to <b>“this is the backbone of how we analyze, compress, and reconstruct information”</b> was what made the topic feel genuinely powerful rather than just exam material. It suggested that underneath the complexity of images and signals, there is a very clean, almost musical structure waiting to be exposed by the right transform.",
          },
        ],
      },
      {
        heading: "Why Visualize Image Reconstruction?",
        content: [
          {
            type: "paragraph",
            data: "This project grew out of wanting to see that structure in action instead of only trusting the theory. If a 2D discrete Fourier transform can really decompose an image into a sum of oscillations, then an equally important part of the story is watching those oscillations put the image back together. Building a simple visualizer that reconstructs an image step by step from its frequency components became the first thing to try: a way to watch low frequencies paint the broad strokes and high frequencies carve in the details, frame by frame. It was a small, concrete experiment to feel the power of the Fourier transform, not just admire it on the page.",
          },
        ],
      },
      {
        heading: "What Next?",
        content: [
          {
            type: "paragraph",
            data: "<b>Image Quality, Super-Resolution, and Generation</b>",
          },
          {
            type: "paragraph",
            data: "While this project focuses on visualizing reconstruction from existing frequency components, the same ideas extend to improving or generating images by learning to <b>“fill in”</b> missing frequencies. In modern computer vision, many super-resolution and inpainting methods explicitly operate in, or are constrained by, the frequency domain to recover high-frequency details that make images look sharper and more realistic.",
          },
          {
            type: "paragraph",
            data: "Conceptually, one can train ML models on images’ frequency representations to predict or refine high-frequency components, effectively adding back detail that was lost due to downsampling, blur, or corruption—this is the core of frequency-aware <b><span class='highlight'>“image super-resolution”</span></b> and <b><span class='highlight'>frequency-guided inpainting</span></b>. This project sits as a foundational step in that direction: it builds intuition for how frequencies encode structure and detail, which is exactly what these models learn to manipulate when improving image quality or reconstructing missing content.",
          },
        ],
      },
    ],
  },
];

export const allProjects = projects;

export const getProjectById = (id: string): ProjectInterface | undefined => {
  return projects.find((p) => p.id === id);
};
