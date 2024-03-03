const mysql = require("mysql");
const ENV = require("dotenv").config().parsed;

const connection = mysql.createConnection({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_DATABASE,
});

connection.connect((erro) => {
  if (erro) throw new Error(erro);
});

module.exports = connection;
