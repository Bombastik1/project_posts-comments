const postV = require('../middlewares/validators/postValidator');
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const validate = require('../middlewares/validate');
const commentV = require('../middlewares/validators/commentValidator');
const protect = require('../middlewares/protect');

// Маршрут для створення коментаря авторизованим користувачем
router.post('/', protect, commentV.createCommentRules, validate, commentController.createComment);

// Маршрут для отримання всіх коментарів до конкретного поста
router.get('/post/:postId', commentV.postIdParamRules, validate, commentController.getCommentsByPost);

// Маршрут для редагування власного коментаря за його ідентифікатором
router.put('/:id', protect, postV.mongoIdParamRule, validate, commentController.updateComment);

// Маршрут для видалення коментаря за його ідентифікатором
router.delete('/:id', protect, postV.mongoIdParamRule, validate, commentController.deleteComment);

module.exports = router;