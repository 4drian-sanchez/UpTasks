import Express from "express";
import checkAuth from "../middlewares/checkAuth.js";
import {
  agregarTarea,
  editarTarea,
  eliminarTarea,
  obtenerTarea,
} from "../controllers/TareaController.js";

const router = Express.Router();

router.post("/", checkAuth, agregarTarea);
router
  .route("/:id")
  .get(checkAuth, obtenerTarea)
  .put(checkAuth, editarTarea)
  .delete(checkAuth, eliminarTarea);

export default router;
