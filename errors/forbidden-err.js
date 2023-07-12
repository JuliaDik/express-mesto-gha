const { FORBIDDEN_ERROR } = require('../utils/constants');

// Запрещен доступ к ресурсу
class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR;
  }
}

module.exports = ForbiddenError;
