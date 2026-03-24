/*
  Warnings:

  - You are about to drop the column `Modelo` on the `equipos` table. All the data in the column will be lost.
  - Added the required column `modelo` to the `equipos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_equipos" (
    "id_equipo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "estado" TEXT NOT NULL
);
INSERT INTO "new_equipos" ("estado", "id_equipo", "tipo") SELECT "estado", "id_equipo", "tipo" FROM "equipos";
DROP TABLE "equipos";
ALTER TABLE "new_equipos" RENAME TO "equipos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
