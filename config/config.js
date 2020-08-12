require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_DATABASE,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
  },
  testing: {
    username: 'postgres',
    password: 12345,
    database: 'predictions',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
  },
  production: {
    username: 'postgres',
    password: 12345,
    database: 'predictions',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
  },
};
