module.exports = {
  auth: {
    key: process.env.key
  },
  express: {
    port: process.env.PORT || process.env.express_port
  },
  mysql: {
    host: process.env.mysql_host,
    username: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database
  }
};
