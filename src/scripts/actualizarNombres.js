import prisma from "../config/prisma.js";

const transformarNombre = (nombreCompleto) => {
  const partes = nombreCompleto.trim().split(/\s+/);

  if (partes.length < 3) return nombreCompleto;

  const apellido1 = partes[0];
  const apellido2 = partes[1];
  const nombres = partes.slice(2);

  return [...nombres, apellido1, apellido2].join(" ");
};

const main = async () => {
  const usuarios = await prisma.usuario.findMany();

  for (const user of usuarios) {
    const nuevoNombre = transformarNombre(user.nombre);

    await prisma.usuario.update({
      where: { id_usuario: user.id_usuario },
      data: { nombre: nuevoNombre }
    });

    console.log(`✔ ${user.nombre} → ${nuevoNombre}`);
  }
};

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());