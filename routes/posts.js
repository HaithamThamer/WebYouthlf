const express = require("express");
const router = express.Router();

router.post("/api/posts/image/upload", (req, res) => {
  var img = req.body.img;
  var fileExtention = req.body.fileExtension;
  if (img == null) {
    res
      .status(500)
      .json({ err: "3x0001", msg: "img isn't defined!" }) // auth error
      .end();
    return;
  }
  const token = req.headers["x-access-token"];
  jwt.verify(token, constants.auth.key, (err, decoded) => {
    if (err) {
      res
        .status(500)
        .json({ err: "3x0002", msg: "access token is expired" }) // auth error
        .end();
    } else {
      const userId = mysqlConnection.escape(decoded["id"]);

      mysqlConnection.getConnection((err, connection) => {
        if (err) {
          res
            .status(500)
            .json({ err: "3x0003", msg: "database connection" })
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
                .json({
                  err: "3x0004",
                  msg: "cannot upload image to CDN",
                  body: body
                })
                .end();
            } else {
              res
                .status(200)
                .json({ ImageName: body })
                .end();
            }
          }
        );
        connection.release();
      });
    }
  });
});
router.post("/api/posts/send", (req, res) => {
  var content = req.body.content;
  var img = req.body.img;
  const firebaseToken = req.body.firebaseToken;
  if (img == null || content == null) {
    res
      .status(500)
      .json({ err: "3x0001", msg: "img or content isn't defined!" }) // auth error
      .end();
    return;
  }

  const token = req.headers["x-access-token"];
  jwt.verify(token, constants.auth.key, (err, decoded) => {
    if (err) {
      res
        .status(500)
        .json({ err: "3x0002", msg: "access token is expired" }) // auth error
        .end();
    } else {
      const userId = mysqlConnection.escape(decoded["id"]);
      content = mysqlConnection.escape(content);
      img = mysqlConnection.escape(img);
      mysqlConnection.getConnection((err, connection) => {
        if (err) {
          res
            .status(500)
            .json({ err: "3x0003", msg: "error in database connection" })
            .end();
          return;
        }

        connection.query(
          `insert into tbl_posts (content,image,user_id) value (${content},${img},${userId});`,
          (errors, results, fields) => {
            if (errors) {
              res
                .status(500)
                .json({ err: "3x0004", msg: "error in database query" })
                .end();
              return;
            }
            console.log("111");
            global.notify(
              token,
              "ملتقى الشباب القيادي",
              "ملتقى الشباب القيادي",
              content,
              firebaseToken,
              res
            );
            res
              .status(200)
              .json({ msg: results })
              .end();
          }
        );
        connection.release();
      });
    }
  });
});
router.post("/api/posts", (req, res) => {
  console.log("Getting posts");
  mysqlConnection.getConnection((err, connection) => {
    connection.query(`call posts();`, (errors, results, fields) => {
      res
        .status(200)
        .json({ posts: results[0] })
        .end();
    });
    connection.release();
  });
});
module.exports = router;
