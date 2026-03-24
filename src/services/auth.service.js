import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

//Login de usuario
export const loginUser = async (rut, password) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET no está definido en el entorno");
    }

    //Se busca el usuario por RUT en la DB
    const user = await prisma.usuario.findUnique({where: { rut }});

    if (!user){
        throw new Error("Usuario no Encontrado");
    }

    if(user.estado === "INACTIVO"){
        throw new Error("Usuario Inactivo")
    }

    //Se compara la contraseña ingresada en el login con la contraseña del usuario
    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) {
        throw new Error(("Credenciales Incorrectas"));
    }
    
    //Se genera el token del usuario
    const token = jwt.sign(
        {
            id: user.id_usuario,
            rol: user.rol_usuario,
        },
        JWT_SECRET
    );

    return {
        token,
        user: {
        id: user.id_usuario,
        nombre: user.nombre,
        rol: user.rol_usuario
        },
    };
};