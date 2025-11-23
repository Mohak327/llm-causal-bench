export interface TitledCardListProps<T> {
    title: string;
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    icon?: React.ReactNode;
}
