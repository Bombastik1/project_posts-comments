const { body, param, query } = require('express-validator');

// Правила валідації для тіла запиту при створенні або оновленні поста
exports.createPostRules = [
    body('title')
        .trim()
        .notEmpty().withMessage('Заголовок обов’язковий')
        .isLength({ min: 3, max: 200 }).withMessage('Довжина заголовка: 3-200 символів'),
    body('content')
        .trim()
        .notEmpty().withMessage('Вміст обов’язковий')
        .isLength({ min: 10 }).withMessage('Мінімальна довжина вмісту — 10 символів'),
    body('tags')
        .optional()
        .isArray({ max: 10 }).withMessage('Максимальна кількість тегів — 10')
        .custom((tags) => {
            if (tags.some(tag => typeof tag !== 'string')) {
                throw new Error('Кожен тег має бути рядком');
            }
            return true;
        })
];

// Правила валідації для параметра пошукового запиту в URL
exports.searchPostsRules = [
    query('q')
        .trim()
        .notEmpty().withMessage('Параметр пошуку q обов’язковий')
        .isLength({ min: 2 }).withMessage('Мінімальна довжина запиту — 2 символи')
];

// Правила валідації для ідентифікатора об'єкта (ID) у параметрах маршруту
exports.mongoIdParamRule = [
    param('id').isMongoId().withMessage('Некоректний формат ID')
];

// Правила валідації параметрів пагінації у запиті
exports.getPostsRules = [
    query('page').optional().toInt().isInt({ min: 1 }).withMessage('page must be >= 1'),
    query('limit').optional().toInt().isInt({ min: 1, max: 100 }).withMessage('limit must be 1-100')
];