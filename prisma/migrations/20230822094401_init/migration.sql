-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "refresh_token_expires_in" INTEGER;

-- CreateTable
CREATE TABLE "Calendar" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeEvent" (
    "EventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationM" INTEGER NOT NULL,
    "StartTime" TIMESTAMP(3) NOT NULL,
    "EndTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeEvent_pkey" PRIMARY KEY ("EventId")
);

-- CreateTable
CREATE TABLE "dayEvent" (
    "EventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dayEvent_pkey" PRIMARY KEY ("EventId")
);

-- AddForeignKey
ALTER TABLE "timeEvent" ADD CONSTRAINT "timeEvent_EventId_fkey" FOREIGN KEY ("EventId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dayEvent" ADD CONSTRAINT "dayEvent_EventId_fkey" FOREIGN KEY ("EventId") REFERENCES "Calendar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
