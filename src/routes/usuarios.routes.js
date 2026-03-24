import express from "express";
import { obtenerUsuarios, obtenerTodosLosUsuarios, crearUsuario, cambiarPassword, actualizarUsuario } from "../controllers/usuarios.controller.js";
import { authenticateToken, authAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

//Obtener usuarios
router.get("/", authenticateToken, obtenerUsuarios);
router.get("/todos", authenticateToken, authAdmin, obtenerTodosLosUsuarios);

//Crear usuarios
router.post("/crear", authenticateToken, authAdmin, crearUsuario);

//Modificar usuarios
router.put("/password/:id", authenticateToken, authAdmin, cambiarPassword);
router.put("/modificar/:id", authenticateToken, authAdmin, actualizarUsuario);

export default router;