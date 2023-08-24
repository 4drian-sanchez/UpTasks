import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

export const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;
  const existeProyecto = await Proyecto.findById(proyecto);
  try {
    if (req.usuario._id.toString() !== existeProyecto.creador.toString()) {
      const error = new Error("No tienes los permisos para crear una tarea");
      return res.status(404).json({ msg: error.message });
    }
  } catch (error) {
    return res.status(404).json({ msg: "el proyecto no existe" });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    return res.status(200).json(tareaAlmacenada);
  } catch (error) {
    console.log(error.message);
  }
};

export const obtenerTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id).populate("proyecto");
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("No tienes los permisos para crear una tarea");
      return res.status(403).json({ msg: error.message });
    }
    return res.status(200).json(tarea);
  } catch (error) {
    return res.status(404).json({ msg: "el proyecto no existe" });
  }
};

export const editarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id).populate("proyecto");
    console.log(tarea);
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("No tienes los permisos para editar esta tarea");
      return res.status(403).json({ msg: error.message });
    }

    const { nombre, descripcion, prioridad, fechaEntrega } = req.body;
    tarea.nombre = nombre || tarea.nombre;
    tarea.descripcion = descripcion || tarea.descripcion;
    tarea.prioridad = prioridad || tarea.prioridad;
    tarea.fechaEntrega = fechaEntrega || tarea.fechaEntrega;

    const tareaEditada = await tarea.save();
    res.status(200).json(tareaEditada);
  } catch (error) {
    res.status(404).json({ msg: "el proyecto no existe" });
  }
};

export const eliminarTarea = async (req, res) => {
  const { id } = req.params;

  try {
    const tarea = await Tarea.findById(id).populate("proyecto");

    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("No tienes los permisos para eliminar la tarea");
      return res.status(403).json({ msg: error.message });
    }

    const tareaEliminada = await tarea.deleteOne();
    return res.status(200).json(tareaEliminada);
  } catch (error) {
    return res.status(404).json({ msg: "el proyecto no existe" });
  }
};
