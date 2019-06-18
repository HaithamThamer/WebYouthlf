const express = require("express");
const router = express.Router();
//get platforms
router.post("/api/sponsors", (req, res) => {
  const token = req.headers["x-access-token"];

  //
  const userId = checkToken(token);
  if (!userId) {
    res
      .status(500)
      .json({ err: "5x0001", msg: "token error" })
      .end();
    return;
  }
  mysqlConnection.getConnection((err, connection) => {
    connection.query(`call sponsors();`, (errors, results, fields) => {
      res
        .status(200)
        .json({ sponsors: results[0] })
        .end();
    });
    connection.release();
  });
});
module.exports = router;
