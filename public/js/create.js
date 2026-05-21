const API_URL = 'http://127.0.0.1:3000';

// Перевірка сесії користувача та обмеження доступу до сторінки
async function checkAccess() {
    try {
        const response = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        if (!response.ok) {
            window.location.href = '/public/login.html';
        }
    } catch (err) {
        window.location.href = '/public/login.html';
    }
}

// Обробник події відправки форми створення публікації
document.getElementById('createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageEl = document.getElementById('message');
    messageEl.style.color = 'red'; 
    messageEl.textContent = ''; 

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const tagsInput = document.getElementById('tags').value;

    // Валідація даних на стороні клієнта перед відправкою запиту
    if (title.length < 3) {
        messageEl.textContent = "Довжина заголовка має бути не менше 3 символів";
        return;
    }

    if (content.length < 10) {
        messageEl.textContent = "Мінімальна довжина вмісту публікації — 10 символів";
        return;
    }

    // Перетворення рядка тегів у масив
    const tagsArray = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    const body = { title, content, tags: tagsArray };

    try {
        const response = await fetch(`${API_URL}/api/posts`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            messageEl.textContent = `${data.message || 'Помилка створення поста'}`;
            return;
        }
        
        messageEl.style.color = 'green';
        messageEl.textContent = 'Публікацію успішно додано! Повернення до стрічки...';
        setTimeout(() => window.location.href = '/public/index.html', 1000);
    } catch (error) {
        messageEl.textContent = 'Помилка з\'єднання з сервером';
    }
});

checkAccess();