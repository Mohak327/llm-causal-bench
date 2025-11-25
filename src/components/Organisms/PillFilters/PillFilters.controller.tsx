"use client";
import React from "react";
import { PillFiltersView } from "./PillFilters.view";
import { PillFiltersProps } from "./PillFilters.interface";
import { sizeMap, SizeKey } from "./PillFilters.model";

const getSizeTokens = (size: SizeKey) => sizeMap[size];

const containerClass = (size: SizeKey, rounded: boolean) => {
  const s = getSizeTokens(size);
  return `flex flex-wrap ${s.gap} p-1 ${rounded ? "rounded-full" : ""}`;
};

const buttonClass = (size: SizeKey, active: boolean) => {
  const s = getSizeTokens(size);
  return (
    `${s.padX} ${s.padY} font-bold uppercase border-2 border-black transition-all whitespace-nowrap ` +
    (active
      ? "bg-black text-white"
      : "bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]")
  );
};

export const PillFilters: React.FC<PillFiltersProps> = ({
  options,
  value,
  onChange,
  includeAll = true,
  allLabel = "All",
  className = "",
  size = "md",
  rounded = false,
}) => {
  const containerClassName = containerClass(size, rounded);
  const getButtonClassName = (active: boolean) => buttonClass(size, active);

  return (
    <PillFiltersView
      options={options}
      value={value}
      onChange={onChange}
      includeAll={includeAll}
      allLabel={allLabel}
      className={className}
      containerClassName={containerClassName}
      getButtonClassName={getButtonClassName}
    />
  );
};

export default PillFilters;
