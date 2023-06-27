const User = require('../models/user');

const getUsers = (req, res) => {
  // обращение к БД: находим всех пользователей
  User.find({})
    // ответ от БД: все пользователи
    .then((users) => {
      res.send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  // параметр запроса: извлекаем id пользователя из url-адреса
  const { userId } = req.params;
  // обращение к БД: находим пользователя по id
  User.findById(userId)
    // ответ от БД: пользователь по конкретному id
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createUser = (req, res) => {
  // тело запроса: извлекаем полученные данные о пользователе
  const { name, about, avatar } = req.body;
  // обращение к БД: добавляем нового пользователя
  User.create({ name, about, avatar })
    // ответ от БД: новый пользователь
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateProfile = (req, res) => {
  // тело запроса: извлекаем данные об имени пользователя и информации о себе
  const { name, about } = req.body;
  // обращение к БД: находим пользователя по id и обновляем имя и информацию о себе
  User.findByIdAndUpdate(req.user._id, { name, about })
    // ответ от БД: пользователь с обновленным именем и информацией о себе
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  // тело запроса: извлекаем данные об аватаре пользователя
  const { avatar } = req.body;
  // обращение к БД: находим пользователя по id и обновляем аватар
  User.findByIdAndUpdate(req.user._id, { avatar })
    // ответ от БД: пользователь с обновленным аватаром
    .then((user) => {
      res.send(user);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
