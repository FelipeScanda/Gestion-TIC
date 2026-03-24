import prisma from "../config/prisma.js";

export const obtenerEquiposDisponibles = async (req, res) => {
    try {

        const equipos = await prisma.equipo.findMany({
            where: {
                estado: "DISPONIBLE"
            },
            select: {
                id_equipo: true,
                tipo: true,
                modelo: true,
                estado: true
            }
        });

        res.json(equipos);

    } catch (error) {
        console.error("Error obteniendo equipos:", error);
        res.status(500).json({
            message: "Error al obtener equipos disponibles"
        });
    }
};

export const obtenerTodosLosEquipos = async (req, res) => {
    try {

        const equipos = await prisma.equipo.findMany({
            select: {
                id_equipo: true,
                tipo: true,
                modelo: true,
                estado: true
            }
        });

        res.json(equipos);

    } catch (error) {
        console.error("Error obteniendo todos los equipos:", error);
        res.status(500).json({
            message: "Error al obtener los equipos"
        });
    }
};

export const crearEquipo = async (req, res) => {
    try {
    const { tipo, modelo, estado } = req.body;

    if (!tipo || !modelo || !estado) {
        return res.status(400).json({
        message: "Todos los campos son obligatorios"
        });
    }

    if (!["DISPONIBLE", "MANTENIMIENTO"].includes(estado)) {
        return res.status(400).json({
        message: "Estado inválido"
        });
    }

    const nuevoEquipo = await prisma.equipo.create({
        data: {
            tipo,
            modelo,
            estado
        }
    });

    return res.status(201).json(nuevoEquipo);

    } catch (error) {
    console.error("Error creando equipo:", error);
    return res.status(500).json({
        message: "Error interno del servidor"
    });
    }
};

export const actualizarEquipo = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo, modelo, estado } = req.body;

        if (!tipo || !modelo || !estado) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        if (!["DISPONIBLE", "MANTENIMIENTO"].includes(estado)) {
            return res.status(400).json({
                message: "Estado inválido"
            });
        }

        const equipoActualizado = await prisma.equipo.update({
            where: {
                id_equipo: Number(id)
            },
            data: {
                tipo,
                modelo,
                estado
            }
        });

        return res.json(equipoActualizado);

    } catch (error) {
        console.error("Error actualizando equipo:", error);
        return res.status(500).json({
            message: "Error al actualizar el equipo"
        });
    }
};

export const obtenerPrestamosPorEquipoAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const prestamos = await prisma.prestamo.findMany({
            where: {
                equipo_id: Number(id)
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

        res.json(prestamos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener préstamos del usuario" });
    }
};
