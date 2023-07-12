const { BAD_REQUEST_ERROR } = require('../utils/constants');

// Некорректный запрос от клиента к серверу
class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR;
  }
}

module.exports = BadRequestError;
