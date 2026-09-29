// Error type definitions
export const ERROR_TYPES = [
  { code: 0, name: "No error", color: "bg-leaf-mist text-leaf" },
  { code: 1, name: "Missed the ripple (Type I)", color: "bg-kiln-mist text-kiln" },
  { code: 2, name: "Rewrote the past (Type II)", color: "bg-tea-mist text-tea-deep" },
  { code: 3, name: "Guessed by association (Type III)", color: "bg-cobalt-mist text-cobalt" },
];

// Sample data structure
export const SAMPLE_SCM = {
  G: {
    nodes: { A: "Rainfall", B: "Soil_Moisture", C: "Crop_Yield" },
    edges: [
      ["A", "B"],
      ["B", "C"],
    ],
  },
  T: "Heavy rainfall saturated the soil, leading to abundant crop yield.",
  V: ["A"],
  Q: "What if there was a drought instead?",
  M: "P(T_{A=drought} | T=t)",
  S: "A drought depleted soil moisture, causing crop failure.",
};

// Dummy data for testing UI
export const DUMMY_RESPONSES = [
  {
    model: "gemini-3.5-flash-lite",
    response:
      "A drought would have depleted soil moisture significantly, leading to reduced water availability for crops and ultimately causing crop failure or substantially reduced yields.",
    accuracy: 0.92,
    latency: 1243,
    outputTokens: 42,
    errorType: 0,
    hallucination: false,
    judge: "gemma-4-31b",
    reasoning:
      "Propagates the drought through the whole chain: less rain, drier soil, failed harvest. Nothing upstream of rainfall was changed.",
  },
  {
    model: "gpt-oss-120b",
    response:
      "If there was a drought instead, the rainfall (A) would be minimal. This would reduce soil moisture (B) dramatically, which in turn would severely decrease crop yield (C), potentially leading to crop failure.",
    accuracy: 0.88,
    latency: 1876,
    outputTokens: 48,
    judge: "gemini-3.5-flash-lite",
    reasoning:
      "Correct causal direction and every downstream variable updated; slightly hedged on the size of the yield loss.",
    errorType: 0,
    hallucination: false,
  },
];
