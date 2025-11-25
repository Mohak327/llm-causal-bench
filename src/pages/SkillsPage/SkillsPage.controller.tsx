"use client";
import { useMemo, useState } from "react";
import { skillCategories } from "@/data/skills/skills.model";
import { FilterOption } from "@/components/Organisms/PillFilters/PillFilters.interface";
import SkillsPageView from "./SkillsPage.view";

const Skills = () => {
  const allLabel = "All";
  const [activeTab, setActiveTab] = useState<string>(allLabel);

  const filterOptions: FilterOption[] = useMemo(
    () =>
      skillCategories.map((c) => ({
        label: c.category,
        value: c.category,
        color: c.color,
        count: c.elements.length,
      })),
    []
  );

  const categoryStartIndex = useMemo(() => {
    let acc = 0;
    const map: Record<string, number> = {};
    for (const cat of skillCategories) {
      map[cat.category] = acc;
      acc += cat.elements.length;
    }
    return map;
  }, []);

  const visibleCategories = useMemo(
    () =>
      activeTab === allLabel
        ? skillCategories
        : skillCategories.filter((c) => c.category === activeTab),
    [activeTab, allLabel]
  );

  return (
    <SkillsPageView
      filterOptions={filterOptions}
      activeTab={activeTab}
      allLabel={allLabel}
      onTabChange={setActiveTab}
      visibleCategories={visibleCategories}
      categoryStartIndex={categoryStartIndex}
    />
  );
};

export default Skills;
