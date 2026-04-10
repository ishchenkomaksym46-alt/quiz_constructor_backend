import {pool} from "../../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config.js'

export const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT id, password FROM users WHERE email = $1',
            [email]);

        if(result.rows.length === 0) {
            return res.status(401).send({ success: false, message: 'User is not found' });
        }

        const user = result.rows[0];
        const compare = await bcrypt.compare(password, user.password);

        if (!compare) {
            return res.status(401).send({ success: false, message: 'Invalid email or password!' });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 3600000
        });

        return res.status(200).send({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send({ success: false, message: 'Invalid email or password' });
    }
}