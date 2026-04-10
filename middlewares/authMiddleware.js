import jwt from "jsonwebtoken";
import 'dotenv/config.js';

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({ success: false, message: 'No token provided' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not valid token' });
    }
}