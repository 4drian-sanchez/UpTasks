import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UsuarioSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    token: {
      type: String,
    },

    confirmado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
//middleware para hashear contraseñas
UsuarioSchema.pre("save", async function (next) {
  //Si el password esta hascheado pasa al siguiente middleware
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UsuarioSchema.methods.comprobarPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password);
};

const Usuario = mongoose.model("Usuario", UsuarioSchema);
export default Usuario;
