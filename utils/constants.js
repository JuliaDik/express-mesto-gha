// Запрос от клиента к веб-серверу составлен некорректно
const BAD_REQUEST_ERROR = 400;
// Запрашиваемый ресурс не найден
const NOT_FOUND_ERROR = 404;
// Внутренняя ошибка сервера, запрос не удалось выполнить
const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
};
