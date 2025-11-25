import React from "react";
import PillFilters from "@/components/Organisms/PillFilters/PillFilters.controller";
import { SkillsPageViewProps } from "./SkillsPage.interface";

export const SkillsPageView: React.FC<SkillsPageViewProps> = ({
  filterOptions,
  activeTab,
  allLabel,
  onTabChange,
  visibleCategories,
  categoryStartIndex,
}) => {
  return (
    <div className="min-h-screen p-4 lg:p-12 pb-24">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b-4 border-black pb-4">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">
            Skill Matrix
          </h1>
          <p className="text-xl font-bold max-w-2xl">
            The elemental composition of my technical capabilities. Organized by
            domain affinity.
          </p>
        </header>

        {/* Filters */}
        <div className="mb-10">
          <PillFilters
            options={filterOptions}
            value={activeTab}
            onChange={onTabChange}
            includeAll
            allLabel={allLabel}
          />
        </div>

        <div className="space-y-16">
          {visibleCategories.map((cat) => {
            const startNum = categoryStartIndex[cat.category] ?? 0;
            return (
              <div key={cat.category}>
                <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-4">
                  <span
                    className="w-6 h-6 border-2 border-black"
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  {cat.category}
                </h2>

                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
                  {cat.elements.map((el, elIdx) => (
                    <div
                      key={el.name}
                      className={`aspect-square border-2 md:border-4 border-black bg-white relative p-1 md:p-2 flex flex-col justify-between hover:-translate-y-2 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group cursor-default`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] md:text-xs font-bold opacity-50">
                          {startNum + elIdx + 1}
                        </span>
                        <div
                          className="w-2 h-2 md:w-3 md:h-3 rounded-full border border-black opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ backgroundColor: cat.color }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <span className="block text-xl md:text-3xl lg:text-4xl font-black tracking-tighter">
                          {el.symbol}
                        </span>
                        <span className="text-[8px] md:text-xs font-bold uppercase mt-0.5 md:mt-1 block truncate">
                          {el.name}
                        </span>
                      </div>
                      <div className="text-[8px] md:text-[10px] font-mono opacity-40 uppercase text-right">
                        {cat.category.split(" ")[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 border-4 border-black bg-white p-8 text-center">
          <h3 className="text-2xl font-black uppercase mb-4">
            Ready to synthesize?
          </h3>
          <p className="font-bold mb-6">
            Combining these elements to build resilient, complex systems.
          </p>
          <a
            href="mailto:ms7306@columbia.edu"
            className="inline-block bg-black text-white px-8 py-4 font-bold uppercase text-lg hover:bg-[#facc15] hover:text-black transition-colors border-2 border-transparent hover:border-black"
          >
            Initiate Collaboration
          </a>
        </div>
      </div>
    </div>
  );
};

export default SkillsPageView;
