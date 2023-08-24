import jwt from "jsonwebtoken";

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRECT, {
    expiresIn: "30d",
  });
};

export default generarToken;
