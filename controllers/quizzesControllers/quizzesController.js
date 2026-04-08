import {pool} from "../../db/db.js";

export const quizzesController = async (req, res) => {
    try {
        const quizzes = await pool.query('SELECT * FROM quizzes');

        return res.status(200).json({ success: true, quizzes: quizzes.rows });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}