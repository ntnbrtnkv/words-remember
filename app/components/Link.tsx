import type { ForwardRefRenderFunction } from "react";
import React, { forwardRef } from "react";
import { Link as RemixLink, useLocation } from "@remix-run/react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";

type Props = RemixLinkProps;

const Link: ForwardRefRenderFunction<HTMLAnchorElement, Props> = (
  { className, ...props },
  ref
) => {
  const { pathname } = useLocation();

  const active = pathname === props.to;

  return (
    <RemixLink
      ref={ref}
      className={`rounded p-2 font-bold opacity-80 focus:outline-none ${
        active
          ? "cursor-default opacity-60"
          : "focus:outline-bold hover:opacity-100 focus:opacity-100 focus:outline focus:outline-2 focus:outline-textMain"
      } ${className}`}
      tabIndex={active ? -1 : undefined}
      aria-disabled={active}
      {...props}
    />
  );
};

export default forwardRef(Link);
