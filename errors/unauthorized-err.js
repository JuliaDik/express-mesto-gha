const { UNAUTHORIZED_ERROR } = require('../utils/constants');

// Неверная авторизация или аутентификация пользователя (отказ в доступе)
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

module.exports = UnauthorizedError;
