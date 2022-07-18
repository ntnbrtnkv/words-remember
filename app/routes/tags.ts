import type { LoaderFunction } from "@remix-run/node";

import {getAllTags, createTags} from "~/models/tag.server";
import {ActionFunction, json} from "@remix-run/node";

export const loader: LoaderFunction = async () => {
    let tags = await getAllTags();
    return tags;
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const tags = formData.get('tags');

    if (!tags || typeof tags === "object") {
        throw new Response("Tags name not valid", { status: 400 });
    }

    let tagsArray = tags.split(',');

    if (typeof tagsArray === 'string') {
        tagsArray = [tags];
    }

    const allTags = (await getAllTags()).map(tag => tag.name);

    const tagsToAdd = tagsArray.filter(tag => tag && !allTags.includes(tag));

    await createTags(tagsToAdd);

    return getAllTags();
}