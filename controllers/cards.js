const Card = require('../models/card');

const getCards = (req, res) => {
  // обращение к БД: находим все карточки
  Card.find({})
    // ответ от БД: все карточки
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  // тело запроса: извлекаем полученные данные о карточке
  const { name, link } = req.body;
  const owner = req.user._id;
  // обращение к БД: добавляем новую карточку
  Card.create({ name, link, owner })
    // ответ от БД: новая карточка
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const deleteCardById = (req, res) => {
  // параметр запроса: извлекаем id карточки из url-адреса
  const { cardId } = req.params;
  // обращение к БД: находим карточку по id
  Card.findById(cardId)
    // ответ от БД: карточка по конкретному id
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  // параметр запроса: извлекаем id карточки из url-адреса
  const { cardId } = req.params;
  // обращение к БД: находим карточку по id и добавляем пользователя, поставившего лайк, в массив
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    // ответ от БД: карточка с обновленным массивом лайков (+)
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const dislikeCard = (req, res) => {
  // параметр запроса: извлекаем id карточки из url-адреса
  const { cardId } = req.params;
  // обращение к БД: находим карточку по id и удаляем пользователя, убравшего лайк, в массив
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    // ответ от БД: карточка с обновленным массивом лайков (-)
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
