import type { Definition, Tag } from "@prisma/client";
import { Link, useFetcher, useLocation } from "@remix-run/react";
import type { RefAttributes } from "react";
import React, { useMemo } from "react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { useDrop } from "react-dnd";

type Props = {
  tags: Tag[];
  defs: Definition[];
};

const TagLink = ({
  children,
  className,
  active,
  tag,
  accept = "",
  ...rest
}: RemixLinkProps &
  RefAttributes<HTMLAnchorElement> & {
    active: boolean;
    accept?: string;
    tag?: Tag;
  }) => {
  const fetcher = useFetcher();
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: accept + (active ? "_not" : ""),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
      drop: (item: Definition) => {
        const form = new FormData();
        form.set("defId", item.id);
        form.set("tagId", String(tag?.id));

        fetcher.submit(form, {
          action: "/defs/set-tag",
          method: "patch",
        });
      },
    }),
    [tag, active]
  );

  return (
    <Link
      ref={drop}
      className={`mx-2 block rounded p-2 focus:outline-none ${
        active ? "cursor-default font-bold" : "hover:bg-focus focus:bg-focus"
      } ${isOver ? "bg-primaryFocus" : ""} ${
        canDrop ? "outline-dashed outline-2 outline-textMain" : ""
      } ${className}`}
      {...rest}
      tabIndex={active ? -1 : undefined}
      aria-disabled={active}
    >
      {children}
    </Link>
  );
};

export default function TagsMenu({ tags, defs }: Props) {
  const { pathname } = useLocation();

  const freeDefs = useMemo(() => {
    return defs.filter((def) => def.tags.length === 0);
  }, [defs]);

  return (
    <menu className="bg-bgAccent text-textMain shadow-sm">
      <TagLink className="m-4 text-xl" to="/tags" active={pathname === "/tags"}>
        Tags
      </TagLink>
      {freeDefs.length !== 0 && (
        <TagLink to={"/tags/free"} active={pathname === "/tags/free"}>
          Free definitions ({freeDefs.length})
        </TagLink>
      )}
      {tags.map((tag) => (
        <TagLink
          key={tag.id}
          tag={tag}
          accept="definition"
          to={`/tags/${tag.id}`}
          active={`/tags/${tag.id}` === pathname}
        >
          {tag.name} ({tag.definitions.length})
        </TagLink>
      ))}
    </menu>
  );
}
