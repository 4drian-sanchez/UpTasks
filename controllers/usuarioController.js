import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/generarId.js";
import generarToken from "../helpers/generarJWT.js";

export const registrar = async (req, res) => {
  const { email } = req.body;

  //Evitar usuarios duplicados
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    res.status(400).json({ msg: error.message });
    return;
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarId();
    const usuarioAlmacenado = await usuario.save();
    res.status(200).json({ usuarioAlmacenado });
  } catch (error) {
    console.log(error.message);
  }
};

export const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //Validar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("Usuario no registrado");
    res.status(404).json({ msg: error.message });
    return;
  }

  //Validar si el usuario ha confirmmado la cuenta
  if (!usuario.confirmado) {
    const error = new Error("Usuario no confirmado");
    res.status(403).json({ msg: error.message });
    return;
  }

  //Comprobar el password
  if (await usuario.comprobarPassword(password)) {
    return res.status(200).json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarToken(usuario._id),
    });
  } else {
    const error = new Error("Contraseña incrorrecta");
    return res.status(403).json({ msg: error.message });
  }
};

export const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ token });
  if (!usuario) {
    const error = new Error("Token no válido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuario.confirmado = true;
    usuario.token = "";
    await usuario.save();
    return res.status(200).json({ msg: "Cuenta confirmada correctamente" });
  } catch (error) {
    console.log(error.message);
  }
};

export const olvidePassword = async (req, res) => {
  const { email } = req.body;

  //Validar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("Usuario no registrado");
    res.status(404).json({ msg: error.message });
    return;
  }

  try {
    usuario.token = generarId();
    await usuario.save();
    return res.status(200).json({
      msg: "Se han enviado las instrucciones a tu correo electronico",
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    res.status(200).json({ msg: "Token válido y el usuario existe" });
  } else {
    const error = new Error("Token no válido");
    res.status(404).json({ msg: error.message });
  }
};

export const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    try {
      await usuario.save();
      return res
        .status(200)
        .json({ msg: "nueva contraseña creada correctamente" });
    } catch (error) {
      console.log(error.message);
    }
  } else {
    const error = new Error("Token no válido");
    res.status(404).json({ msg: error.message });
  }
};

export const perfil = async (req, res) => {
  console.log(req.usuario);
};
