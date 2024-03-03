const server = require("./src/config/custom-express");

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
  socket.on("conversar", (conversaID) => {
    socket.join(conversaID);
  });

  socket.on("enviarMensagem", (mensagem) => {
    io.to(mensagem.conversaID).emit("novaMensagem", mensagem.texto);
    //salvar mensagem no banco
  });

  socket.on("disconnect", (username) => {
    console.log(`${username} saiu.`);
    //salvar no banco último login, pode ser útil
  });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "http://127.0.0.1";
server.listen(PORT, () => console.log(`Server is running | ${HOST}:${PORT}`));
io.listen(parseInt(PORT) + 1);
