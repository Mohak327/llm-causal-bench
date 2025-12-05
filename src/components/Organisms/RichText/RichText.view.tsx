import React from "react";
import { RichTextViewProps } from "./RichText.interface";

const RichTextView: React.FC<RichTextViewProps> = ({ parsedText }) => {
  return <>{parsedText}</>;
};

export default RichTextView;