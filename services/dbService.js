const pg = require('pg');
const logger = require('winston');

require('dotenv').config();

const dbName = process.env.DB_NAME || null;
const dbHost = process.env.DB_HOST || null;
const dbPort = process.env.DB_PORT || null;
const dbUser = process.env.DB_USER || null;
const dbPassword = process.env.DB_PASSWORD || null;

const config = {
  user: dbUser,
  database: dbName,
  password: dbPassword,
  host: dbHost,
  port: dbPort,
};


const getConnection = async () => {
  try {
    const pool = await new pg.Pool(config);
    return pool.connect();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = {
  getConnection,
};
