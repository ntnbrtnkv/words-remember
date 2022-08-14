import type { ReactElement, Ref, TextareaHTMLAttributes } from "react";
import React, { forwardRef } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
  children?: ReactElement;
};

function Textarea(
  { children, className, error, ...rest }: Props,
  ref: Ref<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...rest}
      ref={ref}
      className={`box-border rounded border border-gray py-2 px-4 focus:shadow-input focus:outline-none ${
        error ? "border-error focus:shadow-error" : ""
      } ${className}`}
    />
  );
}

export default forwardRef(Textarea);
