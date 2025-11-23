"use client";

import Link from "next/link";
import React from "react";
import { ConditionLinkViewProps } from "./ConditionLink.interface";

const ConditionLinkView: React.FC<ConditionLinkViewProps> = ({
  children,
  link,
  rel = "",
  legacy = false,
  onClick = () => {},
  className = "",
  target = "_self",
  dataTooltipId: dataTooltipId = "data-tip",
  dataTooltipContent: dataTooltipContent,
}) => {
  return (
    <>
      {link ? (
        !legacy ? (
          <Link
            className={`text-inherit ${className}`}
            href={link}
            rel={rel}
            onClick={onClick}
            target={target}
            data-tooltip-id={dataTooltipId}
            data-tooltip-content={dataTooltipContent}
          >
            {children}
          </Link>
        ) : (
          <a
            className={className}
            href={link}
            onClick={onClick}
            rel={rel}
            target={target}
            data-tooltip-id={dataTooltipId}
            data-tooltip-content={dataTooltipContent}
          >
            {children}
          </a>
        )
      ) : (
        children
      )}
    </>
  );
};

export default ConditionLinkView;
