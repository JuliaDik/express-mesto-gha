const Card = require('../models/card');
// Запрос от клиента к веб-серверу составлен некорректно
const BAD_REQUEST_ERROR = 400;
// Запрашиваемый ресурс не найден
const NOT_FOUND_ERROR = 404;
// Внутренняя ошибка сервера, запрос не удалось выполнить
const INTERNAL_SERVER_ERROR = 500;

const getCards = (req, res) => {
  // обращение к БД: находим все карточки
  Card.find({})
    .then((cards) => {
      // ответ от БД: все карточки из БД
      res.send(cards);
    })
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
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
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCardById = (req, res) => {
  // параметр запроса: извлекаем id карточки из url-адреса
  const { cardId } = req.params;
  // обращение к БД: находим карточку по id
  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Передан некорректный _id карточки' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => {
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
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      // ответ от БД: карточка с обновленным массивом лайков (+userId)
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({
            message: 'Переданы некорректные данные для постановки лайка',
          });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
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
        return res
          .status(NOT_FOUND_ERROR)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      // ответ от БД: карточка с обновленным массивом лайков (-userId)
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
