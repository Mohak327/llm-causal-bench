export interface ContentItem {
  type: "paragraph" | "list" | "bullet";
  data: string | string[];
}

export interface SectionItem {
  heading: string;
  content: Array<{
    type: "paragraph" | "list" | "ordered-list";
    data: string | string[];
  }>;
}

export interface ProjectInterface {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  summary: string;
  role?: string;
  focus?: string;
  sections: SectionItem[];
  tags: string[];
  accentColor: string;
  github?: URL;
}
