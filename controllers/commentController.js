const commentService = require('../services/commentService');
const catchAsync = require('../utils/catchAsync');

// Створення нового коментаря користувачем
exports.createComment = catchAsync(async (req, res, next) => {
    const comment = await commentService.createComment(req.body, req.user._id);
    
    res.status(201).json({
        success: true,
        data: comment
    });
});

// Отримання списку всіх коментарів, прив'язаних до конкретного поста
exports.getCommentsByPost = catchAsync(async (req, res, next) => {
    const comments = await commentService.getCommentsByPost(req.params.postId);
    
    res.status(200).json({
        success: true,
        count: comments.length,
        data: comments
    });
});

// Редагування текстового вмісту існуючого коментаря
exports.updateComment = catchAsync(async (req, res, next) => {
    const comment = await commentService.updateComment(req.params.id, req.body.content, req.user);

    res.status(200).json({
        success: true,
        data: comment
    });
});

// Видалення коментаря за його ідентифікатором
exports.deleteComment = catchAsync(async (req, res, next) => {
    await commentService.deleteComment(req.params.id, req.user);
    
    res.status(200).json({
        success: true,
        message: 'Коментар успішно видалено'
    });
});