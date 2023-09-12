import Express from "express";
import "dotenv/config";
import cors from "cors";
import conectarDB from "./config/db.js";
import UsuarioRoutes from "./routes/UsuariosRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/TareaRoutes.js";

const app = Express();
//Obtener objetos json en el req.body
app.use(Express.json());
conectarDB();

//Configurar cors
const whiteList = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      //puede consultar la API
      callback(null, true);
    } else {
      //no esta permitido
      callback(new Error("Error de cors"));
    }
  },
};

app.use(cors(corsOptions));
app.use("/api/usuarios", UsuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

app.listen(process.env.PORT, () =>
  console.log(
    `La aplicación se esta ejecutando en el puerto ${process.env.PORT}`
  )
);
