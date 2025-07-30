import React from "react";
import { textareaStyle } from "./textarea.css";

export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return <textarea {...props} className={props.className ? `${props.className} ${textareaStyle}` : textareaStyle} />
}
