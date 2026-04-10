import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/db.js';
import 'dotenv/config.js';

export const signInController = async (req, res) => {
    const { email, password, username } = req.body;

    const hash = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hash]
        );

        const userId = result.rows[0].id;

        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('SignIn error:', error);
        res.status(500).json({ success: false, message: 'Account already exists!' });
    }
}
