export interface ConditionLinkViewProps {
  children: React.ReactNode;
  link?: string;
  rel?: string;
  legacy?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement | HTMLDivElement, MouseEvent>) => void;
  className?: string;
  target?: string;
  dataTooltipId?: string;
  dataTooltipContent?: string;
}
