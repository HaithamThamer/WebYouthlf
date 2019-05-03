const express = require("express");
const router = express.Router();
//get platforms
router.get("/api/platforms", (req, res) => {
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
