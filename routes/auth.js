const express = require("express");
const router = express.Router();
router.post("/api/auth/create", (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  mysqlConnection.getConnection((err, connection) => {
    connection.query();
  });
  // create a token
  const token = jwt.sign({ id: id }, constants.auth.key, {
    expiresIn: 86400 // expires in 24 hours
  });
  res
    .status(200)
    .json({ token: token })
    .end();
});

router.get("/api/auth/verify", (req, res) => {
  const token = req.headers["x-access-token"];

  jwt.verify(token, constants.auth.key, function(err, decoded) {
    if (err) {
      res
        .status(500)
        .json({ err: err })
        .end();
    } else {
      const user = decoded["id"];
      res
        .status(200)
        .json({ user: user, iat: decoded["iat"], exp: decoded["exp"] })
        .end();
    }
  });
});
module.exports = router;
