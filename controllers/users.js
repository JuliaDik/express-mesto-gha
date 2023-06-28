const User = require('../models/user');
// Запрос от клиента к веб-серверу составлен некорректно
const BAD_REQUEST_ERROR = 400;
// Запрашиваемый ресурс не найден
const NOT_FOUND_ERROR = 404;
// Внутренняя ошибка сервера, запрос не удалось выполнить
const INTERNAL_SERVER_ERROR = 500;

const getUsers = (req, res) => {
  // обращение к БД: находим всех пользователей
  User.find({})
    .then((users) => {
      // ответ от БД: все пользователи из базы данных
      res.send(users);
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  // параметр запроса: извлекаем id пользователя из url-адреса
  const { userId } = req.params;
  // обращение к БД: находим пользователя по id
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      // ответ от БД: пользователь по переданному _id
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Передан некорректный _id пользователя' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  // тело запроса: извлекаем полученные данные о пользователе
  const { name, about, avatar } = req.body;
  // обращение к БД: добавляем нового пользователя
  User.create({ name, about, avatar })
    .then((user) => {
      // ответ от БД: новый пользователь с переданными в теле запроса name, about, avatar
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные при создании пользователя',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserInfo = (req, res) => {
  // тело запроса: извлекаем данные об имени пользователя и информации о нем
  const { name, about } = req.body;
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: находим пользователя по id и обновляем его имя и информацию о нем
  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      // ответ от БД: пользователь с обновленной информацией
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные при обновлении профиля',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserAvatar = (req, res) => {
  // тело запроса: извлекаем данные об аватаре пользователя
  const { avatar } = req.body;
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: находим пользователя по id и обновляем аватар
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
      // ответ от БД: пользователь с обновленным аватаром
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные при обновлении аватара',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
