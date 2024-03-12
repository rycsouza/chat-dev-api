const { QueryTypes, Op } = require("sequelize");
const sequelize = require("../../../config/sequelize");
const Usuario = require("../../models/UsuarioModel");
const Mensagem = require("../../models/MensagemModel");
const Conversa = require("../../models/ConversaModel");
class ConversaController {
  async buscarConversas(usuario) {
    if (!usuario) throw new Error("Usuário não autenticado!");
    try {
      const username = (
        await Usuario.findOne({
          attributes: ["username"],
          where: {
            email: usuario.email,
          },
        })
      )?.username;

      if (!username)
        throw new Error("Usuário não existe na nossa base de dados.");

      const queryConversas = `
      SELECT
        cnv.id conversa_id,
        cnv.participantes,
        u.nome,
        SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(cnv.participantes, ', ', ','), ',', -1), ',', 1) as username,
        u.avatar
      FROM
        conversas cnv, usuarios u
      WHERE FIND_IN_SET('${username}', cnv.participantes) > 0
      AND u.username = SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(cnv.participantes, ', ', ','), ',', -1), ',', 1);`;

      let conversas = await sequelize
        .query(queryConversas, { type: QueryTypes.SELECT })
        .then((result) => {
          return result;
        })
        .catch((error) => {
          throw error;
        });

      let queryContatos = `SELECT nome, username, avatar FROM usuarios WHERE username NOT IN ('${username}', `;
      conversas.forEach((conversa) => {
        const participante = conversa.participantes.replace(
          `${username}, `,
          ""
        );
        queryContatos += `'${participante}', `;
      });
      queryContatos = `${queryContatos.slice(0, -2)})`;

      const contatos = await sequelize
        .query(queryContatos, { type: QueryTypes.SELECT })
        .then((result) => {
          return result;
        })
        .catch((error) => {
          throw error;
        });

      await Promise.all(
        contatos.map((contato) => {
          return Conversa.create({
            participantes: `${username}, ${contato.username}`,
          });
        })
      );

      conversas = await sequelize
        .query(queryConversas, { type: QueryTypes.SELECT })
        .then((result) => {
          return result;
        })
        .catch((error) => {
          throw error;
        });

      return conversas;
    } catch (error) {
      throw error;
    }
  }

  async buscarMensagens(data) {
    if (!data.conversa_id) throw new Error("Conversa não encontrada!");

    return await Mensagem.findAll({
      attributes: ["data_cadastro", "remetente_id", "mensagem"],
      where: { conversa_id: data.conversa_id },
      order: [["data_cadastro", "DESC"]],
    });
  }
}

module.exports = ConversaController;
