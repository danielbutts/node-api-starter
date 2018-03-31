const { getConnection } = require('../services/dbService');
const logger = require('winston');
const Joi = require('joi');

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

const getUserById = async (userId) => {
  const connection = await getConnection();
  console.log('userId', userId, parseInt(userId, 10));
  try {
    if (Number.isNaN(userId)) throw new Error('UserId must be a number');
    const result = await connection.query('SELECT * FROM users where id = $1 limit 1', [parseInt(userId, 10)]);
    if (result.rows.length === 0) throw new Error(`User ${userId} not found.`);
    connection.release();
    return result.rows[0];
  } catch (error) {
    connection.release();
    logger.error('query error', error.message, error.stack);
    throw error;
  }
};

const createUser = async (user) => {
  try {
    const schema = Joi.object().keys({
      userId: Joi.string().alphanum().min(3).max(30)
        .required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      firstName: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
      lastName: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
      email: Joi.string().email(),
    })
      .and('userId', 'password', 'firstName', 'lastName', 'email');

    const validUser = await Joi.validate(user, schema, (err, value) => {
      if (err) {
        logger.error(err);
        throw err;
      }
      return value;
    });

    const connection = await getConnection();

    const {
      userId,
      firstName,
      lastName,
      password,
      email,
    } = validUser;

    try {
      const result = await connection.query('INSERT INTO users(user_id, first_name, last_name, password, email) VALUES($1, $2, $3, $4, $5) RETURNING *', [userId,
        firstName,
        lastName,
        password,
        email]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      connection.release();
      logger.error('query error', error.message, error.stack);
    }
    return undefined;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
