const { admin, app } = require("../../Services/firebaseService");
const gerarUsername = require("../../Helpers/gerarUsername");

class Controller {
  async loginComFirebase(idToken) {
    if (!idToken) throw new Error("Token não enviado!");
    return await admin
      .auth(app)
      .verifyIdToken(idToken)
      .then((usuario) => {
        usuario.username = gerarUsername(usuario.name);
        return usuario;
      })
      .catch((error) => {
        return { status: "error", message: error.message };
      });
  }

  async getContacts(username) {
    //busca no banco os contatos desse usuário (JSON)
    //retorna os contatos em um array
  }
}

module.exports = Controller;
