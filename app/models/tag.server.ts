import type { Tag, Definition } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Definition } from "@prisma/client";

export async function createTag(name: string) {
    return prisma.tag.create({
        data: {
            name
        }
    });
}

export async function createTags(names: string[]) {
    return await Promise.all(names.map(name => createTag(name)));
}

export async function getAllTags() {
    return prisma.tag.findMany();
}