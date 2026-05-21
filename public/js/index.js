const API_URL = 'http://127.0.0.1:3000';
let currentUser = null;

// Перевірка стану автентифікації користувача та налаштування меню навігації
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        
        if (!response.ok) {
            console.log('Користувач не авторизований (гостьовий режим)');
            return;
        }

        const result = await response.json();
        if (result.success) {
            currentUser = result.data;
            document.getElementById('authMenu').style.display = 'none';
            document.getElementById('userMenu').style.display = 'inline';
            document.getElementById('logoutBtn').style.display = 'inline';
            
            const infoSpan = document.getElementById('userInfo');
            infoSpan.textContent = `@${currentUser.name} (${currentUser.role})`;
            infoSpan.style.display = 'inline';
        }
    } catch (err) {
        console.log('Помилка авторизації або роботи з сервером:', err.message);
    }
}

// Завантаження списку публікацій та пов'язаних коментарів із сервера
async function loadPosts() {
    try {
        const response = await fetch(`${API_URL}/api/posts`);
        const result = await response.json();
        
        const container = document.getElementById('postsList');
        
        if (!response.ok || !result.success || result.data.length === 0) {
            container.textContent = 'Постів ще немає. Опублікуйте щось першим!';
            return;
        }
        
        container.innerHTML = '';

        // Ітерація по завантажених постах та отримання детальних даних для кожного об'єкта
        for (const post of result.data) {
            const postRes = await fetch(`${API_URL}/api/posts/${post._id}`);
            const postData = await postRes.json();
            
            const activePost = postData.data.post;
            const comments = postData.data.comments || [];

            // Динамічна генерація HTML-структури для списку коментарів
            const commentsHtml = comments.map(c => {
                const isCommentOwner = currentUser && (currentUser._id === c.author?._id || currentUser.role === 'admin');
                const authorName = c.author?.name || 'Видалений користувач';

                return `
                    <div class="comment-item">
                        <div>
                            <span class="comment-author">@${authorName}:</span> ${c.content}
                        </div>
                        ${isCommentOwner ? `<button class="delete-comment-btn" onclick="deleteComment('${c._id}')">Видалити</button>` : ''}
                    </div>
                `;
            }).join('');

            // Генерація інтерактивної форми надсилання коментаря для авторизованих користувачів
            const formHtml = currentUser ? `
                <form class="comment-form" onsubmit="submitComment(event, '${activePost._id}')">
                    <input type="text" class="comment-input" placeholder="Напишіть коментар..." required>
                    <button type="submit" class="comment-btn">OK</button>
                </form>
            ` : '<p style="font-size:0.85em; color:gray; margin-top:10px;">Увійдіть в акаунт, щоб залишати коментарі.</p>';

            const canDeletePost = currentUser && (currentUser._id === activePost.author || currentUser.role === 'admin');
            const postCard = document.createElement('div');
            postCard.className = 'post-card';
            postCard.innerHTML = `
                <div class="post-header">
                    <h2 class="post-title">${activePost.title}</h2>
                    ${canDeletePost ? `<button class="delete-post-btn" onclick="deletePost('${activePost._id}')">Видалити пост</button>` : ''}
                </div>
                <p>${activePost.content}</p>
                <div class="post-tags">${activePost.tags.map(t => '<span>#' + t + '</span>').join('')}</div>
                <span class="post-meta">Створено: ${new Date(activePost.createdAt).toLocaleDateString()}</span>
                
                <div class="comments-section">
                    <h4>Коментарі (${comments.length})</h4>
                    <div class="comments-list">${commentsHtml || '<p style="color:gray; font-size:0.9em; margin:0;">Коментарів поки немає</p>'}</div>
                    ${formHtml}
                </div>
            `;
            container.appendChild(postCard);
        }
    } catch (error) {
        document.getElementById('postsList').textContent = 'Помилка завантаження даних з сервера';
    }
}

// Надсилання запиту на видалення публікації за її ID
async function deletePost(postId) {
    if (!confirm('Ви впевнені, що хочете видалити цей post разом із коментарями?')) return;
    try {
        const response = await fetch(`${API_URL}/api/posts/${postId}`, { method: 'DELETE', credentials: 'include' });
        const result = await response.json();
        if (response.ok && result.success) {
            loadPosts();
        } else {
            alert(result.message || 'Помилка при видаленні поста');
        }
    } catch (err) {
        alert('Помилка зв\'язку з сервером');
    }
}

// Надсилання запиту на видалення окремого коментаря за його ID
async function deleteComment(commentId) {
    if (!confirm('Ви впевнені, що хочете видалити цей коментар?')) return;
    try {
        const response = await fetch(`${API_URL}/api/comments/${commentId}`, { method: 'DELETE', credentials: 'include' });
        const result = await response.json();
        if (response.ok && result.success) {
            loadPosts();
        } else {
            alert(result.message || 'Помилка при видаленні коментаря');
        }
    } catch (err) {
        alert('Помилка зв\'язку з сервером');
    }
}

// Організація та відправка даних нової форми коментаря на сервер
async function submitComment(event, postId) {
    event.preventDefault();
    const form = event.target;
    const input = form.querySelector('.comment-input');
    const body = { post: postId, content: input.value };

    try {
        const response = await fetch(`${API_URL}/api/comments`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (response.ok) {
            input.value = '';
            loadPosts();
        } else {
            const data = await response.json();
            alert(data.message || 'Помилка при додаванні коментаря');
        }
    } catch (err) {
        alert('Помилка зв\'язку з сервером');
    }
}

// Обробник кліку на кнопку виходу для анулювання поточної сесії
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
        console.error(err);
    }
    window.location.reload();
});

// Точка входу: ініціалізація базових перевірок та завантаження інтерфейсу сторінки
async function init() {
    await checkAuth();
    await loadPosts();
}
init();