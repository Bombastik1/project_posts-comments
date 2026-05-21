const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Схема для збереження облікових записів користувачів у базі даних
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Ім’я обов’язкове'],
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email обов’язковий'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Некоректний формат email']
    },
    password: {
        type: String,
        required: [true, 'Пароль обов’язковий'],
        minlength: [8, 'Мінімум 8 символів'],
        select: false // Приховує поле при стандартних вибірках документів
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

// Асинхронне хешування пароля за допомогою bcrypt перед збереженням у базі даних
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('User', userSchema);