const express = require("express");
const router = express.Router();

global.sendPassword = mailOptions => {
  mailTransporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info);
    }
  });
};

module.exports = router;
