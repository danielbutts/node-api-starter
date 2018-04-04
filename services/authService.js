const crypto = require('crypto');

const createSalt = length => crypto.randomBytes(Math.ceil(length / 2))
  .toString('hex')
  .slice(0, length);

const hashPassword = (password) => {
  const salt = createSalt(64);
  crypto.DEFAULT_ENCODING = 'hex';
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');
  return { salt, hash };
};

module.exports = {
  hashPassword,
};
