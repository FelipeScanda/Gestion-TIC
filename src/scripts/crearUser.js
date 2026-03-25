import fs from "fs";
import csv from "csv-parser";
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

const resultados = [];

// Limpia acentos y pasa a minúscula
const limpiar = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Genera email: nombre.apellido@dominio.com
const generarEmail = (nombreCompleto) => {
  const partes = nombreCompleto.trim().split(/\s+/);

  if (partes.length < 3) {
    throw new Error(`Formato inválido: ${nombreCompleto}`);
  }

  const apellido1 = limpiar(partes[0]);
  const nombre1 = limpiar(partes[2]);

  return `${nombre1}.${apellido1}@apssanvicente.cl`;
};

// Leer CSV
fs.createReadStream("usuarios.csv")
  .pipe(csv({
    separator: ';',
    mapHeaders: ({ header }) =>
      header.replace(/^\uFEFF/, "").trim()
  }))
  .on("data", (data) => resultados.push(data))
  .on("end", async () => {
    try {
      const hashedPassword = await bcrypt.hash("Cesfam2026", 10);

      for (const user of resultados) {
        try {
          const nombreCompleto = user.nombre_completo?.trim();
          const rut = user.rut?.trim();

          if (!nombreCompleto || !rut) {
            console.log("Fila inválida:", user);
            continue;
          }

          const email = generarEmail(nombreCompleto);

          // evitar duplicados por email
          const existe = await prisma.usuario.findUnique({
            where: { rut }
          });

          if (existe) {
            console.log(`Usuario ya existe: ${email} ${rut}`);
            continue;
          }

          await prisma.usuario.create({
            data: {
              nombre: nombreCompleto,
              rut: rut,
              email: email,
              password: hashedPassword,
              rol_usuario: "USER",
              estado: "ACTIVO"
            }
          });

          console.log(`Usuario creado: ${email}`);

        } catch (errorInterno) {
          console.error("Error con usuario:", user, errorInterno.message);
        }
      }

      console.log("Importación finalizada");

    } catch (error) {
      console.error("Error general:", error);
    } finally {
      await prisma.$disconnect();
    }
  });