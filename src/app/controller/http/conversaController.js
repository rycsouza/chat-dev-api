const { QueryTypes } = require("sequelize");
const sequelize = require("../../../config/sequelize");
const Usuario = require("../../models/UsuarioModel");
const Mensagem = require("../../models/MensagemModel");
const Conversa = require("../../models/ConversaModel");
const openai = require("../../../config/openAI");
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

      let conversas = await Usuario.findOne({
        attributes: ["nome", "username", "avatar"],
        where: { username: "gpt" },
      });

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

      conversas = await sequelize
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

  async buscarMensagens({ user, data }) {
    if (!user) throw new Error("Usuário não autenticado");
    if (!data.conversa_id) throw new Error("Conversa não encontrada!");

    try {
      return await Mensagem.findAll({
        attributes: ["data_cadastro", "remetente", "mensagem"],
        where: { conversa_id: data.conversa_id },
        order: [["data_cadastro", "DESC"]],
      });
    } catch (error) {
      throw error;
    }
  }

  async enviarMensagem({ user, data }) {
    try {
      data.remetente = (
        await Usuario.findOne({
          attributes: ["username"],
          where: { email: user.email },
        })
      )?.username;

      if (!data.remetente) throw new Error("Mensagem não enviada!");

      await Mensagem.create(data);

      const participantes = (
        await Conversa.findOne({
          attributes: ["participantes"],
          where: { id: data.conversa_id },
        })
      ).participantes.replace(`${data.remetente}, `, "");

      if (participantes != "gpt") return data.mensagem;

      const gptResponse = (
        await openai.chat.completions.create({
          messages: [{ role: "system", content: data.mensagem }],
          model: "gpt-3.5-turbo",
        })
      ).choices[0].message.content;

      data.remetente = participantes;
      data.mensagem = gptResponse;
      await Mensagem.create(data);

      return { GPT: gptResponse };
    } catch (error) {
      throw error.message;
    }
  }
}

module.exports = ConversaController;
