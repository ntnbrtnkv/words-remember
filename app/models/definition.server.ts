import type { Definition, User } from "@prisma/client";

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
    select: { id: true, word: true },
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

export function deleteDefinition({
  id,
}: Pick<Definition, "id"> & { userId: User["id"] }) {
  return prisma.definition.delete({
    where: { id },
  });
}

export function getTestDefinitions({ userId }: { userId: User["id"] }) {
  return prisma.$queryRaw<
    Definition[]
  >`select * from "Definition" where "userId" = cast(${userId} AS uuid) order by random() limit 3`;
}
