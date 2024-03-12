const ENV = require("dotenv").config().parsed;
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(ENV.DB_DATABASE, ENV.DB_USER, ENV.DB_PASSWORD, {
  host: ENV.DB_HOST,
  dialect: "mysql",
});

module.exports = sequelize;
