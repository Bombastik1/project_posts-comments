const mongoose = require('mongoose');

// Схема для збереження публікацій (постів) у базі даних
const postSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Заголовок обов'язковий"],
        trim: true,
        maxlength: [200, 'Заголовок занадто довгий']
    },
    content: { 
        type: String, 
        required: [true, "Вміст обов'язковий"],
        minlength: [10, 'Вміст має бути не менше 10 символів']
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Пост повинен мати автора']
    },
    tags: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Створення текстового індексу для виконання повнотекстового пошуку за полями title та content
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);