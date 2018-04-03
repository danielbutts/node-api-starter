const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} = require('../controllers/userController');
const logger = require('winston');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    res.send({ users });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: error.message });
  }
});

/* GET user by Id. */
router.get('/:userId', async (req, res) => {
  let { userId } = req.params;
  userId = parseInt(userId, 10);
  try {
    const user = await getUserById(userId);
    res.send({ user });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: error.message });
  }
});

/* POST - create new user. */
router.post('/', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.send({ user });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: error.message });
  }
});

/* DELETE - delete user. */
router.delete('/:userId', async (req, res) => {
  let { userId } = req.params;
  userId = parseInt(userId, 10);
  try {
    const user = await deleteUser(userId);
    res.send({ user });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
