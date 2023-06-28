const User = require('../models/user');
// Запрос от клиента к веб-серверу составлен некорректно
const BAD_REQUEST = 400;
// Запрашиваемый ресурс не найден
const NOT_FOUND = 404;
// Внутренняя ошибка сервера, запрос не удалось выполнить
const INTERNAL_SERVER_ERROR = 500;

const getUsers = (req, res) => {
  // обращение к БД: находим всех пользователей
  User.find({})
    .then((users) => {
      if (!users) {
        return res.status(NOT_FOUND).send({ message: 'Пользователи не найдены' });
      }
      // ответ от БД: все пользователи
      return res.send(users);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  // параметр запроса: извлекаем id пользователя из url-адреса
  const { userId } = req.params;
  // обращение к БД: находим пользователя по id
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      // ответ от БД: пользователь с запрашиваемым id
      return res.send(user);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  // тело запроса: извлекаем полученные данные о пользователе
  const { name, about, avatar } = req.body;
  // обращение к БД: добавляем нового пользователя
  User.create({ name, about, avatar })
    .then((user) => {
      if (!name || !about || !avatar) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы не все данные' });
      }
      // ответ от БД: новый пользователь
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateProfile = (req, res) => {
  // тело запроса: извлекаем данные об имени пользователя и информации о нем
  const { name, about } = req.body;
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: находим пользователя по id и обновляем его имя и информацию о нем
  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      // ответ от БД: пользователь с обновленным именем и информацией о нем
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  // тело запроса: извлекаем данные об аватаре пользователя
  const { avatar } = req.body;
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: находим пользователя по id и обновляем аватар
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      // ответ от БД: пользователь с обновленным аватаром
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
