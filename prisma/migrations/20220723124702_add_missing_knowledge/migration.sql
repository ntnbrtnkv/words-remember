INSERT INTO "Knowledge" ("definitionId", "userId")
SELECT def.id, def."userId"
FROM "Definition" def
         LEFT JOIN "Knowledge" k ON def.id = k."definitionId"
where k."id" IS NULL