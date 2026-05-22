const API_URL = 'https://project-posts-comments.onrender.com';

// Обробник події відправки форми авторизації
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const body = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        // Відправка запиту на автентифікацію користувача
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            credentials: 'include', // Дозволяє передачу та збереження cookie від сервера
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            document.getElementById('message').textContent = data.message || 'Невірний вхід';
            return;
        }
        
        // Перенаправлення на головну сторінку у разі успішної авторизації
        window.location.href = 'index.html';
    } catch (error) {
        document.getElementById('message').textContent = 'Помилка з\'єднання з сервером';
    }
});