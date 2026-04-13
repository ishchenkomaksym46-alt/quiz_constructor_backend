import {pool} from "../../db/db.js";

export const editQuizController = async (req, res) => {
    const { id } = req.query;
    const { quizName, questions } = req.body;

    if (!id) {
        return res.status(400).json({ success: false, message: 'Quiz ID is required' });
    }

    try {
        // Update quiz title
        if (quizName) {
            await pool.query('UPDATE quizzes SET title = $1 WHERE id = $2', [quizName, id]);
        }

        // Update questions if provided
        if (questions && questions.length > 0) {
            // Delete existing questions
            await pool.query('DELETE FROM questions WHERE quiz_id = $1', [id]);

            // Insert new questions
            for (const q of questions) {
                if (!q.text || q.answer === null) {
                    return res.status(400).json({
                        success: false,
                        message: 'All questions must have text and answer'
                    });
                }
                await pool.query(
                    'INSERT INTO questions (quiz_id, question, correct_variant) VALUES ($1, $2, $3)',
                    [id, q.text, q.answer]
                );
            }
        }

        return res.status(200).json({ success: true, message: 'Quiz updated successfully' });
    } catch (error) {
        console.error('Edit quiz error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
