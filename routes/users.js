const express = require('express');
const { getUsers } = require('../controllers/userController');
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

module.exports = router;
