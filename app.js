const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

// сервер взаимодействует с БД
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// сервер читает тело запроса req.body
app.use(bodyParser.json());
// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '649b552ec21c46049d3d1964',
  };

  next();
});
// сервер обрабатывает запросы по маршрутам
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
