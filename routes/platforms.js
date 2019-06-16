const express = require("express");
const router = express.Router();
//get platforms
router.post("/api/platforms", (req, res) => {
  const token = req.headers["x-access-token"];

  //
  const userId = checkToken(token);
  if (!userId) {
    res
      .status(500)
      .json({ err: "4x0001", msg: "token error" })
      .end();
    return;
  }
  mysqlConnection.getConnection((err, connection) => {
    connection.query(`call platforms();`, (errors, results, fields) => {
      res
        .status(200)
        .json({ platforms: results[0] })
        .end();
    });
    connection.release();
  });
});
module.exports = router;
