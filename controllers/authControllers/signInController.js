import bcrypt from 'bcrypt';
import { pool } from '../../db/db.js'

export const signInController = async (req, res) => {
    const { email, password, username } = req.body;

    const hash = await bcrypt.hash(password, 10);

    try {
        await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hash]);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('SignIn error:', error);
        res.status(500).json({ success: false, message: 'Account already exists!' });
    }
}
