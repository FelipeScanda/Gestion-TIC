import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

export const obtenerUsuarios = async (req, res) => {
    try {

        const usuarios = await prisma.usuario.findMany({
            where: {
                rol_usuario: "USER"
            },
            select: {
                id_usuario: true,
                nombre: true
            }
        });

        res.json(usuarios);

    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
        res.status(500).json({
            error: "Error obteniendo usuarios"
        });
    }
};

export const obtenerTodosLosUsuarios = async (req, res) => {
    try {

        const usuarios = await prisma.usuario.findMany({
            select: {
                id_usuario: true,
                nombre: true,
                rut: true,
                email: true,
                rol_usuario: true,
                estado: true
            }
        });

        res.json(usuarios);

    } catch (error) {
        console.error("Error obteniendo todos los usuarios:", error);
        res.status(500).json({
            error: "Error obteniendo todos los usuarios"
        });
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const { nombre, rut, email, password, rol_usuario, estado } = req.body;

        if (!nombre || !rut || !email || !password) {
            return res.status(400).json({
                message: "Faltan campos obligatorios"
            });
        }

        const emailExistente = await prisma.usuario.findFirst({
            where: { email }
        });

        if (emailExistente) {
            return res.status(400).json({
                message: "El email ya está en uso"
            });
        }

        const rutExistente = await prisma.usuario.findFirst({
            where: { rut }
        });

        if (rutExistente) {
            return res.status(400).json({
                message: "El RUT ya está en uso"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                rut,
                email,
                password: hashedPassword,
                rol_usuario: rol_usuario || "USER",
                estado: estado || "ACTIVO"
            },
            select: {
                id_usuario: true,
                nombre: true,
                rut: true,
                email: true,
                rol_usuario: true,
                estado: true
            }
        });

        res.status(201).json(nuevoUsuario);

    } catch (error) {
        console.error("Error creando usuario:", error);
        res.status(500).json({
            message: "Error al crear el usuario"
        });
    }
};

export const cambiarPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "La contraseña es obligatoria"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.usuario.update({
            where: {
                id_usuario: Number(id)
            },
            data: {
                password: hashedPassword
            }
        });

        res.json({
            message: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        console.error("Error cambiando contraseña:", error);
        res.status(500).json({
            message: "Error al cambiar la contraseña"
        });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, rut, email, rol_usuario, estado } = req.body;

        // Validación básica
        if (!nombre || !rut || !email) {
            return res.status(400).json({
                message: "Nombre, RUT y email son obligatorios"
            });
        }

        // Verificar si otro usuario ya tiene ese email o rut
        const emailExistente = await prisma.usuario.findFirst({
            where: {
                email,
                NOT: {
                    id_usuario: Number(id)
                }
            }
        });

        if (emailExistente) {
            return res.status(400).json({
                message: "El email ya está en uso"
            });
        }

        const rutExistente = await prisma.usuario.findFirst({
            where: {
                rut,
                NOT: {
                    id_usuario: Number(id)
                }
            }
        });

        if (rutExistente) {
            return res.status(400).json({
                message: "El RUT ya está en uso"
            });
        }

        const usuarioActualizado = await prisma.usuario.update({
            where: {
                id_usuario: Number(id)
            },
            data: {
                nombre,
                rut,
                email,
                rol_usuario,
                estado
            },
            select: {
                id_usuario: true,
                nombre: true,
                rut: true,
                email: true,
                rol_usuario: true,
                estado: true
            }
        });

        res.json(usuarioActualizado);

    } catch (error) {
        console.error("Error actualizando usuario:", error);
        res.status(500).json({
            message: "Error al actualizar el usuario"
        });
    }
};