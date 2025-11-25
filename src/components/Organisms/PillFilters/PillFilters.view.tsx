import React from "react";
import { PillFiltersViewProps, FilterOption } from "./PillFilters.interface";

export const PillFiltersView: React.FC<PillFiltersViewProps> = ({
  options,
  value,
  onChange,
  includeAll,
  allLabel,
  className,
  containerClassName,
  getButtonClassName,
}) => {
  return (
    <div className={className}>
      <div className={containerClassName} role="tablist" aria-label="Filters">
        {includeAll && (
          <button
            type="button"
            role="tab"
            aria-selected={value === allLabel}
            className={getButtonClassName(value === allLabel)}
            onClick={() => onChange(allLabel)}
          >
            {allLabel}
          </button>
        )}
        {options.map((opt: FilterOption) => {
          const active = value === opt.value;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={active}
              key={opt.value}
              className={getButtonClassName(active)}
              onClick={() => onChange(opt.value)}
              title={opt.label}
            >
              <span className="inline-flex items-center gap-2">
                {opt.color ? (
                  <span
                    aria-hidden
                    className="w-2 h-2 md:w-3 md:h-3 rounded-full border border-black"
                    style={{ backgroundColor: opt.color }}
                  />
                ) : null}
                <span>{opt.label}</span>
                {typeof opt.count === "number" ? (
                  <span className="opacity-60 font-mono">{opt.count}</span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PillFiltersView;
