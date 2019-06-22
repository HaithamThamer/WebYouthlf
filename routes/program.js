const express = require("express");
const router = express.Router();

router.post("/api/program", (req, res) => {
  const token = req.headers["x-access-token"];

  //
  const userId = checkToken(token);
  console.log(userId);
  if (!userId) {
    res
      .status(500)
      .json({ err: "4x0001", msg: "token error" })
      .end();
    return;
  }

  mysqlConnection.getConnection((err, connection) => {
    connection.query(
      "SET SESSION group_concat_max_len = 1000000;SELECT DATE(program.creation) AS `creation`, ( SELECT GROUP_CONCAT(DISTINCT p.id,'^',p.title,'^',if(p.content = '','-',IFNULL(p.content,'-')),'^',p.image,'^',p.creation,'^',p.user_id  ORDER BY DATE(p.creation) ASC,TIME(p.creation) asc SEPARATOR ',') FROM tbl_program p WHERE DATE(p.creation) = DATE(program.creation) ) AS `result` FROM tbl_program program GROUP BY DAY(program.creation)",
      (err, result, field) => {
        if (err) {
          res
            .status(500)
            .json({ err: "4x0002", msg: err })
            .end();
          return;
        }
        res
          .status(200)
          .json({ program: result })
          .end();
      }
    );
  });
});

module.exports = router;
