import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

const run = async () => {
  try {
    const nombre = "User 2";
    const rut = "33333333-3";
    const email = "user2@mail.com";
    const plainPassword = "user123";
    const rol_usuario = "USER";

    const password = await bcrypt.hash(plainPassword, 10);

    const user = await prisma.usuario.create({
      data: {
        nombre,
        rut,
        email,
        password: password,
        rol_usuario,
        estado: "ACTIVO",
      },
    });

    console.log("Usuario creado correctamente:");
    console.log(user);
  } catch (error) {
    console.error("Error creando usuario:", error.message);
  } finally {
    await prisma.$disconnect();
  }
};

run();