export interface FilterOption {
  label: string;
  value: string;
  color?: string;
  count?: number;
  meta?: unknown;
}

export interface PillFiltersProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
  allLabel?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  rounded?: boolean;
}

export interface PillFiltersViewProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  includeAll: boolean;
  allLabel: string;
  className: string;
  containerClassName: string;
  getButtonClassName: (active: boolean) => string;
}
