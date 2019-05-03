const express = require("express");
const router = express.Router();

router.post("/api/notifications/send", (req, res) => {
  const token = req.headers["x-access-token"];
  if (token == null) {
    res
      .status(500)
      .json({ err: "2x0001", msg: "access token not found" })
      .end();
    return;
  }
  jwt.verify(token, constants.auth.key, (err, decoded) => {
    if (err) {
      res
        .status(500)
        .json({ err: "2x0002", msg: "access token is expired" }) // auth error
        .end();
    }
    const userId = decoded["id"];
    mysqlConnection.getConnection((err, connection) => {
      connection.query(`call userId(${userId});`, (err, results, feilds) => {
        if (results[0].length == 0) {
          res
            .status(500)
            .json({ err: "2x0003", msg: "id do not found" })
            .end();
        } else {
          const isAdmin = results[0][0]["user_type"] != 2;
          if (isAdmin) {
            res
              .status(500)
              .json({
                err: "2x0004",
                msg: "you don't have permissions "
              })
              .end();
            return;
          }
          const title = req.body.title == null ? "" : req.body.title;
          const label = req.body.label == null ? "" : req.body.label;
          const body = req.body.body == null ? "" : req.body.body;
          firebase
            .messaging()
            .sendToDevice(process.env.firebase_token, {
              notification: {
                title: title,
                label: label,
                body: body
              },
              data: {
                //required key value pair
                myname: "Haitham"
              }
            })
            .then(response => {
              res
                .status(200)
                .json({ response: response })
                .end();
            })
            .catch(err => {
              res
                .status(500)
                .json({
                  err: "2x0005",
                  msg: "notification sends failed. " + err
                })
                .end();
            });
        }
      });
      connection.release();
    });
  });
});

module.exports = router;
