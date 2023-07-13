// основная логика сервера
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors, Joi, celebrate } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const NotFoundError = require('./errors/not-found-err');
const { URL_REGEX } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();

// связанная с защитой настройка заголовков HTTP
app.use(helmet());

// лимитер запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// ограничение количества запросов к API
// предотвращение перегрузки сервера и снижения производительности приложения
app.use(limiter);

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
    avatar: Joi.string().regex(URL_REGEX),
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
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
