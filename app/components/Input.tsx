import type { InputHTMLAttributes, ReactElement } from "react";
import React from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  children?: ReactElement;
};

export default function Input({ children, type, className, ...rest }: Props) {
  const attached = !!children;

  return (
    <div className="flex items-stretch">
      <input
        {...rest}
        className={`${
          attached ? "rounded-l border-r-0" : "rounded"
        } box-border grow border border-gray py-2 px-4 focus:shadow-input focus:outline-none ${className}`}
      />
      {children && React.cloneElement(children, { attached })}
    </div>
  );
}
