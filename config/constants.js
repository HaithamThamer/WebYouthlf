module.exports = {
  auth: {
    key: process.env.key
  },
  express: {
    port: process.env.PORT || process.env.REST_API_PORT
  },
  mysql: {
    host: process.env.mysql_host,
    username: process.env.mysql_username,
    password: process.env.mysql_password,
    database: process.env.mysql_database
  },
  Server: {
    REST_API: process.env.REST_API,
    CDN: process.env.CDN
  },
  oneSignal: {
    AppId: process.env.oneSignal_appId,
    RestApi: process.env.oneSignal_restApi
  },
  mail: {
    host: process.env.mail_host,
    port: process.env.mail_port,
    user: process.env.mail_user,
    pass: process.env.mail_pass
  }
};
