import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export default async function checkAuth(req, res, next) {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRECT);
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -token -createAt -updateAt -__V"
      );
    } catch (error) {
      return res.status(401).json({ msg: "El token no exite" });
    }
  }

  if (!token) return res.status(401).json({ msg: "token no válido" });
  next();
}
