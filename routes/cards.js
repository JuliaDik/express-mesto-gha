const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');

const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URL_REGEX),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  // валидируем параметры запроса
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCardById);

router.put('/:cardId/likes', celebrate({
  // валидируем параметры запроса
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  // валидируем параметры запроса
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = router;
