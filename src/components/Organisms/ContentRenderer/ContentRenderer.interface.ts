export interface SectionItem {
  heading: string;
  content: Array<{
    type: "paragraph" | "list" | "ordered-list";
    data: string | string[];
  }>;
}

export interface ContentRendererProps {
  sections: SectionItem[];
}