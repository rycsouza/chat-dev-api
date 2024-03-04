class ConversaController {
  constructor(con) {
    this.con = con;
  }

  async buscarMensagens(usuario) {
    if (!usuario) throw new Error("Usuário não autenticado!");

    const conversa_id = usuario.conversa_id ? usuario.conversa_id : null;

    const username = (
      await new Promise((resolve, reject) => {
        this.con.query(
          `SELECT username
          FROM usuarios
          WHERE email = '${usuario.email}'`,
          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      })
    )[0]?.username;

    const conversas = await new Promise((resolve, reject) => {
      this.con.query(
        `SELECT cnv.id, cnv.participantes, msg.data_cadastro data_envio, msg.mensagem, u.username remetente
        FROM conversas cnv
        JOIN mensagens msg ON cnv.id = msg.conversa_id
        LEFT JOIN usuarios u ON msg.remetente_id = u.id
        WHERE FIND_IN_SET('${username}', cnv.participantes) > 0 OR cnv.id = ${conversa_id}
        ORDER BY msg.data_cadastro DESC;`,

        (erro, resultado) => {
          if (erro) return reject(erro);
          return resolve(resultado);
        }
      );
    });

    if (conversas.length > 0) return conversas;

    const allUsers = (
      await new Promise((resolve, reject) => {
        this.con.query(
          `SELECT nome, username, avatar FROM usuarios`,

          (erro, resultado) => {
            if (erro) return reject(erro);
            return resolve(resultado);
          }
        );
      })
    );

    return allUsers;
  }
}

module.exports = ConversaController;
