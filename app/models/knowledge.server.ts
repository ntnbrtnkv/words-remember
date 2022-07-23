import type { Knowledge } from "@prisma/client";

import { prisma } from "~/db.server";

export function createKnowledge(
  data: Pick<Knowledge, "userId" | "definitionId">
) {
  return prisma.knowledge.create({
    data,
  });
}

export async function changeKnowledge({
  definitionId,
  userId,
  change,
}: {
  definitionId: Knowledge["definitionId"];
  userId: Knowledge["userId"];
  change: -1 | 1;
}) {
  if (change === 1) {
    await prisma.$queryRaw`update "Knowledge" set "right" = "right" + 1 where "userId" = cast(${userId} AS uuid) and "definitionId" = cast(${definitionId} AS uuid)`;
  } else if (change === -1) {
    await prisma.$queryRaw`update "Knowledge" set "wrong" = "wrong" + 1 where "userId" = cast(${userId} AS uuid) and "definitionId" = cast(${definitionId} AS uuid)`;
  }
}

export function getKnowledges({
  definitionId,
  userId,
}: {
  definitionId?: Knowledge["definitionId"];
  userId: Knowledge["userId"];
}) {
  return prisma.knowledge.findMany({
    where: { userId, definitionId },
  });
}
