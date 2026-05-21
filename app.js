const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/database');

const errorHandler = require('./middlewares/errorHandler');
const ApiError = require('./errors/ApiError');

const app = express();

const authRoutes = require('./routes/authRoutes');

// Ініціалізація підключення до бази даних MongoDB
connectDB();

// Налаштування CORS політики для взаємодії з клієнтською частиною
app.use(cors({
    // Дозволяємо запити з адреси клієнта, зазначеної в .env, або за замовчуванням з localhost:5500
    origin: process.env.CLIENT_URL || 'http://localhost:5500',
    credentials: true // Дозволяє обмін куками (наприклад, токенами авторизації) між сервером та клієнтом
}));

// Мідлвари для парсингу вхідних даних запиту
app.use(express.json()); // Обробка тіла запиту у форматі JSON
app.use(cookieParser()); // Обробка та парсинг кук, що надходять від клієнта

// Підключення маршрутів (роутерів) додатку
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/auth', authRoutes);

// Обробка неіснуючих маршрутів (якщо жоден роутер вище не збігся із запитом)
app.use((req, res, next) => {
    // Передаємо кастомну помилку 404 далі в глобальний обробник
    next(ApiError.notFound(`Маршрут ${req.originalUrl} не знайдено на цьому сервері!`));
});

// Підключення глобального обробника помилок (має бути підключений останнім через app.use)
app.use(errorHandler);

// Запуск сервера на прослуховування портів
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер на порту ${PORT}`);
});