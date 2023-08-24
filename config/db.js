import Mongoose from "mongoose";

const conectarDB = async () => {
  try {
    const connection = await Mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB conectado en ${url}`);
  } catch (error) {
    console.log(error.message);
  }
};

export default conectarDB;
