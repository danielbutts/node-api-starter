const userService = require('../services/userService');
const logger = require('winston');
const Joi = require('joi');

const USER_ID_SCHEMA = {
  userId: Joi.number().min(0).precision(0)
    .required(),
};

const getUsers = async () => {
  const users = await userService.getUsers();
  return users;
};

const getUserById = async (userId) => {
  const { error, value } = Joi.validate({ userId }, USER_ID_SCHEMA);
  if (error) {
    logger.error(error.message);
    throw error;
  }

  const user = await userService.getUserById(value.userId);
  return user;
};

const deleteUser = async (userId) => {
  const { error, value } = Joi.validate({ userId }, USER_ID_SCHEMA);
  if (error) {
    logger.error(error.message);
    throw error;
  }

  const user = await userService.deleteUser(value.userId);
  return user;
};

const createUser = async (user) => {
  try {
    const schema = Joi.object().keys({
      username: Joi.string().alphanum().min(3).max(30)
        .required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      firstName: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
      lastName: Joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
      email: Joi.string().email(),
    }).and('username', 'password', 'firstName', 'lastName', 'email');

    const { error: err, value: validUser } = Joi.validate(user, schema);
    if (err) throw err;

    const existingUser = await userService.getUserByName(validUser.username);
    if (existingUser) throw new Error(`Username ${validUser.username} already exists.`);

    const newUser = userService.createUser(user);
    return newUser;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
};
