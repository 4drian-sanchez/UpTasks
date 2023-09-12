import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { nombre, email, token } = datos;
  const transport = nodemailer.createTransport({
    //TODO: Alamacenar valores en variables de entorno
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transport.sendMail({
    from: '"UpTasks - Administrador de proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTasks - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en UpTasks",
    html: `<p>Hola ${nombre}. Comprueba tu cuenta en UpTasks</p>
      <p>Tu cuenta esta casi lista, solo debes comprobarla en el siguiente enlace</p>
      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
      <p>Si no creastes esta cuenta puedes ignorar este correo</p>
      `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const { nombre, email, token } = datos;
  const transport = nodemailer.createTransport({
    //TODO: Alamacenar valores en variables de entorno
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transport.sendMail({
    from: '"UpTasks - Reestable tu contraseña" <cuentas@uptask.com>',
    to: email,
    subject: "UpTasks - Reestable tu contraseña",
    text: "Reestable tu contraseña",
    html: `<p>Hola ${nombre}. Sigue el siguiente enlace para reestablecer tu contraseña:</p>
      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}" >Comprobar cuenta</a>
      <p>Si no creastes esta cuenta puedes ignorar este correo</p>
      `,
  });
};
