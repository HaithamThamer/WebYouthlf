const express = require("express");
const router = express.Router();
global.notify = (token, title, label, body, res) => {
  jwt.verify(token, constants.auth.key, (err, decoded) => {
    if (err) {
      console.log(err);
      res
        .status(500)
        .json({ err: "2x0002", msg: "access token is expired" }) // auth error
        .end();
      return;
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
          connection.query(
            `SELECT firebase_token FROM tbl_users WHERE firebase_token IS not NULL AND tbl_users.is_active `, //and tbl_users.id != ${userId}`,
            (err, results, feilds) => {
              // for (let index = 0; index < results.length; index++) {
              //   const element = results[index];
              //   firebase
              //     .messaging()
              //     .sendToDevice(element["firebase_token"], {
              //       notification: {
              //         title: title,
              //         label: label,
              //         body: body,
              //         priority: "high",
              //         color: "#ff543293",
              //         sound: "slow_spring_board.mp3",
              //         collapse_key: "type_a",
              //         notificationType: "52",
              //         vibrate: "300",
              //         icon: "app_icon",
              //         ongoing: "true",
              //         click_action: "FLUTTER_NOTIFICATION_CLICK"
              //       },
              //       data: { click_action: "FLUTTER_NOTIFICATION_CLICK" }
              //     })
              //     .then(response => {
              //       console.log(response);
              //       // res
              //       //   .status(200)
              //       //   .json({ response: response })
              //       //   .end();
              //     })
              //     .catch(err => {
              //       console.log(err);
              //     });
              // }
              var sendNotification = function(data) {
                var headers = {
                  "Content-Type": "application/json; charset=utf-8",
                  Authorization: "Basic " + constants.oneSignal.RestApi
                };

                var options = {
                  host: "onesignal.com",
                  port: 443,
                  path: "/api/v1/notifications",
                  method: "POST",
                  headers: headers
                };

                var https = require("https");
                var req = https.request(options, function(res) {
                  res.on("data", function(data) {
                    console.log("Response:");
                    console.log(JSON.parse(data));
                  });
                });

                req.on("error", function(e) {
                  console.log("ERROR:");
                  console.log(e);
                });

                req.write(JSON.stringify(data));
                req.end();
              };
              console.log(constants.oneSignal.AppId);
              var message = {
                app_id: "1973c6fa-1ee3-48b3-937d-92386c0f19ed",
                headings: { en: title },
                contents: { en: body },
                included_segments: ["All"]
              };

              sendNotification(message);
            }
          );
        }
      });
      connection.release();
    });
  });
};
router.post("/api/notifications/send", (req, res) => {
  const token = req.headers["x-access-token"];
  const title = req.body.title == null ? "" : req.body.title;
  const label = req.body.label == null ? "" : req.body.label;
  const body = req.body.body == null ? "" : req.body.body;
  notify(token, title, label, body, res);
  if (token == null) {
    res
      .status(500)
      .json({ err: "2x0001", msg: "access token not found" })
      .end();
    return;
  }
});

module.exports = router;
