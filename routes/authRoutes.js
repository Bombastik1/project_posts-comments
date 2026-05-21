const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const protect = require('../middlewares/protect');

// Маршрут для реєстрації нових користувачів
router.post('/register', register);

// Маршрут для автентифікації (входу) існуючих користувачів
router.post('/login', login);

// Маршрут для завершення сесії користувача та видалення токена
router.post('/logout', protect, logout); 

// Маршрут для отримання даних профілю поточного автентифікованого користувача
router.get('/me', protect, getMe);

module.exports = router;