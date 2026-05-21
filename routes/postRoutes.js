const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const validate = require('../middlewares/validate');
const postV = require('../middlewares/validators/postValidator');
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');

// Маршрути для отримання списку публікацій та повнотекстового пошуку (доступні всім)
router.get('/', postV.getPostsRules, validate, postController.getAllPosts);
router.get('/search', postV.searchPostsRules, validate, postController.searchPosts);
router.get('/:id', postV.mongoIdParamRule, validate, postController.getPostById);

// Маршрути для маніпуляцій з публікаціями (вимагають автентифікації користувача)
router.post('/', protect, postV.createPostRules, validate, postController.createPost);
router.put('/:id', protect, postV.mongoIdParamRule, validate, postController.updatePost);

// Маршрут для видалення публікації за її унікальним ідентифікатором (ID)
router.delete('/:id', protect, postV.mongoIdParamRule, validate, postController.deletePost);

module.exports = router;