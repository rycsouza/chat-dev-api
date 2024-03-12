const Usuario = require("../../models/UsuarioModel");
const gerarUsername = require("../../../Helpers/gerarUsername");

class UsuarioController {
  async login(usuario) {
    if (!usuario) throw new Error("Usuário não autenticado!");
    try {
      usuario.username = await gerarUsername(usuario.name);

      return (
        await Usuario.findOrCreate({
          attributes: ["nome", "username", "avatar"],
          where: { email: usuario.email },
          default: usuario,
        })
      )[0];
    } catch (error) {
      throw error;
    }
  }

  async show(usuario) {
    if (!usuario) throw new Error("Usuário não autenticado!");

    try {
      return await Usuario.findOne({
        attributes: ["nome", "username", "avatar"],
        where: { username: usuario.username },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UsuarioController;
