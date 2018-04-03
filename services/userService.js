const { getConnection } = require('../services/dbService');
const logger = require('winston');

const getUserByName = async (name) => {
  const connection = await getConnection();
  try {
    const result = await connection.query('SELECT * FROM users WHERE username = $1 limit 1', [name]);
    connection.release();
    if (result.rows.length === 0) return undefined;
    return result.rows[0];
  } catch (err) {
    connection.release();
    logger.error(err.message);
    throw err;
  }
};

const getUserById = async (id) => {
  const connection = await getConnection();
  try {
    const result = await connection.query('SELECT * FROM users WHERE id = $1 limit 1', [id]);
    connection.release();
    if (result.rows.length === 0) return undefined;
    return result.rows[0];
  } catch (err) {
    connection.release();
    logger.error(err.message);
    throw err;
  }
};

const deleteUser = async (id) => {
  const connection = await getConnection();
  try {
    const result = await connection.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    connection.release();
    if (result.rows.length === 0) return undefined;
    return result.rows[0];
  } catch (err) {
    connection.release();
    logger.error(err.message);
    throw err;
  }
};

const getUsers = async () => {
  const connection = await getConnection();
  try {
    const result = await connection.query('SELECT * FROM users');
    connection.release();
    return result.rows;
  } catch (error) {
    connection.release();
    logger.error('query error', error.message, error.stack);
    throw error;
  }
};

const createUser = async (user) => {
  const connection = await getConnection();

  const {
    username,
    firstName,
    lastName,
    password,
    email,
  } = user;

  try {
    const result = await connection.query('INSERT INTO users(username, first_name, last_name, password, email) VALUES($1, $2, $3, $4, $5) RETURNING *', [username,
      firstName,
      lastName,
      password,
      email]);
    connection.release();
    return result.rows[0];
  } catch (error) {
    connection.release();
    logger.error('query error', error.message, error.stack);
    throw error;
  }
};

module.exports = {
  getUserByName,
  getUsers,
  getUserById,
  createUser,
  deleteUser,
};
