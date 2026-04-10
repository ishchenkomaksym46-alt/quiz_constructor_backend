import {pool} from "../../db/db.js";

export const deleteQuizController = async (req, res) => {
    const { id } = req.query;

    try {
        await pool.query('DELETE FROM questions WHERE quiz_id = $1', [id]);
        await pool.query('DELETE FROM quizzes WHERE id = $1', [id]);

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}