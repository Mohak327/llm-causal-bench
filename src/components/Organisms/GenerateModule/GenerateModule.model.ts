// Available models for generation
export const AVAILABLE_MODELS = [
  { id: "claude", name: "Claude Sonnet 4.5" },
  { id: "gpt4", name: "GPT-4" },
  { id: "gemini", name: "Gemini 2.5 Flash" },
];

// Dummy generated SCMs for testing
export const DUMMY_SCMS = [
  {
    id: 1735987200000,
    G: {
      nodes: {
        A: "Medication_Dosage",
        B: "Blood_Pressure",
        C: "Patient_Health",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
      ],
    },
    T: "A patient was prescribed high-dose medication which lowered their blood pressure significantly, leading to improved overall health.",
    V: ["A"],
    Q: "What if the patient had been prescribed a low-dose medication instead?",
    M: "P(T_{A=low_dose} | T=t)",
    S: "With low-dose medication, the blood pressure reduction would be minimal, resulting in less significant health improvements.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    generatedBy: "claude",
  },
  {
    id: 1735983600000,
    G: {
      nodes: {
        A: "Study_Hours",
        B: "Test_Preparation",
        C: "Exam_Score",
        D: "Grade",
      },
      edges: [
        ["A", "B"],
        ["B", "C"],
        ["C", "D"],
      ],
    },
    T: "The student studied for 8 hours daily, which led to thorough test preparation, resulting in a high exam score and an A grade.",
    V: ["A"],
    Q: "What if the student had only studied for 2 hours daily?",
    M: "P(T_{A=2_hours} | T=t)",
    S: "With only 2 hours of daily study, the test preparation would be inadequate, leading to a lower exam score and a C grade.",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    generatedBy: "gpt4",
  },
];
