/*
  Warnings:

  - You are about to drop the column `RUT` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `contraseña` on the `usuarios` table. All the data in the column will be lost.
  - Added the required column `password` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rut` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuarios" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol_usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "rut" TEXT NOT NULL
);
INSERT INTO "new_usuarios" ("email", "estado", "id_usuario", "nombre", "rol_usuario") SELECT "email", "estado", "id_usuario", "nombre", "rol_usuario" FROM "usuarios";
DROP TABLE "usuarios";
ALTER TABLE "new_usuarios" RENAME TO "usuarios";
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");
CREATE UNIQUE INDEX "usuarios_rut_key" ON "usuarios"("rut");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
