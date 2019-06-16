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
      "SELECT program.creation,(SELECT GROUP_CONCAT(p.id,'^',p.title,'^',p.content,'^',p.image,'^',p.creation,'^',p.user_id) FROM tbl_program p WHERE DATE(creation) =  DATE(program.creation) ) AS `result` FROM tbl_program program WHERE program.creation >= current_timestamp GROUP BY day(creation)",
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
