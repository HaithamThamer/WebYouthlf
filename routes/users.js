const express = require("express");
const router = express.Router();

//login
router.post("/api/users/login", (req, res) => {
  const email = mysqlConnection.escape(req.body.email);
  const pass = mysqlConnection.escape(req.body.pass);
  console.log(`try to login ${email}`);

  mysqlConnection.getConnection((err, connection) => {
    connection.query(
      `call userLogin(${email},${pass});`,
      (errors, results, fields) => {
        console.log(`call userLogin(${email},${pass});`);
        if (results[0].length == 0) {
          res
            .status(500)
            .json({ err: "1x0001", msg: "email or password wrong" })
            .end();
        } else {
          const userId = results[0][0]["id"];
          if (results[0][0]["is_active"] == "0") {
            res
              .status(500)
              .json({ err: "1x0002", msg: "user is not active" })
              .end();
          } else {
            const token = jwt.sign({ id: userId }, constants.auth.key, {
              expiresIn: 86400 * 10
            });
            connection.query(
              `update tbl_users set firebase_token = '${
                req.body.firebaseToken
              }' where id = ${userId}`,
              (errors, results, fields) => {}
            );
            res
              .status(200)
              .json({ user: results[0], token: token })
              .end();
          }
        }
      }
    );
    connection.release();
  });
});
router.post("/api/users/token", (req, res) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, constants.auth.key, (err, decoded) => {
    if (err) {
      res
        .status(500)
        .json({ err: "1x0003", msg: "access token is expired" }) // auth error
        .end();
    } else {
      const userId = mysqlConnection.escape(decoded["id"]);

      mysqlConnection.getConnection((err, connection) => {
        connection.query(`call userId(${userId});`, (err, results, feilds) => {
          if (results[0].length == 0) {
            res
              .status(500)
              .json({ err: "1x0004", msg: "id do not found" }) // auth error
              .end();
          } else {
            res
              .status(200)
              .json({ user: results[0] })
              .end();
          }
        });
        connection.release();
      });
    }
  });

  console.log("check token");
});
router.post("/api/users/avatar/upload", (req, res) => {
  var img = req.body.img;
  var fileExtention = req.body.fileExtension;
  if (img == null) {
    res
      .status(500)
      .json({ err: "1x0009", msg: "img isn't defined!" }) // auth error
      .end();
    return;
  }
  const token = req.headers["x-access-token"];
  jwt.verify(token, constants.auth.key, (err, decoded) => {
    if (err) {
      res
        .status(500)
        .json({ err: "1x0003", msg: "access token is expired" }) // auth error
        .end();
    } else {
      const userId = mysqlConnection.escape(decoded["id"]);

      mysqlConnection.getConnection((err, connection) => {
        if (err) {
          res
            .status(500)
            .json({ err: "1x0006", msg: "database connection" })
            .end();
          return;
        }
        request.post(
          {
            headers: { "content-type": "application/x-www-form-urlencoded" },
            url: constants.Server.CDN + "/upload.php",
            form: { image_base64: img, file_extention: fileExtention }
          },
          function(error, response, body) {
            if (error) {
              res
                .status(500)
                .json({ err: "1x0007", msg: "cannot upload avatar to CDN" })
                .end();
            } else {
              connection.query(
                `insert into tbl_users_images (user_id,image) value ('${userId}','${body}');`,
                (err, results, feilds) => {
                  if (err) {
                    res
                      .status(500)
                      .json({ err: "1x0008", msg: "database query error" })
                      .end();
                  } else {
                    res
                      .status(200)
                      .json({ ImageName: body })
                      .end();
                  }
                }
              );
            }
          }
        );
        connection.release();
      });
    }
  });
});
//get users
router.get("/api/users", (req, res) => {
  console.log("users are gotten");
  mysqlConnection.getConnection((err, connection) => {
    connection.query(`call users();`, (errors, results, fields) => {
      res
        .status(200)
        .json({ users: results[0] })
        .end();
    });
    connection.release();
  });
});
router.post("/api/users/update", (req, res) => {
  const userId = mysqlConnection.escape(req.body.userId);
  const attribute = req.body.attribute;
  const value = mysqlConnection.escape(req.body.value);

  mysqlConnection.getConnection((err, connection) => {
    connection.query(
      `update tbl_users set ${attribute} = ${value} where id = ${userId} `,
      (errors, results, fields) => {
        res
          .status(200)
          .json({ users: results[0] })
          .end();
      }
    );
    connection.release();
  });
});
router.post("/api/users/forgetPassword", (req, res) => {
  const userEmail = mysqlConnection.escape(req.body.email);
  if (!userEmail.includes("@")) {
    res
      .status(500)
      .json({ err: "1x0010", msg: "it is not an email" })
      .end();
    return;
  }
  mysqlConnection.getConnection((err, connection) => {
    connection.query(
      `select phone as \`phone\` from tbl_users where email = ${userEmail};`,
      (errors, results, fields) => {
        if (results.length > 0) {
          sendPassword({
            from: constants.gmail.email,
            to: req.body.email,
            subject: "الملتقى القيادي الخامس | كلمة المرور",
            text: results[0]["phone"]
          });
          res
            .status(200)
            .json({ msg: "email has sent" })
            .end();
          return;
        } else {
          res
            .status(500)
            .json({ err: "1x0011", msg: "email isn't found" })
            .end();
          return;
        }
      }
    );
    connection.release();
  });
});
module.exports = router;
