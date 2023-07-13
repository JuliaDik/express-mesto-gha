const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/constants');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');

const getUsers = (req, res, next) => {
  // ОБРАЩЕНИЕ К БД: найти всех пользователей
  User.find({})
    // ОТВЕТ ОТ БД: все пользователи
    .then((users) => res.send(users))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти текущего пользователя по id
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      // ОТВЕТ ОТ БД: текущий пользователь
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      return next(err);
    });
};

const getUserById = (req, res, next) => {
  // ПАРАМЕТРЫ ЗАПРОСА: получаем id пользователя из url-адреса
  const { userId } = req.params;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      // ОТВЕТ ОТ БД: пользователь
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id пользователя'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  // ТЕЛО ЗАПРОСА: получаем все данные пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
  // ОБРАЩЕНИЕ К БД: добавить нового пользователя
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // ОТВЕТ ОТ БД: новый пользователь (возвращается все, кроме пароля)
    // сервер успешно обработал запрос и создал новый ресурс
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      // если пользователь пытается зарегистрироваться по уже существующему в БД email
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  // ТЕЛО ЗАПРОСА: получаем name и about пользователя
  const { name, about } = req.body;
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id и заменить name и about
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      // ОТВЕТ ОТ БД: пользователь с обновленными name и about
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

const updateUserAvatar = (req, res, next) => {
  // ТЕЛО ЗАПРОСА: получаем avatar пользователя
  const { avatar } = req.body;
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: найти пользователя по id и заменить avatar
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      // ОТВЕТ ОТ БД: пользователь с обновленным avatar
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  // ТЕЛО ЗАПРОСА: получаем email и password пользователя
  const { email, password } = req.body;
  // ОБРАЩЕНИЕ К БД: найти пользователя по учетным данным (почта и пароль)
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
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        // браузер посылает куки,
        // только если запрос сделан с того же домена
        sameSite: true,
      });
      // ОТВЕТ ОТ БД: токен пользователя, сохраненный в куках браузера
      res.send({ token });
    })
    .catch(next);
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
