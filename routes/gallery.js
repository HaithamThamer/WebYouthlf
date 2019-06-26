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
router.post("/api/gallery/add", (req, res) => {
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
                `insert into tbl_gallery (title,image,type,user_id) value ('','${body}',0,'${userId}');`,
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
module.exports = router;
