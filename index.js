import Express from "express";
import "dotenv/config";
import conectarDB from "./config/db.js";
import UsuarioRoutes from "./routes/UsuariosRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/TareaRoutes.js";

const app = Express();
//Obtener objetos json en el req.body
app.use(Express.json());

conectarDB();

app.use("/api/usuarios", UsuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

app.listen(process.env.PORT, () =>
  console.log(
    `La aplicación se esta ejecutando en el puerto ${process.env.PORT}`
  )
);
