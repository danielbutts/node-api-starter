const express = require('express');
const { getUsers, createUser } = require('../controllers/userController');
const logger = require('winston');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    res.send({ users });
  } catch (error) {
    logger.error(error);
  }
});

/* Create new user. */
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const users = await createUser(req.body);
    res.send({ users });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;
