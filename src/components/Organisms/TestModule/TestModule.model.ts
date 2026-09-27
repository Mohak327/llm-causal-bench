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

// Available models for testing
export const AVAILABLE_MODELS = [
  { id: "claude", name: "Claude Sonnet 4.5", color: "bg-[#C9693C]" },
  { id: "gpt4", name: "GPT-4", color: "bg-[#2F7D5B]" },
  { id: "gemini", name: "Gemini 2.5 Flash", color: "bg-[#4E66B8]" },
  { id: "llama", name: "Llama 3", color: "bg-[#7A5AA6]" },
];

// Dummy data for testing UI
export const DUMMY_RESPONSES = [
  {
    model: "claude",
    response:
      "A drought would have depleted soil moisture significantly, leading to reduced water availability for crops and ultimately causing crop failure or substantially reduced yields.",
    accuracy: 0.92,
    latency: 1243,
    tokenCount: 42,
    ecr: 0.0845,
    errorType: 0,
    hallucination: false,
  },
  {
    model: "gpt4",
    response:
      "If there was a drought instead, the rainfall (A) would be minimal. This would reduce soil moisture (B) dramatically, which in turn would severely decrease crop yield (C), potentially leading to crop failure.",
    accuracy: 0.88,
    latency: 1876,
    tokenCount: 48,
    ecr: 0.1234,
    errorType: 0,
    hallucination: false,
  },
];
