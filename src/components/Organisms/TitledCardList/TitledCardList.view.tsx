import type { TitledCardListProps } from "./TitledCardList.interface";
import Card from "../../Molecules/Card/Card.view";
import { Terminal } from "lucide-react";
import ConditionLinkView from "@/components/Molecules/ConditionLink/ConditionLink.view";

const TitledCardList = <
  T extends {
    link: string | undefined;
    accent?: string;
    bgColor?: string;
  }
>({
  title,
  items,
  renderItem,
  icon,
}: TitledCardListProps<T>) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4 mb-2">
        <div className="bg-black text-white p-2 border-2 border-black">
          {icon || <Terminal size={24} />}
        </div>
        <h2 className="text-4xl font-black uppercase">{title}</h2>
      </div>
      {items.map((item, index) => (
        <ConditionLinkView target="_blank" link={item.link} key={item.link}>
          <Card
            bgColor={item.bgColor ? item.bgColor : "white"}
            accentColor={item.accent ? item.accent : "white"}
          >
            {renderItem(item)}
          </Card>
        </ConditionLinkView>
      ))}
    </div>
  );
};

export default TitledCardList;
