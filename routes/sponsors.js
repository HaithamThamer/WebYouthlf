const express = require("express");
const router = express.Router();

//get sponsors
router.get("/api/sponsors", (req, res) => {
  mysqlConnection.getConnection((err, connection) => {
    connection.query(`call sponsors();`, (errors, results, fields) => {
      res
        .status(200)
        .json({ trainers: results[0] })
        .end();
    });
    connection.release();
  });
});
module.exports = router;
