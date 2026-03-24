import prisma from "../config/prisma.js";

export const crearPrestamoUser = async (req, res) => {
    try {

        const { equipo_id, fecha_inicio, fecha_devolucion } = req.body;

        const usuario_id = req.user.id;

        if (!equipo_id || !fecha_inicio || !fecha_devolucion) {
            return res.status(400).json({
                message: "Faltan datos para crear la solicitud"
            });
        }

        // Validar solapamiento de horarios con préstamos aprobados
        const conflicto = await prisma.prestamo.findFirst({
            where: {
                equipo: {
                    id_equipo: Number(equipo_id)
                },
                estado_prestamo: "APROBADO",
                AND: [
                    {
                        fecha_inicio: {
                            lt: new Date(fecha_devolucion)
                        }
                    },
                    {
                        fecha_devolucion: {
                            gt: new Date(fecha_inicio)
                        }
                    }
                ]
            }
        });

        if (conflicto) {
            return res.status(400).json({
                message: "El equipo ya está reservado en ese horario"
            });
        }

        const prestamo = await prisma.prestamo.create({
            data: {
                usuario: {
                    connect: {
                        id_usuario: Number(usuario_id)
                    }
                },
                equipo: {
                    connect: {
                        id_equipo: Number(equipo_id)
                    }
                },
                fecha_inicio: new Date(fecha_inicio),
                fecha_devolucion: new Date(fecha_devolucion),
                estado_prestamo: "PENDIENTE"
            },
            select: {
                id_prestamo: true,
                estado_prestamo: true,
                fecha_inicio: true,
                fecha_devolucion: true,
                fecha_aprobacion: true,
                fecha_devuelto: true,
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

        if (req.io) {
            req.io.emit("prestamo_creado", prestamo);
        }

        res.status(201).json(prestamo);

    } catch (error) {
        console.error("Error creando préstamo:", error);

        res.status(500).json({
            message: "Error al crear la solicitud"
        });
    }
};

export const crearPrestamoAdmin = async (req, res) => {
    try {

        const { equipo_id, fecha_inicio, fecha_devolucion, usuario_id } = req.body;

        if (!equipo_id || !fecha_inicio || !fecha_devolucion || !usuario_id) {
            return res.status(400).json({
                message: "Faltan datos para crear la solicitud"
            });
        }

        // Validar solapamiento de horarios con préstamos aprobados
        const conflicto = await prisma.prestamo.findFirst({
            where: {
                equipo: {
                    id_equipo: Number(equipo_id)
                },
                estado_prestamo: "APROBADO",
                AND: [
                    {
                        fecha_inicio: {
                            lt: new Date(fecha_devolucion)
                        }
                    },
                    {
                        fecha_devolucion: {
                            gt: new Date(fecha_inicio)
                        }
                    }
                ]
            }
        });

        if (conflicto) {
            return res.status(400).json({
                message: "El equipo ya está reservado en ese horario"
            });
        }

        const prestamo = await prisma.prestamo.create({
            data: {
                usuario: {
                    connect: {
                        id_usuario: Number(usuario_id)
                    }
                },
                equipo: {
                    connect: {
                        id_equipo: Number(equipo_id)
                    }
                },
                fecha_inicio: new Date(fecha_inicio),
                fecha_devolucion: new Date(fecha_devolucion),
                fecha_aprobacion: new Date(),
                estado_prestamo: "APROBADO"
            },
            select: {
                id_prestamo: true,
                estado_prestamo: true,
                fecha_inicio: true,
                fecha_devolucion: true,
                fecha_aprobacion: true,
                fecha_devuelto: true,
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

        if (req.io) {
            req.io.emit("prestamo_creado", prestamo);
        }

        res.status(201).json(prestamo);

    } catch (error) {
        console.error("Error creando préstamo:", error);

        res.status(500).json({
            message: "Error al crear la solicitud"
        });
    }
};

export const marcarComoDevuelto = async (req, res) => {
    try {
        const { id } = req.params;

        const prestamo = await prisma.prestamo.update({
            where: {
                id_prestamo: Number(id)
            },
            data: {
                estado_prestamo: "DEVUELTO",
                fecha_devuelto: new Date()
            },
            select: {
                id_prestamo: true,
                estado_prestamo: true,
                fecha_inicio: true,
                fecha_devolucion: true,
                fecha_aprobacion: true,
                fecha_devuelto: true,
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

        req.io.emit("prestamo_actualizado", prestamo);

        res.json(prestamo);

    } catch (error) {
        console.error("Error devolviendo préstamo:", error);
        res.status(500).json({ error: "Error al devolver préstamo" });
    }
};