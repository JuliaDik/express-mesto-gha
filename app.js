// основная логика сервера
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { NOT_FOUND_ERROR } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

// взаимодействие с базой данных
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// чтение потока JSON-данных из тела запроса
app.use(bodyParser.json());

// роут регистрации
app.post('/signup', createUser);

// роут авторизации
app.post('/signin', login);

// защита авторизацией всех маршрутов, кроме регистрации и авторизации
app.use(auth);

// роут пользователя
app.use('/users', usersRouter);

// роут карточек
app.use('/cards', cardsRouter);

// несуществующий роут
app.use('/*', (req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: 'Запрошен несуществующий роут' });
});

// централизованная обработка ошибок
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  // 500 - внутренняя ошибка сервера (запрос не удалось выполнить)
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    // отправляем сообщение в зависимости от статуса
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
