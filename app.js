const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const usersRouter = require('./routes/users');

// сервер взаимодействует с БД
mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
});

// сервер читает тело запроса req.body
app.use(bodyParser.json());
// сервер обрабатывает запросы по маршрутам
app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
