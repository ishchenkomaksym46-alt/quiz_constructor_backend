import {pool} from "../../db/db.js";

export const getUserEmailController = async (req, res) => {
    try {
        const user = await pool.query('SELECT email FROM users WHERE id = $1', [req.user.id]);

        if(user.rows.length === 0) {
            return res.status(403).send({ success: false, message: 'No user found.' });
        }

        const email = user.rows[0].email;

        return res.status(200).json({ success: true, email });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}