import type { InputHTMLAttributes, ReactElement, Ref } from "react";
import React, { forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactElement;
};

function Input(
  { children, type, className, ...rest }: Props,
  ref: Ref<HTMLInputElement>
) {
  const attached = !!children;

  return (
    <div className="flex items-stretch">
      <input
        {...rest}
        ref={ref}
        className={`${
          attached ? "rounded-l border-r-0" : "rounded"
        } box-border grow border border-gray py-2 px-4 focus:shadow-input focus:outline-none ${className}`}
      />
      {children && React.cloneElement(children, { attached })}
    </div>
  );
}

export default forwardRef(Input);
