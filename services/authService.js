const User = require('../models/User');
const ApiError = require('../errors/ApiError');
const bcrypt = require('bcryptjs');

// Сервіс для реєстрації нового користувача в базі даних
exports.registerUser = async ({ name, email, password, confirmPassword }) => {
    // Перевірка збігу паролів перед початком реєстрації
    if (password !== confirmPassword) {
        throw ApiError.badRequest('Паролі не збігаються');
    }

    // Перевірка унікальності нікнейму користувача
    const existingName = await User.findOne({ name: name.toLowerCase().trim() });
    if (existingName) {
        throw new ApiError(409, 'Користувач із таким ім’ям вже існує');
    }

    // Перевірка унікальності електронної пошти
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
        throw new ApiError(409, 'Користувач із таким email вже існує');
    }

    // Створення нового документа користувача (пароль хешується в pre-save хуку моделі)
    const user = await User.create({ name, email, password });
    return user;
};

// Сервіс для автентифікації користувача та перевірки пароля
exports.loginUser = async ({ email, password }) => {
    // Явно вибираємо поле password, оскільки в схемі для нього встановлено select: false
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(401, 'Невірний email або пароль');
    }
    
    return user;
};