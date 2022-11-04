require('dotenv').config();

module.exports = {
  development: {
    uusername: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    dialectOptions: {
      multipleStatements: true,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    dialectOptions: {
      multipleStatements: true,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }
}