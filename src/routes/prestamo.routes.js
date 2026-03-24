import { Router } from "express";
import { obtenerPrestamosInicioAdmin, obtenerPrestamosInicioUser, aprobarPrestamo, rechazarPrestamo, cancelarPrestamo, cancelarPrestamoAdmin } from "../controllers/prestamosInicio.controller.js";
import { obtenerTodosPrestamosAdmin, obtenerTodosPrestamosUser, obtenerPrestamosPorUsuarioAdmin } from "../controllers/prestamosTodos.controller.js";
import { crearPrestamoUser, crearPrestamoAdmin, marcarComoDevuelto } from "../controllers/prestamos.controller.js";
import { obtenerPrestamosAprobadosAdmin, obtenerPrestamosAprobadosUser } from "../controllers/prestamosCalendario.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { authAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

//Obtener solicitudes para admin
router.get("/admin", authenticateToken, authAdmin, obtenerPrestamosInicioAdmin);
router.get("/admin/todos", authenticateToken, authAdmin, obtenerTodosPrestamosAdmin);

//Obtener solicitudes para usuario
router.get("/user", authenticateToken, obtenerPrestamosInicioUser);
router.get("/user/todos", authenticateToken, obtenerTodosPrestamosUser);

//Obtener solicitues por un solo usuario
router.get("/admin/usuarios/:id", authenticateToken, authAdmin, obtenerPrestamosPorUsuarioAdmin);

//Aprobar y rechazar solicitudes
router.patch("/:id/aprobar", authenticateToken, authAdmin, aprobarPrestamo);
router.patch("/:id/rechazar", authenticateToken, authAdmin, rechazarPrestamo);

//Crear prestamos
router.post("/user/crear-prestamo", authenticateToken, crearPrestamoUser);
router.post("/admin/crear-prestamo", authenticateToken, authAdmin, crearPrestamoAdmin);

//Marcar como devuelto
router.put("/admin/devolver/:id", authenticateToken, authAdmin, marcarComoDevuelto);

//Obtener solicitudes para calendario
router.get("/admin/calendario", authenticateToken, authAdmin, obtenerPrestamosAprobadosAdmin);
router.get("/user/calendario", authenticateToken, obtenerPrestamosAprobadosUser);

//Cancelar solicitud
router.put("/user/cancelar/:id", authenticateToken, cancelarPrestamo);
router.put("/admin/cancelar/:id", authenticateToken, authAdmin, cancelarPrestamoAdmin);


export default router;