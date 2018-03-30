const { getConnection } = require('../services/dbService');
const logger = require('winston');

const getUsers = async () => {
  const connection = await getConnection();

  try {
    const result = await connection.query('SELECT * FROM users');
    connection.release();
    return result.rows;
  } catch (error) {
    connection.release();
    logger.error('query error', error.message, error.stack);
  }
  return undefined;
};

module.exports = {
  getUsers,
};
