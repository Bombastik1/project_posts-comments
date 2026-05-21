const postService = require('../services/postService');
const catchAsync = require('../utils/catchAsync');

// Отримання всіх постів з підтримкою пагінації
exports.getAllPosts = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { posts, total } = await postService.getAllPosts(page, limit);

    res.status(200).json({
        success: true,
        data: posts,
        pagination: {
            total,
            count: posts.length,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        }
    });
});

// Створення нового поста поточним користувачем
exports.createPost = catchAsync(async (req, res, next) => {
    const post = await postService.createPost(req.body, req.user._id);
    res.status(201).json({ success: true, data: post });
});

// Отримання одного поста та всіх його коментарів за ID
exports.getPostById = catchAsync(async (req, res, next) => {
    const { post, comments } = await postService.getPostById(req.params.id);
    res.status(200).json({ success: true, data: { post, comments } });
});

// Оновлення текстового вмісту або заголовка поста його автором
exports.updatePost = catchAsync(async (req, res, next) => {
    const post = await postService.updatePost(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: post });
});

// Видалення поста та пов'язаних коментарів з перевіркою прав доступу
exports.deletePost = catchAsync(async (req, res, next) => {
    await postService.deletePost(req.params.id, req.user);
    res.status(200).json({ success: true, message: "Пост та коментарі успішно видалено" });
});

// Повнотекстовий пошук постів за ключовим запитом
exports.searchPosts = catchAsync(async (req, res, next) => {
    const posts = await postService.searchPosts(req.query.q);
    res.status(200).json({ success: true, count: posts.length, data: posts });
});