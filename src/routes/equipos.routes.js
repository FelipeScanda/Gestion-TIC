import { Router } from "express";
import { obtenerEquiposDisponibles, obtenerTodosLosEquipos, crearEquipo, actualizarEquipo, obtenerPrestamosPorEquipoAdmin } from "../controllers/equipos.controller.js";
import { authenticateToken, authAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

//Obtener equipos
router.get("/disponibles", authenticateToken, obtenerEquiposDisponibles);
router.get("/", authenticateToken, authAdmin, obtenerTodosLosEquipos);

//Obtener solicitues por un solo equipo
router.get("/admin/:id", authenticateToken, authAdmin, obtenerPrestamosPorEquipoAdmin);

//Crear equipos
router.post("/crear", authenticateToken, authAdmin, crearEquipo);

//Modificar equipos
router.put("/modificar/:id", authenticateToken, authAdmin, actualizarEquipo);

export default router;