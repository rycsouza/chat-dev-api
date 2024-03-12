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
    if (req.query.username) data = { username: req.query.username };
    usuarioController
      .show(data)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.get("/conversas", checkAuth, (req, resp) => {
    const user = req.user ? req.user : req.body;
    conversaController
      .buscarConversas(user)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.get("/mensagens", checkAuth, (req, resp) => {
    let data = req.user;
    if (!data) throw new Error("Usuário não autenticado");

    data = req.body
      ? { ...data, conversa_id: req.body.conversa_id }
      : { ...data, conversa_id: req.query.conversa_id };
    conversaController
      .buscarMensagens(data)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });
};
