import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../../db/db.js';
import 'dotenv/config.js';

export const signInController = async (req, res) => {
    const { email, password, username } = req.body;
    console.log('\n=== SignIn Controller ===');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    const hash = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
            [username, email, hash]
        );

        const userId = result.rows[0].id;
        console.log('✅ Пользователь создан, ID:', userId);

        const token = jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000
        };

        console.log('Cookie настройки:', cookieOptions);
        res.cookie('token', token, cookieOptions);
        console.log('✅ Cookie установлена');

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ SignIn error:', error);
        res.status(500).json({ success: false, message: 'Account already exists!' });
    }
}
