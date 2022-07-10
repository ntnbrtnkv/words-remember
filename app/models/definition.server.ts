import type { User, Definition } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Definition } from "@prisma/client";

export function getDefinition({
  id,
}: Pick<Definition, "id">) {
  return prisma.definition.findFirst({
    where: { id },
  });
}

export function getDefinitionsListItems({ userId }: { userId: User["id"] }) {
  return prisma.definition.findMany({
    where: {
      userID: userId
    },
    select: { id: true, word: true },
  });
}

export function createDefinition({
  word,
  description,
  userId,
}: Pick<Definition, "word" | "description"> & {
  userId: User["id"];
}) {
  return prisma.definition.create({
    data: {
      word,
      description,
      userID: userId
    },
  });
}

export function deleteDefinition({
  id,
}: Pick<Definition, "id"> & { userId: User["id"] }) {
  return prisma.definition.deleteMany({
    where: { id },
  });
}
