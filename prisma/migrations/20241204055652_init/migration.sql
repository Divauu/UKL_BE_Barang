/*
  Warnings:

  - You are about to drop the `pengembalian` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pengembalian` DROP FOREIGN KEY `pengembalian_borrow_id_fkey`;

-- AlterTable
ALTER TABLE `peminjaman` ADD COLUMN `actual_return_date` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `pengembalian`;
