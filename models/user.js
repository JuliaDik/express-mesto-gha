const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/unauthorized-err');
const { URL_REGEX } = require('../utils/constants');

// схема пользователя
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: (url) => URL_REGEX.test(url),
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => validator.isEmail(email),
  },
  password: {
    type: String,
    required: true,
    // по умолчанию хеш пароля пользователя не будет возвращаться из БД
    select: false,
  },
});

// в случае аутентификации разрешить возвращение хеша пароля пользователя из БД
userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  // поиск пользователя с указанной почтой
  // this — это модель User
  return this.findOne({ email }).select('+password')
    .then((user) => {
      // не нашелся — ошибка
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }

      // нашелся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          // не совпали - ошибка
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          // совпали - возвращаем объект пользователя
          return user;
        });
    });
};

// модель пользователя
const User = mongoose.model('user', userSchema);

module.exports = User;
