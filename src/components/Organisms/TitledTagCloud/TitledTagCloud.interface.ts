import { LucideIcon } from "lucide-react";

export interface TitledTagCloudProps {
    title: string;
    items: string[];
    ctaLink: string;
    ctaText: string;
    ctaIcon?: LucideIcon;
}
