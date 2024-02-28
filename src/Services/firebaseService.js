const admin = require("firebase-admin");
const serviceAccount = require("../config/chat-dev-project-firebase.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = { admin, app };
