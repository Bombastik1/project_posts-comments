const authService = require('../services/authService');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

// Генерація JWT токена на основі ID та ролі користувача
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

// Конфігурація файлів cookie для збереження токена безпеки
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3 * 24 * 60 * 60 * 1000
};

// Реєстрація нового користувача
exports.register = catchAsync(async (req, res, next) => {
    const user = await authService.registerUser(req.body);
    const token = generateToken(user._id, user.role);

    res.cookie('token', token, cookieOptions);

    res.status(201).json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
});

// Авторизація існуючого користувача
exports.login = catchAsync(async (req, res, next) => {
    const user = await authService.loginUser(req.body);
    const token = generateToken(user._id, user.role);

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
});

// Завершення сесії користувача та видалення cookie
exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
    res.status(200).json({
        success: true,
        message: 'Вихід виконано успішно'
    });
});

// Отримання профілю поточного автентифікованого користувача
exports.getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
        data: req.user
    });
});