const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');

const getCards = (req, res, next) => {
  // ОБРАЩЕНИЕ К БД: найти все карточки
  Card.find({})
    // ОТВЕТ ОТ БД: все карточки
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  // ТЕЛО ЗАПРОСА: получаем name и link карточки
  const { name, link } = req.body;
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД: добавить новую карточку с указанием id пользователя-автора карточки
  Card.create({ name, link, owner: userId })
    // ОТВЕТ ОТ БД: новая карточка
    // сервер успешно обработал запрос и создал новый ресурс
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

const deleteCardById = (req, res, next) => {
  // ПАРАМЕТРЫ ЗАПРОСА: получаем id карточки из url-адреса
  const { cardId } = req.params;
  // ОБРАЩЕНИЕ К БД: найти карточку по id и удалить
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить карточку другого пользователя');
      }
      return card.deleteOne();
    })
    .then(() => res.send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  // ПАРАМЕТРЫ ЗАПРОСА: получаем id карточки из url-адреса
  const { cardId } = req.params;
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД:
  // найти карточку по id
  // добавить в массив лайков id пользователя-автора лайка
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      // ОТВЕТ ОТ БД: карточка с обновленным массивом лайков (+userId)
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  // ПАРАМЕТРЫ ЗАПРОСА: получаем id карточки из url-адреса
  const { cardId } = req.params;
  const userId = req.user._id;
  // ОБРАЩЕНИЕ К БД:
  // найти карточку по id
  // удалить из массива лайков id пользователя-автора дизлайка
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      // ОТВЕТ ОТ БД: карточка с обновленным массивом лайков (-userId)
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для снятия лайка'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
