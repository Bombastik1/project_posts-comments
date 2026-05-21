const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Підключення до бази даних за допомогою рядка з'єднання з .env
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB підключено: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Помилка підключення: ${err.message}`);
        // Критичне завершення процесу Node.js у разі збою з'єднання
        process.exit(1);
    }
};

module.exports = connectDB;