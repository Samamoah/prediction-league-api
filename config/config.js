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
        username: process.env.DEV_DB_USERNAME,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_DATABASE,
        host: '127.0.0.1',
        dialect: 'postgres',
        operatorsAliases: false,
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,

        host: process.env.DB_HOST,
        port: "5432",
        dialect: 'postgres',
        operatorsAliases: false,
        dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
    },
};
