export interface ContentBoxItem {
    heading: string;
    meta: string;
    subHeading: string;
    body: string;
    style?: string;
    accent?: string;
    bgColor?: string;
}

export interface TitledContentBoxProps {
    title: string;
    items: ContentBoxItem[];
    icon?: React.ReactNode;
}
