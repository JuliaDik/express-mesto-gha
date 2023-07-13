const errorHandler = ((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  // 500 - внутренняя ошибка сервера (запрос не удалось выполнить)
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    // отправляем сообщение в зависимости от статуса
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

module.exports = errorHandler;
