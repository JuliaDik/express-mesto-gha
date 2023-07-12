const { NOT_FOUND_ERROR } = require('../utils/constants');

// Не найден запрашиваемый ресурс
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR;
  }
}

module.exports = NotFoundError;
