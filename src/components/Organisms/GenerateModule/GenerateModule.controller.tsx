"use client";
import { useState } from "react";
import { DUMMY_SCMS } from "./GenerateModule.model";
import { GenerateModuleView } from "./GenerateModule.view";

export const GenerateModule = () => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedSCMs, setGeneratedSCMs] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState("claude");
  const [error, setError] = useState("");

  const loadDummyData = () => {
    setGeneratedSCMs(DUMMY_SCMS);
    setError("");
  };

  const generateSCMs = async () => {
    setGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-scm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      const generated = {
        id: Date.now(),
        ...data.scmData,
        timestamp: new Date().toISOString(),
        generatedBy: data.generatedBy,
      };

      setGeneratedSCMs([generated]);
    } catch (err: any) {
      setError(err.message || "Failed to generate SCM");
      console.error("Generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };

  return (
    <GenerateModuleView
      prompt={prompt}
      setPrompt={setPrompt}
      generating={generating}
      generatedSCMs={generatedSCMs}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      error={error}
      generateSCMs={generateSCMs}
      copyToClipboard={copyToClipboard}
      loadDummyData={loadDummyData}
    />
  );
};
