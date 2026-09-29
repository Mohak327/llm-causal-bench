"use client";
import { useEffect, useState } from "react";
import { keysHeader, type UserKeys } from "@/services/llm/keyVault";
import { DEFAULT_GENERATE_MODEL } from "@/services/llm/models";
import { DUMMY_SCMS } from "./GenerateModule.model";
import { GenerateModuleView } from "./GenerateModule.view";

export const GenerateModule = ({
  available,
  userKeys,
}: {
  // Models the site's or the user's keys can run; null while loading.
  available: string[] | null;
  userKeys: UserKeys;
}) => {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedSCMs, setGeneratedSCMs] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_GENERATE_MODEL);
  const [error, setError] = useState("");

  // Fall back to the first runnable model if the selected one lost its key.
  useEffect(() => {
    if (available) {
      setSelectedModel((prev) => (available.includes(prev) ? prev : available[0] ?? prev));
    }
  }, [available]);

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
          ...keysHeader(userKeys),
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

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = async (data: any) => {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedId(data.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <GenerateModuleView
      prompt={prompt}
      setPrompt={setPrompt}
      generating={generating}
      generatedSCMs={generatedSCMs}
      selectedModel={selectedModel}
      setSelectedModel={setSelectedModel}
      available={available}
      error={error}
      generateSCMs={generateSCMs}
      copyToClipboard={copyToClipboard}
      copiedId={copiedId}
      loadDummyData={loadDummyData}
    />
  );
};
