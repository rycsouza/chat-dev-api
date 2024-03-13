const checkAuth = require("../utils/checkAuth");
const UsuarioController = require("../controller/http/usuarioController");
const ConversaController = require("../controller/http/conversaController");

const usuarioController = new UsuarioController();
const conversaController = new ConversaController();

module.exports = (server) => {
  server.post("/login", checkAuth, (req, resp) => {
    const user = req.user;
    usuarioController
      .login(user)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.get("/profile", checkAuth, (req, resp) => {
    let data = req.user;
    data = req.query.username
      ? { username: req.query.username }
      : { username: req.body.username };
    usuarioController
      .show(data)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.get("/conversas", checkAuth, (req, resp) => {
    const user = req.user;
    conversaController
      .buscarConversas(user)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.get("/mensagens", checkAuth, (req, resp) => {
    const user = req.user;

    const data = req.body
      ? { conversa_id: req.body.conversa_id }
      : { conversa_id: req.query.conversa_id };
    conversaController
      .buscarMensagens({ user, data })
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.post("/mensagens", checkAuth, (req, resp) => {
    const user = req.user;

    const data = req.body
      ? {
          conversa_id: req.body.conversa_id,
          mensagem: req.body.mensagem,
        }
      : {
          conversa_id: req.query.conversa_id,
          mensagem: req.query.mensagem,
        };

    conversaController
      .enviarMensagem({ user: user, data: data })
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.get("/", (_, resp) => {
    resp.json({
      rotasHTTP: {
        perfil:
          "GET /profile \n Headers: GitHub TOKEN \n Sem parâmetros para o usuário logado | username para outro usuário",
        conversas: "GET /conversas \n Headers: GitHub TOKEN \n Sem parâmetros",
        BuscarMensagens:
          "GET /mensagens \n Headers: GitHub TOKEN \n Parâmetros: conversa_id",
        login: "POST /login \n Headers: GitHub TOKEN \n Sem parâmetros",
        EnviarMensagens:
          "POST /mensagens \n Headers: GitHub TOKEN \n Parâmetros: { conversa_id, mensagem }",
      },
      eventosSOCKET: {
        conversar: "Parâmetro: { conversa_id }",
        enviarMensagem:
          "Parâmetro: { conversa_id, mensagem } \n Emite um evento novaMensagem, contendo a mensagem",
      },
    });
  });
};
