export interface GenerateModuleViewProps {
  prompt: string;
  setPrompt: (value: string) => void;
  generating: boolean;
  generatedSCMs: any[];
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  // Models the server can run; null while loading.
  available: string[] | null;
  error: string;
  generateSCMs: () => void;
  copyToClipboard: (data: any) => void;
  copiedId: number | null;
  loadDummyData: () => void;
}