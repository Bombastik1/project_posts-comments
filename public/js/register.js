const API_URL = 'https://project-posts-comments.onrender.com';

// Отримуємо елементи форми та текстовий блок для виведення помилок
const registerForm = document.getElementById('registerForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const messageEl = document.getElementById('message');
const submitBtn = registerForm.querySelector('button[type="submit"]');

/**
 * Функція валідації окремого поля в реальному часі.
 * Додає відповідні CSS-класи підсвічування меж.
 */
function validateField(inputElement, isValid) {
    // Якщо поле порожнє, знімаємо всі класи підсвічування
    if (inputElement.value.trim() === '') {
        inputElement.classList.remove('valid', 'error');
        return false;
    }

    if (isValid) {
        inputElement.classList.add('valid');
        inputElement.classList.remove('error');
        return true;
    } else {
        inputElement.classList.add('error');
        inputElement.classList.remove('valid');
        return false;
    }
}

/**
 * Головна функція життєвого циклу валідації форми.
 * Перевіряє всі поля одночасно та керує станом доступності кнопки відправки.
 */
function validateFormLifecycle() {
    // 1. Валідація імені (нікнейму) — мінімум 3 символи
    const isNameValid = nameInput.value.trim().length >= 3;
    validateField(nameInput, isNameValid);

    // 2. Валідація email через регулярний вираз
    const emailRegex = /^\S+@\S+\.\S+$/;
    const isEmailValid = emailRegex.test(emailInput.value.trim());
    validateField(emailInput, isEmailValid);

    // 3. Валідація пароля — мінімум 8 символів (відповідно до схеми Mongoose)
    const isPasswordValid = passwordInput.value.length >= 8;
    validateField(passwordInput, isPasswordValid);

    // 4. Валідація підтвердження пароля — збіг із першим полем
    const isConfirmValid = passwordInput.value === confirmInput.value && confirmInput.value !== '';
    validateField(confirmInput, isConfirmValid);

    // Керування станом кнопки відправки форми (Submit)
    // Кнопка заблокована (disabled = true), якщо хоча б одне поле не пройшло перевірку
    submitBtn.disabled = !(isNameValid && isEmailValid && isPasswordValid && isConfirmValid);
}

// Навішуємо прослуховувач події 'input' на кожне поле для миттєвої перевірки при введенні символів
[nameInput, emailInput, passwordInput, confirmInput].forEach(input => {
    input.addEventListener('input', validateFormLifecycle);
});

// Обробник події безпосереднього надсилання форми на сервер
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Скидаємо попередні повідомлення про помилки
    messageEl.style.color = 'red'; 
    messageEl.textContent = ''; 

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;

    const body = { name, email, password, confirmPassword };

    try {
        // Направлення асинхронного запиту для створення нового облікового запису
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            credentials: 'include', // Дозволяє крос-доменне збереження cookie від сервера Render
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        // Обробка серверних помилок валідації (Status 400 / 409 / 500)
        if (!response.ok) {
            // Якщо сервер повернув масив помилок валідації express-validator, виводимо першу
            if (data.errors && data.errors.length > 0) {
                messageEl.textContent = data.errors[0].msg;
            } else {
                messageEl.textContent = data.message || 'Помилка реєстрації';
            }
            return;
        }
        
        // Сценарій успішного виконання операції
        messageEl.style.color = 'green';
        messageEl.textContent = 'Реєстрація успішна! Перенаправлення...';
        
        // Автоматичний редірект на головну сторінку додатка
        setTimeout(() => window.location.href = 'index.html', 1000);
    } catch (error) {
        messageEl.textContent = 'Помилка з\'єднання з сервером';
    }
});

// Первинний запуск перевірки при завантаженні сторінки (щоб кнопка від початку була заблокована)
validateFormLifecycle();