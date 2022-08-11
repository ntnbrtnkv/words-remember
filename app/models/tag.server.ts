import { prisma } from "~/db.server";
import type { Tag } from "@prisma/client";

export async function createTag({ name, userId }: Omit<Tag, "id">) {
  return prisma.tag.create({
    data: {
      name,
      userId,
    },
  });
}

export async function getAllTags({ userId }: Pick<Tag, "userId">) {
  return prisma.tag.findMany({
    where: {
      userId,
    },
    include: {
      definitions: true,
    },
  });
}
