// Неверная авторизация или аутентификация пользователя (отказ в доступе)
class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
