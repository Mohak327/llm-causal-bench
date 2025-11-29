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

export type NodeType = "root" | "text" | "b" | "i" | "highlight";

export type ElementNode = {
    type: Exclude<NodeType, "text">;
    children: Node[];
};

type TextNode = {
  type: "text";
  value: string;
};

export type Node = TextNode | ElementNode;