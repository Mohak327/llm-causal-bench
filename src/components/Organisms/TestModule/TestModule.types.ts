export interface TestModuleViewProps {
  textInput: string;
  setTextInput: (value: string) => void;
  queryInput: string;
  setQueryInput: (value: string) => void;
  selectedModels: string[];
  toggleModel: (modelId: string) => void;
  testing: boolean;
  results: any;
  runTest: () => void;
  loadDummyData: () => void;
}