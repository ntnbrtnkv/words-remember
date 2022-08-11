import type { ActionFunction } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { setTag } from "~/models/definition.server";

export const action: ActionFunction = async ({ request }) => {
  await requireUserId(request);

  const formData = await request.formData();
  const tagId = String(formData.get("tagId"));
  const definitionId = String(formData.get("defId"));

  return await setTag({ definitionId, tagId });
};
