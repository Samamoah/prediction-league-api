module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
  },
  test: {
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
