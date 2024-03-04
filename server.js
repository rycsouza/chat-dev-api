const server = require("./src/config/custom-express");
const io = require("./src/config/socket");

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "http://127.0.0.1";
server.listen(PORT, () => console.log(`Server is running | ${HOST}:${PORT}`));
io.listen(parseInt(PORT) + 1);
