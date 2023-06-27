const User = require('../models/user');

const getUsers = (res) => {
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
  // параметр запроса: извлекаем id из url-адреса
  const { id } = req.params;
  // обращение к БД: находим пользователя по id
  User.findById(id)
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

module.exports = {
  getUsers,
  getUserById,
  createUser,
};
