const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const getUsers = (req, res, next) => {
  // обращение к БД: находим всех пользователей
  User.find({})
    .then((users) => {
      // ответ от БД: все пользователи из базы данных
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: найти пользователя по id
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      // ответ от БД: текущий пользователь по переданному _id
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
        return;
      }
      next(err);
    });
};

const getUserById = (req, res, next) => {
  // параметр запроса: извлекаем id пользователя из url-адреса
  const { userId } = req.params;
  // обращение к БД: находим пользователя по id
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      // ответ от БД: пользователь по переданному _id
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  // тело запроса: извлекаем полученные данные о пользователе
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
  // обращение к БД: добавляем нового пользователя
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      // ответ от БД: новый пользователь с переданными в теле запроса name, about, avatar
      res.send(user._id, name, about, avatar, email);
    })
    .catch((err) => {
      // если пользователь пытается зарегистрироваться по уже существующему в БД email
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
        return;
      }
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  // тело запроса: извлекаем данные об имени пользователя и информации о нем
  const { name, about } = req.body;
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: находим пользователя по id и обновляем его имя и информацию о нем
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      // ответ от БД: пользователь с обновленной информацией
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
        return;
      }
      next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  // тело запроса: извлекаем данные об аватаре пользователя
  const { avatar } = req.body;
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: находим пользователя по id и обновляем аватар
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      // ответ от БД: пользователь с обновленным аватаром
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  // тело запроса: извлекаем почту и пароль пользователя
  const { email, password } = req.body;

  // обращение к БД: найти пользователя по учетным данным (почта и пароль)
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // после успешной авторизации (почта и пароль правильные)
      // создать токен
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        // период действия токена (7 дней)
        { expiresIn: '7d' },
      );
      // ответ от БД: сохраненный в куках браузера токен пользователя
      // защита токена от XSS-атак
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          // браузер посылает куки,
          // только если запрос сделан с того же домена
          sameSite: true,
        })
        .send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
};
