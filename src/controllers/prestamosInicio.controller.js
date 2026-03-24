import prisma from "../config/prisma.js";
import { io } from "../app.js";

export const obtenerPrestamosInicioAdmin = async (req, res) => {
    try {

        const prestamos = await prisma.prestamo.findMany({
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

        const pendientes = prestamos.filter(p => p.estado_prestamo === "PENDIENTE");
        const aprobados = prestamos.filter(p => p.estado_prestamo === "APROBADO");

        res.json({ pendientes, aprobados });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los préstamos del usuario" });
    }
};

export const obtenerPrestamosInicioUser = async (req, res) => {
    try {

        const prestamos = await prisma.prestamo.findMany({
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

        const pendientes = prestamos.filter(p => p.estado_prestamo === "PENDIENTE");
        const aprobados = prestamos.filter(p => p.estado_prestamo === "APROBADO");

        res.json({ pendientes, aprobados });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener los préstamos del usuario" });
    }
};

export const aprobarPrestamo = async (req, res) => {
    try{
        const { id } = req.params;

        const prestamo = await prisma.prestamo.update({
            where: {
                id_prestamo: Number(id)
            },
            data: {
                estado_prestamo: "APROBADO",
                fecha_aprobacion: new Date()
            },
            include: {
                usuario: {
                    select: {
                        id_usuario: true,
                        nombre: true
                    }
                },
                equipo: {
                    select: {
                        id_equipo: true,
                        tipo: true,
                        modelo: true
                    }
                }
            }
        });

        io.emit("prestamo_actualizado", prestamo);

        res.json(prestamo);
    }
    catch (error){
        console.error(error);
        res.status(500).json({message: "Error al aprobar solicitud"});
    }
};

export const rechazarPrestamo = async (req, res) => {
    try{
        const { id } = req.params;

        const prestamo = await prisma.prestamo.update({
            where: {
                id_prestamo: Number(id)
            },
            data: {
                estado_prestamo: "RECHAZADO",
                fecha_aprobacion: new Date()
            },
            include: {
                usuario: {
                    select: {
                        id_usuario: true,
                        nombre: true
                    }
                },
                equipo: {
                    select: {
                        id_equipo: true,
                        tipo: true,
                        modelo: true
                    }
                }
            }
        });

        io.emit("prestamo_actualizado", prestamo);

        res.json(prestamo);
    }
    catch (error){
        console.error(error);
        res.status(500).json({message: "Error al aprobar solicitud"});
    }
};

export const cancelarPrestamo = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar préstamo
        const prestamo = await prisma.prestamo.findUnique({
            where: {
                id_prestamo: Number(id)
            }
        });

        if (!prestamo) {
            return res.status(404).json({ message: "Préstamo no encontrado" });
        }

        // Validar que pertenece al usuario
        if (prestamo.usuario_id !== req.user.id) {
            return res.status(403).json({ message: "No autorizado para cancelar este préstamo" });
        }

        // Validar que esté en estado pendiente
        if (prestamo.estado_prestamo !== "PENDIENTE") {
            return res.status(400).json({ message: "Solo se pueden cancelar solicitudes pendientes" });
        }

        const prestamoActualizado = await prisma.prestamo.update({
            where: {
                id_prestamo: Number(id)
            },
            data: {
                estado_prestamo: "CANCELADO"
            },
            include: {
                usuario: {
                    select: {
                        id_usuario: true,
                        nombre: true
                    }
                },
                equipo: {
                    select: {
                        id_equipo: true,
                        tipo: true,
                        modelo: true
                    }
                }
            }
        });

        // Emitir evento socket
        io.emit("prestamo_actualizado", prestamoActualizado);

        res.json(prestamoActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cancelar la solicitud" });
    }
};

export const cancelarPrestamoAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const prestamo = await prisma.prestamo.findUnique({
            where: {
                id_prestamo: Number(id)
            }
        });

        if (!prestamo) {
            return res.status(404).json({ message: "Préstamo no encontrado" });
        }

        // Permitir cancelar si está PENDIENTE o APROBADO
        if (prestamo.estado_prestamo !== "PENDIENTE" && prestamo.estado_prestamo !== "APROBADO") {
            return res.status(400).json({ message: "No se puede cancelar este préstamo" });
        }

        const prestamoActualizado = await prisma.prestamo.update({
            where: {
                id_prestamo: Number(id)
            },
            data: {
                estado_prestamo: "CANCELADO"
            },
            include: {
                usuario: {
                    select: {
                        id_usuario: true,
                        nombre: true
                    }
                },
                equipo: {
                    select: {
                        id_equipo: true,
                        tipo: true,
                        modelo: true
                    }
                }
            }
        });

        io.emit("prestamo_actualizado", prestamoActualizado);

        res.json(prestamoActualizado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cancelar la solicitud (admin)" });
    }
};
