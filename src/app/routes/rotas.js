const connection = require("../../config/database");
const checkAuth = require("../utils/checkAuth");
const UsuarioController = require("../controller/http/usuarioController");
const ConversaController = require("../controller/http/conversaController");

const usuarioController = new UsuarioController(connection);
const conversaController = new ConversaController(connection);

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

  server.post("/conversas", checkAuth, (req, resp) => {
    const data = req.user;
    conversaController
      .iniciarConversa(data)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.get("/conversas", checkAuth, (req, resp) => {
    let data = req.user;

    if (req.query.conversa_id) data = { conversa_id: req.query.conversa_id };
    conversaController
      .buscarMensagens(data)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });
};
