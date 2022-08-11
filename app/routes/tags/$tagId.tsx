import type { ActionFunction, LoaderFunction } from "@remix-run/node";
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
import { useMemo, useState } from "react";
import Button from "~/components/Button";
import { Plus } from "~/icons/Plus";

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
      : currentTag?.definitions;

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

export default function TagPage() {
  const { tags, defs, currentDefs, currentTag } = useLoaderData() as LoaderData;
  const [search, setSearch] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const navigate = useNavigate();

  const shownDefs = useMemo(() => {
    return currentDefs.filter((def) => def.word.toLowerCase().includes(search));
  }, [currentDefs, search]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid h-full min-h-screen grid-flow-col grid-cols-6 bg-bgNeutral text-textMain">
        <TagsMenu tags={tags} defs={defs} />
        <main className="col-span-5 m-16 items-center space-y-6">
          <div className="flex justify-center space-x-4">
            <Input
              name="search"
              value={search}
              autoFocus
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button appearance={"primary"} onClick={() => setCreatingNew(true)}>
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

                setTimeout(() => {
                  navigate(".", { replace: true });
                }, 0);
              }}
              onCancel={() => setCreatingNew(false)}
            />
          )}
          {shownDefs.map((def) => (
            <DefinitionComponent key={def.id} tag={currentTag} def={def} />
          ))}
        </main>
      </div>
    </DndProvider>
  );
}