const express = require("express");
const router = express.Router();

//get info
router.get("/api/info", (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, constants.auth.key, (err, decoded) => {
    if (err) {
      res
        .status(500)
        .json({ err: err })
        .end();
    } else {
      mysqlConnection.getConnection((err, connection) => {
        connection.query(
          `select name,value from tbl_info`,
          (errors, results, fields) => {
            var jsonData = {};
            for (let index = 0; index < results.length; index++) {
              jsonData[results[index]["name"]] = results[index]["value"];
            }
            res
              .status(200)
              .json({ info: jsonData })
              .end();
          }
        );
        connection.release();
      });
    }
  });
});
//update info
router.put("/api/info", (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, constants.auth.key, (err, decoded) => {
    if (err || decoded.userType != 2) {
      res
        .status(500)
        .json({ err: err == null ? "user do not have permissions" : err })
        .end();
    } else {
      mysqlConnection.getConnection((err, connection) => {
        connection.query(``, (errors, results, fields) => {
          res
            .status(200)
            .json({ info: results[0] })
            .end();
        });
        connection.release();
      });
    }
  });
});
module.exports = router;
