// основная логика сервера
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

// Запрашиваемый ресурс не найден
const NOT_FOUND_ERROR = 404;

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

// взаимодействие с базой данных
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// чтение потока JSON-данных из тела запроса
app.use(bodyParser.json());
// временное решение авторизации (id пользователя)
app.use((req, res, next) => {
  req.user = {
    _id: '649c9dbbf5c57bdc76e405f0',
  };

  next();
});
// обработка роутов
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Запрошен несуществующий роут' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
