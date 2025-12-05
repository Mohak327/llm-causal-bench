import { FilterOption } from "@/components/Organisms/PillFilters/PillFilters.interface";

export interface SkillCategory {
  category: string;
  color: string;
  elements: Array<{ symbol: string; name: string }>;
}

export interface SkillsPageViewProps {
  filterOptions: FilterOption[];
  activeTab: string;
  allLabel: string;
  onTabChange: (value: string) => void;
  visibleCategories: SkillCategory[];
  categoryStartIndex: Record<string, number>;
}
