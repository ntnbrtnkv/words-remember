-- CreateTable
CREATE TABLE "Knowledge" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "right" INTEGER NOT NULL DEFAULT 0,
    "wrong" INTEGER NOT NULL DEFAULT 0,
    "definitionId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Knowledge_definitionId_userId_idx" ON "Knowledge"("definitionId", "userId");

-- CreateIndex
CREATE INDEX "Definition_userId_idx" ON "Definition"("userId");

-- AddForeignKey
ALTER TABLE "Knowledge" ADD CONSTRAINT "Knowledge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Knowledge" ADD CONSTRAINT "Knowledge_definitionId_fkey" FOREIGN KEY ("definitionId") REFERENCES "Definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
