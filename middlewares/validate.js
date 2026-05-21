const { validationResult } = require('express-validator');

// Перевірка результатів валідації полів, сформованих express-validator
module.exports = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorArray = errors.array().map(e => ({ field: e.path, msg: e.msg }));
        
        return res.status(400).json({
            success: false,
            // Передача першого повідомлення про помилку з масиву
            message: errorArray[0].msg, 
            errors: errorArray,
            statusCode: 400
        });
    }
    next();
};