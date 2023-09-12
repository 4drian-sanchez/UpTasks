import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

export const obtenerProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find()
      .where("creador")
      .equals(req.usuario)
      .select("-tareas");
    const id = proyectos.map((proyecto) => proyecto._id);
    return res.status(200).json(proyectos);
  } catch (error) {
    return res.status(404).json({ msg: "error al encontrar los proyectos" });
  }
};

export const crearProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body);
  proyecto.creador = req.usuario?._id;

  try {
    const proyectoAlmacenado = await proyecto.save();
    return res.status(200).json(proyectoAlmacenado);
  } catch (error) {
    return res
      .status(403)
      .json({ msg: "Proyectos no existentes o error con la conexión" });
  }
};

export const obtenerProyecto = async (req, res) => {
  const { id } = req.params;

  try {
    const proyecto = await Proyecto.findById(id).populate("tareas");
    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
      const error = new Error("Acción no válida");
      return res.status(404).json({ msg: error.message });
    }
    res.status(200).json(proyecto);
  } catch (error) {
    return res.status(404).json({ msg: "El proyecto no existe" });
  }
};

export const editarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  const { nombre, descripcion, cliente } = req.body;
  proyecto.nombre = nombre || proyecto.nombre;
  proyecto.descripcion = descripcion || proyecto.descripcion;
  proyecto.cliente = cliente || proyecto.cliente;

  try {
    const proyectoEditado = await proyecto.save();
    return res.status(200).json(proyectoEditado);
  } catch (error) {
    console.log(error.message);
  }
};

export const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  const proyecto = await Proyecto.findById(id);

  if (!proyecto) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }

  if (proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción no válida");
    return res.status(404).json({ msg: error.message });
  }

  try {
    await proyecto.deleteOne();
    return res.status(200).json({ msg: "Proyecto eliminado correctamente" });
  } catch (error) {
    console.log(error.message);
  }
};
