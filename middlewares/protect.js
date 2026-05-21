const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../errors/ApiError');
const catchAsync = require('../utils/catchAsync');

// Мідлвара для автентифікації користувача та захисту приватних маршрутів
const protect = catchAsync(async (req, res, next) => {
    let token;

    // Отримання токена з кук або заголовка Authorization
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ApiError('Ви не авторизовані. Будь ласка, увійдіть.', 401));
    }

    try {
        // Верифікація підпису та терміну дії JWT токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Перевірка наявності користувача в базі даних
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new ApiError('Користувач, якому належить цей токен, більше не існує.', 401));
        }

        // Збереження даних користувача в об'єкт запиту для подальшого використання
        req.user = currentUser;
        next();
    } catch (err) {
        return next(new ApiError('Невалідний токен або термін його дії закінчився.', 401));
    }
});

module.exports = protect;