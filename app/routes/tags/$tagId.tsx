import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import type { Definition, Tag } from "@prisma/client";

import { createTag, getAllTags } from "~/models/tag.server";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import TagsMenu from "~/components/TagsMenu";
import DefinitionComponent from "~/components/Definition";
import { getDefinitionsListItems } from "~/models/definition.server";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Input from "~/components/Input";
import { useEffect, useMemo, useRef, useState } from "react";
import Button from "~/components/Button";
import { Plus } from "~/icons/Plus";
import InsidePage from "~/components/InsidePage";

type LoaderData = {
  tags: Tag[];
  currentTag: Tag;
  defs: Definition[];
  currentDefs: Definition[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const tagId = params.tagId;

  const tags = await getAllTags({ userId });
  const currentTag = tags.find((tag) => tag.id === tagId);

  const defs = await getDefinitionsListItems({ userId });

  const currentDefs =
    tagId === "free"
      ? defs.filter((def) => def.tags.length === 0)
      : defs.filter((def) => def.tags.some((tag) => tag.id === currentTag?.id));

  return { tags, currentTag, defs, currentDefs };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const tag = formData.get("tag");

  if (typeof tag === "object") {
    throw new Response("Tag name not valid", { status: 400 });
  }

  await createTag({
    name: tag,
    userId,
  });

  return null;
};

export const meta: MetaFunction = ({ data }: { data?: LoaderData }) => {
  return {
    title: `"${data?.currentTag?.name}" tag`,
  };
};

export default function TagPage() {
  const { tags, defs, currentDefs, currentTag } = useLoaderData() as LoaderData;
  const [search, setSearch] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!creatingNew) {
      setSearch("");
      searchRef.current?.focus();
    }
  }, [creatingNew]);

  const shownDefs = useMemo(() => {
    return currentDefs.filter((def) => def.word.toLowerCase().includes(search));
  }, [currentDefs, search]);

  return (
    <InsidePage>
      <DndProvider backend={HTML5Backend}>
        <div className="grid min-h-full grow grid-flow-col grid-cols-menu-content">
          <TagsMenu tags={tags} defs={defs} />
          <main className="m-16 items-center space-y-6">
            <h1 className="text-center text-3xl font-bold uppercase">
              Search & Add
            </h1>
            <div className="flex justify-center space-x-4">
              <Input
                name="search"
                ref={searchRef}
                value={search}
                autoFocus
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button
                appearance={"primary"}
                onClick={() => setCreatingNew(true)}
              >
                <Plus />
              </Button>
            </div>
            {creatingNew && (
              <DefinitionComponent
                def={{
                  id: "",
                  word: search,
                  description: "",
                  userId: "",
                }}
                tag={currentTag}
                isNew
                onSuccess={() => {
                  setCreatingNew(false);
                  navigate(".", { replace: true });
                }}
                onCancel={() => setCreatingNew(false)}
              />
            )}
            {shownDefs.map((def) => (
              <DefinitionComponent
                key={def.id}
                tag={currentTag}
                def={def}
                knowledge={(def as any).Knowledge[0]}
              />
            ))}
          </main>
        </div>
      </DndProvider>
    </InsidePage>
  );
}
