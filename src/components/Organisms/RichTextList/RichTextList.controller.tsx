import React, { ReactElement } from "react";
import RichTextView from "./RichTextList.view";
import { RichTextProps } from "./RichTextList.interface";

const parseText = (text: string): ReactElement[] => {
  const elements: ReactElement[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|__.*?__|\n)/g;
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      elements.push(
        <span key={keyCounter++}>{text.slice(lastIndex, match.index)}</span>
      );
    }

    const matched = match[0];
    if (matched.startsWith("**") && matched.endsWith("**")) {
      const content = matched.slice(2, -2);
      elements.push(<strong key={keyCounter++}>{content}</strong>);
    } else if (
      matched.startsWith("*") &&
      matched.endsWith("*") &&
      !matched.startsWith("**")
    ) {
      const content = matched.slice(1, -1);
      elements.push(<em key={keyCounter++}>{content}</em>);
    } else if (matched.startsWith("__") && matched.endsWith("__")) {
      const content = matched.slice(2, -2);
      elements.push(
        <span key={keyCounter++} className="bg-yellow-200 px-1 rounded">
          {content}
        </span>
      );
    } else if (matched === "\n") {
      elements.push(<br key={keyCounter++} />);
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(<span key={keyCounter++}>{text.slice(lastIndex)}</span>);
  }

  return elements;
};

const RichTextController: React.FC<RichTextProps> = ({ text }) => {
    console.log("text", text)
  const parsedText = parseText(text);
  return <RichTextView parsedText={parsedText} />;
};

export default RichTextController;