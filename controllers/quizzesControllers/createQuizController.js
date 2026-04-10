import {pool} from "../../db/db.js";

export const createQuizController = async (req, res) => {
    const { quizName, questions } = req.body;
    const user_id = req.user.id;

    try {
        if (!quizName || !questions || questions.length === 0) {
            return res.status(400).json({ success: false, message: 'Quiz name and questions are required' });
        }

        const quiz = await pool.query(
            'INSERT INTO quizzes (creator_id, title) VALUES ($1, $2) RETURNING id', [user_id, quizName]);
        const quiz_id = quiz.rows[0].id;
        await pool.query('INSERT INTO likes (quiz_id, count) VALUES ($1, 0)', [quiz_id]);

        for (const q of questions) {
            if (!q.text || q.answer === null) {
                return res.status(400).json({ success: false, message: 'All questions must have text and answer' });
            }
            await pool.query(
                'INSERT INTO questions (quiz_id, question, correct_variant) VALUES ($1, $2, $3)',
                [quiz_id, q.text, q.answer]);
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}
