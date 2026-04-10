import {pool} from "../../db/db.js";

export const accountInfoController = async (req, res) => {
    try {
        const account = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);

        if(account.rows.length === 0) {
            return res.status(403).send({ success: false, message: 'No account found.' });
        }

        return res.status(200).send({ success: true, accountInfo: account.rows });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: error.message });
    }
}