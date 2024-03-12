const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");
const bcrypt = require("bcrypt");
const Usuario = require("./UsuarioModel");
const Conversa = require("./ConversaModel");

const Mensagem = sequelize.define(
  "mensagens",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remetente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mensagem: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "data_cadastro",
    updatedAt: "data_atualizacao",
  }
);

Mensagem.belongsTo(Conversa, { foreignKey: "conversa_id" });

Mensagem.belongsTo(Usuario, { foreignKey: "remetente_id" });

module.exports = Mensagem;
