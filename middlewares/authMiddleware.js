import jwt from "jsonwebtoken";
import 'dotenv/config.js';

export const authMiddleware = (req, res, next) => {
    console.log('\n=== Auth Middleware ===');
    console.log('Cookies:', req.cookies);

    const token = req.cookies.token;
    console.log('Token найден:', token ? 'Да' : 'Нет');

    if(!token) {
        console.log('❌ Токен отсутствует');
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Токен валиден, user ID:', req.user.id);
        next();
    } catch (error) {
        console.log('❌ Ошибка проверки токена:', error.message);
        return res.status(401).json({ success: false, message: 'Not valid token' });
    }
}