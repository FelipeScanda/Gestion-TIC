import { loginUser } from "../services/auth.service.js";

export const login = async (req, res) => {
    try {
        const { rut, password } = req.body;

        if(!rut || !password) {
            return res.status(400).json({
                message: "RUT y contraseña son obligatorios",
            })
        }

        const result = await loginUser(rut, password);
        return res.status(200).json(result);
    }
    catch (error){
        return res.status(401).json({
            message: error.message,
        })
    }
};