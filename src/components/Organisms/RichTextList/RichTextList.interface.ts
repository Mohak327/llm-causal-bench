import { ReactElement } from "react";

export interface RichTextProps {
  text: string;
}

export interface RichTextViewProps {
  parsedText: React.ReactNode[];
}

export interface RichTextListProps {
  items: string[];
}

export interface RichTextListViewProps {
  parsedItems: ReactElement[][];
}