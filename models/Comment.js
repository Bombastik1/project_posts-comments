const mongoose = require('mongoose');

// Схема для збереження коментарів у базі даних
const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, "Пост обов'язковий"]
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Автор обов’язковий']
    },
    content: { 
        type: String, 
        required: [true, "Вміст обов'язковий"], 
        maxlength: 1000 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Comment', commentSchema);