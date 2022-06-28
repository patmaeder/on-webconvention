/*
  Warnings:

  - Made the column `roomId` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "description" TEXT,
    "roomId" INTEGER NOT NULL,
    "expoId" INTEGER NOT NULL,
    CONSTRAINT "Event_expoId_fkey" FOREIGN KEY ("expoId") REFERENCES "Expo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "EventRoom" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("description", "endDate", "expoId", "id", "name", "roomId", "startDate") SELECT "description", "endDate", "expoId", "id", "name", "roomId", "startDate" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
