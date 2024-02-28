const express = require("express");
const axios = require("axios");

axios
  .get("https://viacep.com.br/ws/01001000/json/")
  .then((resp) => console.log(resp))
  .catch((erro) => console.log(erro));

console.log("server");
