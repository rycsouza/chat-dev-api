const server = require("./custom-express");
const Mensagem = require("../app/models/MensagemModel");
const Conversa = require("../app/models/ConversaModel");

const http = require("http");
const { Server } = require("socket.io");
const socketServer = http.createServer(server);

const io = new Server(socketServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("conversar", async (conversa) => {
    const conversa_id = conversa.conversa_id;
    socket.join(conversa_id);
  });

  socket.on("enviarMensagem", (data) => {
    io.to(data.conversa_id).emit("novaMensagem", data.mensagem);
  });
});

module.exports = io;
