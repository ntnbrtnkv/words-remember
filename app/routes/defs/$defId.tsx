import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Definition } from "~/models/definition.server";
import { deleteDefinition } from "~/models/definition.server";
import { getDefinition } from "~/models/definition.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  def: Definition;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.defId, "defId not found");

  const def = await getDefinition({ id: params.defId });
  if (!def) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ def });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.defId, "defId not found");

  await deleteDefinition({ userId, id: params.defId });

  return redirect("/defs");
};

export default function DefsDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.def.word}</h3>
      <p className="py-6">{data.def.description}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Definition not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
