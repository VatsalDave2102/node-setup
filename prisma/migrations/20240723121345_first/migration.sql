-- CreateEnum
CREATE TYPE "UPDATE_STATUS" AS ENUM ('IN_PROGRESS', 'SHIPPED', 'DEPRECATED');

-- CreateTable
CREATE TABLE "User" (
    "_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Product" (
    "_id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Update" (
    "_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "UPDATE_STATUS" NOT NULL DEFAULT 'IN_PROGRESS',
    "version" TEXT,
    "asset" TEXT,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "UpdatePoint" (
    "_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updateId" TEXT NOT NULL,

    CONSTRAINT "UpdatePoint_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Update" ADD CONSTRAINT "Update_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdatePoint" ADD CONSTRAINT "UpdatePoint_updateId_fkey" FOREIGN KEY ("updateId") REFERENCES "Update"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
