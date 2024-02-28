const express = require("express");
const server = express();
server.use(express.json());
const rotas = require("../app/routes/rotas");

rotas(server);

module.exports = server;
