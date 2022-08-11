import type { ButtonHTMLAttributes, Ref } from "react";
import React, { forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance: "primary" | "secondary" | "outlined";
  attached?: boolean;
};

function Button(
  { children, appearance, className, attached = false, ...rest }: Props,
  ref: Ref<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
      {...rest}
      className={`${attached ? "rounded-r" : "rounded"} ${
        appearance === "primary" &&
        "bg-primary px-4 text-textPrimary hover:bg-primaryFocus focus:bg-primaryFocus"
      } ${
        appearance === "secondary" &&
        "px-2 text-secondary outline outline-2 outline-secondary focus:bg-secondaryFocus"
      } ${
        appearance === "outlined" &&
        "px-2 text-secondary focus:bg-secondaryFocus"
      } py-2 font-bold uppercase focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}

export default forwardRef(Button);