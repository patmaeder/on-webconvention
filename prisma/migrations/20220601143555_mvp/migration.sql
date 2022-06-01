-- CreateTable
CREATE TABLE "Speaker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "profileImage" TEXT,
    "description" TEXT,
    CONSTRAINT "Speaker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expo" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "description" TEXT,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "description" TEXT,
    "roomId" INTEGER,
    "expoId" INTEGER NOT NULL,
    CONSTRAINT "Event_expoId_fkey" FOREIGN KEY ("expoId") REFERENCES "Expo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Event_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "EventRoom" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventRoom" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "positionX" TEXT NOT NULL,
    "positionY" TEXT NOT NULL,
    "positionZ" TEXT NOT NULL,
    "expoId" INTEGER NOT NULL,
    CONSTRAINT "EventRoom_expoId_fkey" FOREIGN KEY ("expoId") REFERENCES "Expo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventToSpeaker" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventToSpeaker_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToSpeaker_B_fkey" FOREIGN KEY ("B") REFERENCES "Speaker" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Speaker_userId_key" ON "Speaker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_roomId_key" ON "Event"("roomId");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToSpeaker_AB_unique" ON "_EventToSpeaker"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToSpeaker_B_index" ON "_EventToSpeaker"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToUser_AB_unique" ON "_EventToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToUser_B_index" ON "_EventToUser"("B");
