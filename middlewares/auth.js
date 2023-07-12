const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorized-err');

const auth = (req, res, next) => {
  // извлекаем токен из кук
  const { token } = req.cookies;

  if (!token) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  let payload;
  try {
    // верифицируем токен
    // сравниваем текущий токен с токеном, выданным при авторизации
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }
  // добавить пейлоуд токена в объект запроса
  req.user = payload;
  next();
};

module.exports = auth;
