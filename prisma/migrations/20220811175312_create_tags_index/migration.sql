-- DropIndex
DROP INDEX "Tag_name_key";

-- CreateIndex
CREATE INDEX "Tag_name_userId_idx" ON "Tag"("name", "userId");
