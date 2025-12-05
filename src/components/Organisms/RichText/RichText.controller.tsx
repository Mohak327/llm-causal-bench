import React, { ReactElement } from "react";
import RichTextView from "./RichText.view";
import { RichTextProps } from "./RichText.interface";
import { Node, ElementNode } from "./RichText.interface";
import { OPEN_TAGS } from "./RichText.model";

const parseToNodes = (text: string): Node[] => {
  const root: ElementNode = { type: "root", children: [] };
  const stack: ElementNode[] = [root];
  let buffer = "";

  const flushText = () => {
    if (!buffer) return;
    stack[stack.length - 1].children.push({ type: "text", value: buffer });
    buffer = "";
  };

  const tryMatch = (substr: string, index: number): string | null => {
    return text.startsWith(substr, index) ? substr : null;
  };

  for (let i = 0; i < text.length; ) {
    const openMatch =
      tryMatch("<b>", i) ||
      tryMatch("<i>", i) ||
      tryMatch("<span class='highlight'>", i);

    if (openMatch) {
      flushText();
      const node: ElementNode = {
        type: OPEN_TAGS[openMatch as keyof typeof OPEN_TAGS],
        children: [],
      };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
      i += openMatch.length;
      continue;
    }

    const closeMatch =
      tryMatch("</b>", i) || tryMatch("</i>", i) || tryMatch("</span>", i);

    if (closeMatch) {
      flushText();
      if (stack.length > 1) stack.pop();
      i += closeMatch.length;
      continue;
    }

    buffer += text[i++];
  }

  flushText();
  return root.children;
};

const renderNodes = (nodes: Node[], keyPrefix = ""): ReactElement[] =>
  nodes.map((node, index) => {
    const key = `${keyPrefix}${index}`;

    if (node.type === "text") {
      return <span key={key}>{node.value}</span>;
    }

    const children = renderNodes(node.children, `${key}-`);

    switch (node.type) {
      case "b":
        return <b key={key}>{children}</b>;
      case "i":
        return <i key={key}>{children}</i>;
      case "highlight":
        return (
          <span key={key} className="bg-yellow-200 px-1 rounded">
            {children}
          </span>
        );
      default:
        return <React.Fragment key={key}>{children}</React.Fragment>;
    }
  });

const RichTextController: React.FC<RichTextProps> = ({ text }) => {
  const parsedText = renderNodes(parseToNodes(text));
  return <RichTextView parsedText={parsedText} />;
};

export default RichTextController;
