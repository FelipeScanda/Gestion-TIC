import prisma from "../config/prisma.js";

export const obtenerTodosPrestamosAdmin = async (req, res) => {
    try {
        const todos = await prisma.prestamo.findMany({
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

        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener todos los préstamos" });
    }
};

export const obtenerTodosPrestamosUser = async (req, res) => {
    try {
        const todos = await prisma.prestamo.findMany({
            where: {
                usuario_id: req.user.id
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

        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener todos los préstamos" });
    }
};

export const obtenerPrestamosPorUsuarioAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const prestamos = await prisma.prestamo.findMany({
            where: {
                usuario_id: Number(id)
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
