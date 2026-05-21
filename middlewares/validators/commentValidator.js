const { body, param } = require('express-validator');

// Правила валідації для тіла запиту при створенні коментаря
exports.createCommentRules = [
    body('post')
        .notEmpty().withMessage('ID поста обов’язковий')
        .isMongoId().withMessage('Некоректний формат ID поста'),
    body('content')
        .trim()
        .notEmpty().withMessage('Контент обов’язковий')
        .isLength({ min: 1, max: 1000 }).withMessage('Максимум 1000 символів')
];

// Правила валідації для параметра ID поста в URL-рядку
exports.postIdParamRules = [
    param('postId').isMongoId().withMessage('Некоректний формат ID поста')
];