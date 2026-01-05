"use client";
import { useState } from "react";
import { AnalysisService } from "@/services/analysis/AnalysisService";
import { SAMPLE_SCM, DUMMY_RESPONSES } from "./TestModule.model";
import { TestModuleView } from "./TestModule.view";

export const TestModule = () => {
  const [textInput, setTextInput] = useState("");
  const [queryInput, setQueryInput] = useState("");
  const [selectedModels, setSelectedModels] = useState([
    "claude",
    "gpt4",
    "gemini",
  ]);
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Dummy data for testing UI
  const loadDummyData = () => {
    setResults({
      scm: SAMPLE_SCM,
      responses: DUMMY_RESPONSES,
    });
  };

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId)
        ? prev.filter((m) => m !== modelId)
        : [...prev, modelId]
    );
  };

  const runTest = async () => {
    setTesting(true);

    try {
      const response = await fetch("/api/test-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: textInput,
          query: queryInput,
          models: selectedModels,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to run tests");
      }

      // Analyze each response using AI-powered evaluation for accuracy
      const analyzedResponses = await AnalysisService.analyzeBatch(
        SAMPLE_SCM,
        data.responses,
        true // Always use AI evaluation for benchmarking accuracy
      );

      setResults({
        scm: SAMPLE_SCM,
        responses: analyzedResponses,
      });
    } catch (error) {
      console.error("Error running tests:", error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <TestModuleView
      textInput={textInput}
      setTextInput={setTextInput}
      queryInput={queryInput}
      setQueryInput={setQueryInput}
      selectedModels={selectedModels}
      toggleModel={toggleModel}
      testing={testing}
      results={results}
      runTest={runTest}
      loadDummyData={loadDummyData}
    />
  );
};
