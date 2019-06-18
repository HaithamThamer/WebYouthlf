const express = require("express");
const router = express.Router();
router.post("/api/gallery", (req, res) => {
  mysqlConnection.getConnection((err, connection) => {
    connection.query(`call gallery();`, (errors, results, fields) => {
      res
        .status(200)
        .json({ galleryObjects: results[0] })
        .end();
    });
  });
});
module.exports = router;
