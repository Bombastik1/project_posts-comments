const Comment = require('../models/Comment');
const Post = require('../models/Post');
const ApiError = require('../errors/ApiError');

// Сервіс для створення нового коментаря до публікації
exports.createComment = async (data, authorId) => {
    const { post, content } = data;
    
    // Перевірка існування поста, до якого додається коментар
    const postExists = await Post.findById(post);
    if (!postExists) {
        throw ApiError.notFound('Пост не знайдено');
    }

    const comment = await Comment.create({ 
        post, 
        author: authorId, 
        content 
    });
    return comment;
};

// Сервіс для отримання всіх коментарів публікації із заповненням даних про автора (populate)
exports.getCommentsByPost = async (postId) => {
    return await Comment.find({ post: postId })
        .populate('author', 'name')
        .sort({ createdAt: -1 }); // Сортування: спочатку новіші
};

// Сервіс для редагування тексту коментаря з перевіркою прав доступу
exports.updateComment = async (id, content, currentUser) => {
    const comment = await Comment.findById(id);

    if (!comment) {
        throw ApiError.notFound('Коментар не знайдено');
    }

    // Редагувати коментар може тільки його автор або адміністратор
    if (comment.author.toString() !== currentUser._id.toString() && currentUser.role !== 'admin') {
        throw new ApiError(403, 'Ви не маєте прав редагувати цей коментар');
    }

    comment.content = content;
    await comment.save();

    return comment;
};

// Сервіс для видалення коментаря з перевіркою прав доступу
exports.deleteComment = async (id, currentUser) => {
    const comment = await Comment.findById(id);
    if (!comment) {
        throw ApiError.notFound('Коментар не знайдено');
    }

    // Видалити коментар може тільки його автор або адміністратор
    if (comment.author.toString() !== currentUser._id.toString() && currentUser.role !== 'admin') {
        throw new ApiError(403, 'У вас немає прав на видалення цього коментаря');
    }

    await comment.deleteOne();
    return comment;
};