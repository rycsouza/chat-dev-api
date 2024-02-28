const gerarUsername = (nome) => {
  let username = nome.toLowerCase().replace(" ", '');

  return username;
};

module.exports = gerarUsername;
