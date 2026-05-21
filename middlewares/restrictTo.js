const ApiError = require('../errors/ApiError');

// Мідлвара для обмеження доступу до маршрутів на основі ролей користувачів
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // Перевірка наявності ролі поточного користувача у списку дозволених ролей
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, 'У вас немає прав для цієї дії');
        }
        next();
    };
};

module.exports = restrictTo;