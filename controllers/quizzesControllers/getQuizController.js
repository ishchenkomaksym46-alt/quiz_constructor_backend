import {pool} from "../../db/db.js";

export const getQuizController = async (req, res) => {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Quiz ID is required' });
    }

    try {
        const quiz = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);

        if (quiz.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const questions = await pool.query('SELECT * FROM questions WHERE quiz_id = $1', [id]);

        return res.status(200).json({
            success: true,
            quiz: quiz.rows[0],
            questions: questions.rows
        });
    } catch (error) {
        console.error('Get quiz error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
