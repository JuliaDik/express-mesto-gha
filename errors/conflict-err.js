// Некорректный запрос от клиента к серверу
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
