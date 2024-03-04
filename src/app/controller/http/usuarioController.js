const gerarUsername = require("../../../Helpers/gerarUsername");

class UsuarioController {
  constructor(con) {
    this.con = con;
  }
  async login(usuario) {
    if (!usuario) throw new Error("Usuário não autenticado!");

    let usuarioExistente = (
      await new Promise((resolve, reject) => {
        this.con.query(
          `SELECT id, nome, username, avatar FROM usuarios WHERE email = '${usuario.email}' LIMIT 1;`,
          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      })
    )[0];
    if (usuarioExistente?.nome) return usuarioExistente;

    usuario.username = await gerarUsername(usuario.name);
    const result = await new Promise((resolve, reject) => {
      this.con.query(
        `INSERT INTO usuarios (nome, email, username, avatar) VALUES ('${usuario.name}', '${usuario.email}', '${usuario.username}', '${usuario.picture}');`,
        (erro, resultado) => {
          if (erro) return reject(erro);
          return resolve(resultado);
        }
      );
    });

    if (result.affectedRows == 0) throw new Error("Falha ao fazer Login!");

    let novoUsuario = (
      await new Promise((resolve, reject) => {
        this.con.query(
          `SELECT id, nome, username, avatar FROM usuarios WHERE email = '${usuario.email}' LIMIT 1;`,
          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      })
    )[0];

    return novoUsuario;
  }

  async show(usuario) {
    if (!usuario) throw new Error("Usuário não autenticado!");

    const perfil = (
      await new Promise((resolve, reject) => {
        this.con.query(
          `SELECT nome, username, avatar FROM usuarios WHERE email = '${usuario.email}' OR username = '${usuario.username}' LIMIT 1;`,
          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      })
    )[0];

    return perfil;
  }
}

module.exports = UsuarioController;
