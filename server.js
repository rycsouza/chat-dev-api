const server = require("./src/config/custom-express");
const io = require("./src/config/socket");
const ENV = require("dotenv").config().parsed;
const sequelize = require("./src/config/sequelize");

const PORT = ENV.PORT || 3000;
const HOST = ENV.HOST || "http://127.0.0.1";

sequelize
  .sync()
  .then(() => console.log("Banco de dados sincronizado"))
  .catch((error) =>
    console.error("Falha ao sincronizar banco de dados:", error)
  );

server.listen(PORT, () => console.log(`Server is running | ${HOST}:${PORT}`));
io.listen(parseInt(PORT) + 1);
