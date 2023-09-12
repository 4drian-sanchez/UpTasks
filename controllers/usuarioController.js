import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/generarId.js";
import generarToken from "../helpers/generarJWT.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/email.js";

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
    await usuario.save();
    const { nombre, email, token } = usuario;
    emailRegistro({ nombre, email, token });
    res.status(200).json({
      msg: "Usuario creado correctamente, revisa tu email para confirmar tu cuenta",
    });
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
  try {
    const { token } = req.params;
    const usuario = await Usuario.findOne({ token });
    usuario.confirmado = true;
    usuario.token = "";
    await usuario.save();
    return res.status(200).json({ msg: "Cuenta confirmada correctamente" });
  } catch (error) {
    return res.status(403).json({ msg: "Token no válido" });
  }
};

export const olvidePassword = async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    usuario.token = generarId();
    await usuario.save();
    emailOlvidePassword({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });
    res.status(200).json({
      msg: "Se han enviado las instrucciones a tu correo electronico",
    });
  } catch (error) {
    res.status(403).json({ msg: "Usuario no registrado" });
  }
};

export const comprobarToken = async (req, res) => {
  const { token } = req.params;

  try {
    const usuario = await Usuario.findOne({ token });
    if (!usuario) return res.status(404).json({ msg: "Token no válido" });
    res.status(200).json({ msg: "Token válido y el usuario existe" });
  } catch (error) {
    return res.status(404).json({ msg: "Token no válido" });
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
  res.json(req.usuario);
};
