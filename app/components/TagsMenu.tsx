import type { Definition, Tag } from "@prisma/client";
import { useFetcher, useLocation } from "@remix-run/react";
import type { RefAttributes } from "react";
import React, { useMemo } from "react";
import type { RemixLinkProps } from "@remix-run/react/dist/components";
import { useDrop } from "react-dnd";
import Link from "~/components/Link";

type Props = {
  tags: Tag[];
  defs: Definition[];
};

const TagLink = ({
  children,
  className,
  tag,
  accept = "",
  ...rest
}: RemixLinkProps &
  RefAttributes<HTMLAnchorElement> & {
    accept?: string;
    tag?: Tag;
  }) => {
  const fetcher = useFetcher();
  const { pathname } = useLocation();
  const active = useMemo(() => pathname === rest.to, [pathname, rest.to]);
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
      className={`block ${isOver ? "bg-primaryFocus" : ""} ${
        canDrop ? "outline-dashed outline-2 outline-textMain" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default function TagsMenu({ tags, defs }: Props) {
  const freeDefs = useMemo(() => {
    return defs.filter((def) => def.tags.length === 0);
  }, [defs]);

  return (
    <menu className="bg-bgAccent p-2 text-textMain shadow-sm">
      {freeDefs.length !== 0 && (
        <TagLink to={"/tags/free"}>
          Free definitions ({freeDefs.length})
        </TagLink>
      )}
      {tags.map((tag) => (
        <TagLink
          key={tag.id}
          tag={tag}
          accept="definition"
          to={`/tags/${tag.id}`}
        >
          {tag.name} ({tag.definitions.length})
        </TagLink>
      ))}
    </menu>
  );
}
