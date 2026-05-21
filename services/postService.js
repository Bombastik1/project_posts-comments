const Post = require('../models/Post');
const Comment = require('../models/Comment');
const ApiError = require('../errors/ApiError');

// Сервіс для отримання списку всіх постів із підтримкою пагінації
exports.getAllPosts = async (page, limit) => {
    const skip = (page - 1) * limit;
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Post.countDocuments();
    return { posts, total };
};

// Сервіс для створення нової публікації та прив'язки її до автора
exports.createPost = async (data, userId) => {
    return await Post.create({ ...data, author: userId });
};

// Сервіс для отримання детальної інформації про пост разом із його коментарями
exports.getPostById = async (id) => {
    const post = await Post.findById(id);
    if (!post) throw ApiError.notFound('Пост не знайдено');

    // Знаходимо коментарі до поста та підтягуємо імена авторів через populate
    const comments = await Comment.find({ post: id })
        .populate('author', 'name') 
        .sort({ createdAt: -1 });

    return { post, comments };
};

// Сервіс для оновлення полів публікації з перевіркою прав доступу
exports.updatePost = async (id, data, currentUser) => {
    const post = await Post.findById(id);
    if (!post) throw ApiError.notFound('Пост не знайдено');

    // Редагувати пост може тільки його автор або адміністратор
    if (post.author.toString() !== currentUser._id.toString() && currentUser.role !== 'admin') {
        throw new ApiError(403, 'Ви не маєте прав редагувати цей запис');
    }

    Object.assign(post, data);
    await post.save();
    return post;
};

// Сервіс для каскадного видалення публікації та всіх пов'язаних із нею коментарів
exports.deletePost = async (id, currentUser) => {
    const post = await Post.findById(id);
    if (!post) throw ApiError.notFound('Пост для видалення не знайдено');

    // Видалити пост може тільки його автор або адміністратор
    if (post.author.toString() !== currentUser._id.toString() && currentUser.role !== 'admin') {
        throw new ApiError(403, 'У вас немає прав на видалення цього поста');
    }

    // Видалення залежних документів (коментарів) з колекції
    await Comment.deleteMany({ post: id });
    // Видалення основного документа (поста)
    await post.deleteOne();
    return post;
};

// Сервіс для релевантного повнотекстового пошуку публікацій за текстовим індексом MongoDB
exports.searchPosts = async (q) => {
    return await Post.find(
        { $text: { $search: q } },
        { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
};