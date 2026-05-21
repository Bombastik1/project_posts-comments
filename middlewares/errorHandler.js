const ApiError = require('../errors/ApiError');

// Глобальний обробник помилок для всього додатка Express
module.exports = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Внутрішня помилка сервера';
    let errors = err.errors || [];

    // Обробка виключних ситуацій валідації схеми Mongoose
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errors = Object.values(err.errors).map(e => ({ field: e.path, msg: e.message }));
        // Встановлення першого повідомлення про помилку як основного
        message = errors[0].msg;
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors
    });
};