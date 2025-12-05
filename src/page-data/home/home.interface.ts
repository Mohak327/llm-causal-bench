import { LucideIcon } from "lucide-react";

export interface SkillCategoryProps {
  category: string;
  color: string;
  elements: Array<{ symbol: string; name: string }>;
}

export interface HomeViewProps {
  techArsenal: {
    title: string;
    skills: string[];
    ctaLink: string;
    ctaText: string;
    ctaIcon?: LucideIcon;
  };
}