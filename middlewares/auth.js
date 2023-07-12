const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorized-err');

const auth = (req, res, next) => {
  try {
    // извлекаем токен из кук
    const { token } = req.cookies;

    if (!token) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    let payload;
    try {
      // верифицируем токен
      // сравниваем текущий токен с токеном, выданным при авторизации
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedError('Необходима авторизация');
    }
    // добавить пейлоуд токена в объект запроса
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
