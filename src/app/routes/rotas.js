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
    let user = req.user;
    if (req.query.username) user = { username: req.query.username };
    usuarioController
      .show(user)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });

  server.get("/conversas", checkAuth, (req, resp) => {
    const user = req.user;
    conversaController
      .getContacts(user)
      .then((result) => resp.json(result))
      .catch((erro) => resp.json(erro));
  });
};
