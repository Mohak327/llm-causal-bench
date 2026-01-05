export interface GenerateModuleViewProps {
  prompt: string;
  setPrompt: (value: string) => void;
  generating: boolean;
  generatedSCMs: any[];
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  error: string;
  generateSCMs: () => void;
  copyToClipboard: (data: any) => void;
  loadDummyData: () => void;
}