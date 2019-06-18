//.env
const dotenv = require("dotenv");
dotenv.config();
global.dotenv = dotenv;

//
const constants = require("./config/constants"),
  express = require("express"),
  mysql = require("mysql"),
  jwt = require("jsonwebtoken"),
  bodyParser = require("body-parser"),
  request = require("request"),
  uniqueName = require("unique-filename"),
  auth = require("./routes/auth"),
  comments = require("./routes/comments"),
  info = require("./routes/info"),
  program = require("./routes/program"),
  notification = require("./routes/notification"),
  platforms = require("./routes/platforms"),
  posts = require("./routes/posts"),
  sponsors = require("./routes/sponsors"),
  trainers = require("./routes/trainers"),
  gallery = require("./routes/gallery"),
  users = require("./routes/users");

const mysqlConnection = mysql.createPool({
  host: constants.mysql.host,
  user: constants.mysql.username,
  password: constants.mysql.password,
  database: constants.mysql.database
});
app = express();
var firebase = require("firebase-admin");
var serviceAccount = require("./youthlf-2a7e6-firebase-adminsdk-zmm9f-87d27f0227.json");
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://youthlf-2a7e6.firebaseio.com"
});

mysqlConnection.getConnection((err, connection) => {
  connection.query("select 1;", (errors, results, fields) => {});
  connection.release();
});

//
global.mysqlConnection = mysqlConnection;
global.jwt = jwt;
global.constants = constants;
global.firebase = firebase;
global.request = request;
global.uniqueName = uniqueName;
global.constants = constants;

//
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));
app.use(auth);
app.use(comments);
app.use(info);
app.use(notification);
app.use(platforms);
app.use(posts);
app.use(sponsors);
app.use(trainers);
app.use(users);
app.use(program);
app.use(gallery);
app.listen(constants.express.port, () => {});
