// Клас для обробки специфічних помилок API, що наслідується від вбудованого класу Error
class ApiError extends Error {
    constructor(statusCode, message, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        // Визначення статусу: 'fail' для помилок клієнта (4xx) або 'error' для помилок сервера (5xx)
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    }

    // Статичний метод для генерації помилки 400 Bad Request
    static badRequest(message, errors) {
        return new ApiError(400, message, errors);
    }

    // Статичний метод для генерації помилки 404 Not Found
    static notFound(message = 'Ресурс не знайдено') {
        return new ApiError(404, message);
    }
}

module.exports = ApiError;