const express = require("express");
const router = express.Router();

//get trainers
router.get("/api/trainers", (req, res) => {
  mysqlConnection.getConnection((err, connection) => {
    connection.query(`call trainers();`, (errors, results, fields) => {
      res
        .status(200)
        .json({ trainers: results[0] })
        .end();
    });
    connection.release();
  });
});

module.exports = router;
