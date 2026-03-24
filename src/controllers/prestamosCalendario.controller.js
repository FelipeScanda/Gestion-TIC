import prisma from "../config/prisma.js";

export const obtenerPrestamosAprobadosAdmin = async (req, res) => {
    try {

        const aprobados = await prisma.prestamo.findMany({
            where: {
                estado_prestamo: "APROBADO"
            },
            include: {
                usuario: {
                    select: {
                        id_usuario: true,
                        nombre: true,
                        rol_usuario: true
                    }
                },
                equipo: {
                    select: {
                        id_equipo: true,
                        tipo: true,
                        modelo: true
                    }
                }
            },
            orderBy: { id_prestamo: "desc" }
        });

        res.json(aprobados);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los préstamos del usuario" });
    }
};

export const obtenerPrestamosAprobadosUser = async (req, res) => {
    try {

        const aprobados = await prisma.prestamo.findMany({
            where: {
                estado_prestamo: "APROBADO"
            },
            include: {
                equipo: {
                    select: {
                        id_equipo: true,
                        tipo: true,
                        modelo: true
                    }
                }
            },
            orderBy: { id_prestamo: "desc" }
        });

        res.json(aprobados);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los préstamos del usuario" });
    }
};