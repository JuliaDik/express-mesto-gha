// Запрос от клиента к веб-серверу составлен некорректно
const BAD_REQUEST_ERROR = 400;
// Запрашиваемый ресурс не найден
const NOT_FOUND_ERROR = 404;
// Внутренняя ошибка сервера, запрос не удалось выполнить
const INTERNAL_SERVER_ERROR = 500;

const JWT_SECRET = '319036bb4d7267557b163a1c091980775e8f4571eae39854c58a70a5a6abc999';

module.exports = {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  INTERNAL_SERVER_ERROR,
  JWT_SECRET,
};
