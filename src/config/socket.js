const server = require("./custom-express");
const Mensagem = require("../app/models/MensagemModel");

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
    let conversa_id = conversa.conversa_id;

    try {
      const conversas = await new Promise((resolve, reject) => {
        database.query(
          `SELECT id FROM conversas WHERE id = '${conversa_id}'`,
          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      });

      if (conversas.length <= 0) {
        const novaConversa = await new Promise((resolve, reject) => {
          database.query(
            `INSERT INTO conversas(participantes) VALUES ('${conversa.participantes}')`,
            (erro, resultado) => {
              if (erro) return reject(erro);
              return resolve(resultado);
            }
          );
        });

        if (novaConversa.affectedRows == 0)
          throw new Error("Falha ao criar conversa!");

        conversa_id = (
          await new Promise((resolve, reject) => {
            database.query(
              `SELECT id FROM conversas WHERE participantes = '${conversa.participantes}'`,
              (erro, resultado) => {
                if (erro) return reject(erro);
                return resolve(resultado);
              }
            );
          })
        )[0]?.id;
      }
    } catch (error) {
      throw error;
    }

    socket.join(conversa_id);
  });

  socket.on("enviarMensagem", async (mensagem) => {
    let conversa_id;
    try {
      conversa_id = parseInt(mensagem.conversa_id)
        ? mensagem.conversa_id
        : (
            await new Promise((resolve, reject) => {
              database.query(
                `SELECT id FROM conversas WHERE participantes = '${mensagem.participantes}'`,
                (erro, resultado) => {
                  if (erro) return reject(erro);
                  return resolve(resultado);
                }
              );
            })
          )[0]?.id;

      await new Promise((resolve, reject) => {
        database.query(
          `INSERT INTO mensagens(conversa_id, remetente_id, mensagem) VALUES (${conversa_id}, ${mensagem.usuario_id}, '${mensagem.texto}')`,
          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      });
    } catch (error) {
      throw error;
    }

    io.to(conversa_id).emit("novaMensagem", mensagem.texto);
  });
});

module.exports = io;
