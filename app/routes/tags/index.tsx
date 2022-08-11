import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { Definition, Tag } from "@prisma/client";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { createTag, getAllTags } from "~/models/tag.server";
import { Form, useLoaderData } from "@remix-run/react";
import { getDefinitionsListItems } from "~/models/definition.server";
import { requireUserId } from "~/session.server";
import TagsMenu from "~/components/TagsMenu";
import Input from "~/components/Input";
import { Plus } from "~/icons/Plus";
import Button from "~/components/Button";

type LoaderData = {
  tags: Tag[];
  defs: Definition[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const tags = await getAllTags({ userId });
  const defs = await getDefinitionsListItems({ userId });

  return { tags, defs };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const tag = formData.get("tag");

  if (!tag || typeof tag === "object") {
    throw new Response("Tag name not valid", { status: 400 });
  }

  await createTag({
    name: tag,
    userId,
  });

  return null;
};

export default function AllTagsPage() {
  const { tags, defs } = useLoaderData() as LoaderData;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid h-full min-h-screen grid-flow-col grid-cols-6 bg-bgNeutral text-textMain">
        <TagsMenu tags={tags} defs={defs} />
        <main className="col-span-5 m-16 flex flex-col items-center">
          <h1 className="mb-8 text-3xl">Create new tag</h1>
          <Form method="post">
            <Input name="tag" autoFocus>
              <Button type="submit" appearance="primary">
                <Plus />
              </Button>
            </Input>
          </Form>
        </main>
      </div>
    </DndProvider>
  );
}
