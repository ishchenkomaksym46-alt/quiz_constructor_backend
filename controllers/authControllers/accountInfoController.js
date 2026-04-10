import {pool} from "../../db/db.js";

export const accountInfoController = async (req, res) => {
    console.log('\n=== Account Info Controller ===');
    console.log('User ID:', req.user.id);

    try {
        const account = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
        console.log('Найдено записей:', account.rows.length);

        if(account.rows.length === 0) {
            console.log('❌ Аккаунт не найден');
            return res.status(403).send({ success: false, message: 'No account found.' });
        }

        console.log('✅ Аккаунт найден:', account.rows[0].email);
        return res.status(200).send({ success: true, accountInfo: account.rows });
    } catch (error) {
        console.error('❌ Error:', error);
        return res.status(500).send({ success: false, message: error.message });
    }
}