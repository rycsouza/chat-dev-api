const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize");

const Conversa = sequelize.define(
  "conversas",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    participantes: {
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

module.exports = Conversa;
