import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { createDefinition, setTag } from "~/models/definition.server";
import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {
    word?: string;
    description?: string;
    tagId?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const word = formData.get("word");
  const description = formData.get("description");
  const tagId = formData.get("tagId");

  if (typeof word !== "string" || word.length === 0) {
    return json<ActionData>(
      { errors: { word: "Word is required" } },
      { status: 400 }
    );
  }

  if (typeof description !== "string" || description.length === 0) {
    return json<ActionData>(
      { errors: { description: "Description is required" } },
      { status: 400 }
    );
  }

  if (typeof tagId !== "string" || tagId.length === 0) {
    return json<ActionData>(
      { errors: { tagId: "tagId is required" } },
      { status: 400 }
    );
  }

  let def;

  if (request.method === "POST") {
    def = await createDefinition({ word, description, userId });

    await setTag({ tagId, definitionId: def.id });
  }

  return def;
};
