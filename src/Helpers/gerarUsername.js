const db = require("../config/database");
const gerarUsername = async (nome) => {
  let username = nome.toLowerCase().replace(" ", "");
  const usernameEmUso = (
    await new Promise((resolve, reject) => {
      db.query(
        `SELECT username FROM usuarios WHERE username = '${username}' ORDER BY id DESC LIMIT 1`,
        (erro, resultado) => {
          if (erro) return reject(erro);
          return resolve(resultado);
        }
      );
    })
  )[0]?.username;

  if (usernameEmUso) {
    const strnum = usernameEmUso.replaceAll(/\D/g, "");
    if (strnum) {
      const num = parseInt(strnum);
      username = `${nome.toLowerCase().replace(" ", "")}${num + 1}`;
    } else username = `${nome.toLowerCase().replace(" ", "")}0`;
  }

  return username;
};

module.exports = gerarUsername;
