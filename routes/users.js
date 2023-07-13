const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  // валидируем параметры запроса
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    avatar: Joi.string().regex(URL_REGEX),
  }),
}), updateUserAvatar);

module.exports = router;
