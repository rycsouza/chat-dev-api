const Controller = require("../utils/controller");
const controller = new Controller();

module.exports = (server) => {
  server.post("/loginComFirebase", async (req, res) => {
    const idToken = req.header("Authorization");
    return res.send(await controller.loginComFirebase(idToken));
  });

  server.get("/myContacts/:username", async (req, res) => {
    const username = req.params.username;
    return res.send(await controller.getContacts(username));
  });
};
