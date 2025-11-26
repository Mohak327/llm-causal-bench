import React from "react";
import { ContentRendererProps } from "./ContentRenderer.interface";

const ContentRenderer: React.FC<ContentRendererProps> = ({ sections }) => {
  return (
    <div className="space-y-8">
      {sections.map((section, index) => (
        <div key={index}>
          <h2 className="text-2xl font-bold uppercase border-b-4 border-black inline-block mb-4">
            {section.heading}
          </h2>
          <div className="space-y-6">
            {section.content.map((item, idx) => {
              switch (item.type) {
                case "paragraph":
                  return (
                    <p
                      key={idx}
                      className="font-medium text-md"
                    >
                      {item.data as string}
                    </p>
                  );
                case "list":
                  return (
                    <ul key={idx} className="list-disc list-inside space-y-2">
                      {(item.data as string[]).map((listItem, listIdx) => (
                        <li key={listIdx} className="font-medium text-md">
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  );
                case "ordered-list":
                  return (
                    <ol
                      key={idx}
                      className="list-decimal list-inside space-y-2"
                    >
                      {(item.data as string[]).map((listItem, listIdx) => (
                        <li key={listIdx} className="flex items-start gap-3">
                          <span className="bg-black text-white font-bold w-6 h-6 flex items-center justify-center text-sm mt-1 shrink-0">
                            {listIdx + 1}
                          </span>
                          <span className="font-medium text-md">
                            {listItem}
                          </span>
                        </li>
                      ))}
                    </ol>
                  );
                default:
                  return null;
              }
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentRenderer;
