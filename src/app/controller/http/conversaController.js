class ConversaController {
  async getContacts(usuario) {
    if (!usuario) throw new Error("Usuário não autenticado!");

    const id = (
      await new Promise((resolve, reject) => {
        this.con.query(
          `SELECT * FROM usuarios WHERE email = '${usuario.email}';`,
          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      })
    )[0].id;
    return id;

    //estruturar banco de dados, e adicionar a tabela contatos
    const lista = (
      await new Promise((resolve, reject) => {
        this.con.query(
          `SELECT lista FROM contatos WHERE usuario_id = ${id};`,
          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      })
    )[0].lista;
  }
}

module.exports = ConversaController;
