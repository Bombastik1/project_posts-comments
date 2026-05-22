const API_URL = 'https://project-posts-comments.onrender.com';

// Обробник події відправки форми реєстрації нового користувача
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const messageEl = document.getElementById('message');
    messageEl.style.color = 'red'; 
    messageEl.textContent = ''; 

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Первинна перевірка коректності введення даних на стороні клієнта
    if (name.length < 3) {
        messageEl.textContent = "Ім'я повинно містити не менше 3 символів";
        return;
    }

    if (password.length < 8) {
        messageEl.textContent = "Пароль повинен бути не менше 8 символів";
        return;
    }

    if (password !== confirmPassword) {
        messageEl.textContent = "Паролі не збігаються";
        return;
    }

    const body = { name, email, password, confirmPassword };

    try {
        // Направлення запиту для створення нового облікового запису
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            messageEl.textContent = `${data.message || 'Помилка реєстрації'}`;
            return;
        }
        
        messageEl.style.color = 'green';
        messageEl.textContent = 'Реєстрація успішна! Перенаправлення...';
        
        // Автоматичний редірект на головну сторінку після успішної операції
        setTimeout(() => window.location.href = 'index.html', 1000);
    } catch (error) {
        messageEl.textContent = 'Помилка з\'єднання з сервером';
    }
});