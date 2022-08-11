import type { ReactElement, TextareaHTMLAttributes } from "react";
import React from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  children?: ReactElement;
};

export default function Textarea({ children, className, ...rest }: Props) {
  return (
    <textarea
      {...rest}
      className={`  box-border rounded border border-gray py-2 px-4 focus:shadow-input focus:outline-none ${className}`}
    />
  );
}
