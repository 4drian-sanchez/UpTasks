import Express from "express";
import {
  obtenerProyectos,
  crearProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
} from "../controllers/proyectoController.js";
import checkAuth from "../middlewares/checkAuth.js";

const router = Express.Router();
router
  .route("/")
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, crearProyecto);

router
  .route("/:id")
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto);

export default router;
