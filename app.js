// основная логика сервера
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors, Joi, celebrate } = require('celebrate');
const URL_REGEX = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env;

const app = express();

// связанная с защитой настройка заголовков HTTP
app.use(helmet());

// взаимодействие с базой данных
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// чтение потока JSON-данных из тела запроса
app.use(bodyParser.json());

// чтение кук
app.use(cookieParser());

// роут регистрации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegExp(URL_REGEX)),
  }),
}), createUser);

// роут авторизации
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// защита авторизацией всех маршрутов, кроме регистрации и авторизации
app.use(auth);

// роут пользователя
app.use('/users', usersRouter);

// роут карточек
app.use('/cards', cardsRouter);

// несуществующий роут
app.use('/*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый роут не найден'));
});

// обработка ошибок celebrate
app.use(errors());

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
