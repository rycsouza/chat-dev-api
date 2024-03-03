const { admin, app } = require("../../Services/firebaseService");

const checkAuth = (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) throw new Error("Token não enviado!");
  admin
    .auth(app)
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      next();
    })
    .catch((error) => {
      res.status(403).json({ status: "error", message: error.message });
    });
};

module.exports = checkAuth;
