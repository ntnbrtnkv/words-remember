import type { Definition, Tag, User } from "@prisma/client";

import { prisma } from "~/db.server";
import { createKnowledge } from "~/models/knowledge.server";

export type { Definition } from "@prisma/client";

export function getDefinition({ id }: Pick<Definition, "id">) {
  return prisma.definition.findFirst({
    where: { id },
  });
}

export function getDefinitionsListItems({ userId }: { userId: User["id"] }) {
  return prisma.definition.findMany({
    where: {
      userId,
    },
    include: {
      tags: true,
    },
  });
}

export async function createDefinition({
  word,
  description,
  userId,
}: Pick<Definition, "word" | "description"> & {
  userId: User["id"];
}) {
  const def = await prisma.definition.create({
    data: {
      word,
      description,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  await createKnowledge({
    userId,
    definitionId: def.id,
  });

  return def;
}

export function updateDefinition({
  word,
  description,
  id,
  userId,
}: Pick<Definition, "word" | "description" | "id"> & {
  userId: User["id"];
}) {
  return prisma.definition.update({
    data: {
      word,
      description,
    },
    where: {
      id,
    },
  });
}

export function deleteDefinition({
  id,
}: Pick<Definition, "id"> & { userId: User["id"] }) {
  return prisma.definition.delete({
    where: { id },
  });
}

export function setTag({
  definitionId,
  tagId,
}: {
  definitionId: Definition["id"];
  tagId: Tag["id"];
}) {
  return prisma.definition.update({
    where: {
      id: definitionId,
    },
    data: {
      tags: {
        set: [
          {
            id: tagId,
          },
        ],
      },
    },
  });
}

export function getTestDefinitions({ userId }: { userId: User["id"] }) {
  return prisma.$queryRaw<
    Definition[]
  >`select * from "Definition" where "userId" = cast(${userId} AS uuid) order by random() limit 3`;
}
