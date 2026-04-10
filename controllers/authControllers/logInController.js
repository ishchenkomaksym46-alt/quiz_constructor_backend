import {pool} from "../../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config.js'

export const loginController = async (req, res) => {
    const { email, password } = req.body;
    console.log('\n=== Login Controller ===');
    console.log('Email:', email);
    console.log('NODE_ENV:', process.env.NODE_ENV);

    try {
        const result = await pool.query('SELECT id, password FROM users WHERE email = $1',
            [email]);

        if(result.rows.length === 0) {
            console.log('❌ Пользователь не найден');
            return res.status(401).send({ success: false, message: 'User is not found' });
        }

        const user = result.rows[0];
        const compare = await bcrypt.compare(password, user.password);

        if (!compare) {
            console.log('❌ Неверный пароль');
            return res.status(401).send({ success: false, message: 'Invalid email or password!' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
        );

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000
        };

        console.log('Cookie настройки:', cookieOptions);
        res.cookie('token', token, cookieOptions);
        console.log('✅ Cookie установлена, user ID:', user.id);

        return res.status(200).send({ success: true });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).send({ success: false, message: 'Invalid email or password' });
    }
}