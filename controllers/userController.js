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
  }
  return undefined;
};

const getUserById = async (userId) => {
  const connection = await getConnection();

  try {
    const result = await connection.query('SELECT * FROM users where user_id = $1 limit 1', [userId]);
    connection.release();
    return result.rows[0];
  } catch (error) {
    connection.release();
    logger.error('query error', error.message, error.stack);
  }
  return undefined;
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
        console.log(err);
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
