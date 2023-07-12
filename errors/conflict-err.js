const { CONFLICT_ERROR } = require('../utils/constants');

// Некорректный запрос от клиента к серверу
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

module.exports = ConflictError;
