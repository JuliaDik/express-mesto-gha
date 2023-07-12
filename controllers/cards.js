const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  // обращение к БД: находим все карточки
  Card.find({})
    .then((cards) => {
      // ответ от БД: все карточки из БД
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  // тело запроса: извлекаем полученные данные о карточке
  const { name, link } = req.body;
  // временное решение авторизации: id пользователя (автора карточки)
  const userId = req.user._id;
  // обращение к БД: добавляем новую карточку,
  // включающую id пользователя (автора карточки)
  Card.create({ name, link, owner: userId })
    .then((card) => {
      // ответ от БД: новая карточка с переданными в теле запроса name, link
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

const deleteCardById = (req, res, next) => {
  // параметр запроса: извлекаем id карточки из url-адреса
  const { cardId } = req.params;
  // обращение к БД: находим карточку по id
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (card.owner !== req.user._id) {
        throw new ForbiddenError('Нельзя удалять карточки других пользователей');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки'));
        return;
      }
      next(err);
    });
};

const likeCard = (req, res, next) => {
  // параметр запроса: извлекаем id карточки из url-адреса
  const { cardId } = req.params;
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: находим карточку по id
  // и добавляем в массив лайков id пользователя, поставившего лайк
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      // ответ от БД: карточка с обновленным массивом лайков (+userId)
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
        return;
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  // параметр запроса: извлекаем id карточки из url-адреса
  const { cardId } = req.params;
  // id пользователя
  const userId = req.user._id;
  // обращение к БД: находим карточку по id
  // и удаляем из массива лайков id пользователя, убравшего лайк
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      // ответ от БД: карточка с обновленным массивом лайков (-userId)
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
