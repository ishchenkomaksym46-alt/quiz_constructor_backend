import {pool} from "../../db/db.js";

export const getQuizzesController = async (req, res) => {
    try {
        const quizzes = await pool.query(
            'SELECT * FROM quizzes WHERE creator_id = $1', [req.user.id]);

        return res.status(200).json({ success: true, quizzes: quizzes.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: error.message });
    }
}