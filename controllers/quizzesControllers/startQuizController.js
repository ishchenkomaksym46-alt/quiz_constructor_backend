import {pool} from '../../db/db.js';

export const startQuizController = async (req, res) => {
    const { id, question = 1 } = req.query;
    const limit = 1;
    const offset = ( question - 1 ) * limit;

    if(question < 1) {
        return res.status(400).json({ success: false, message: 'Invalid question number' });
    }

    try {
        const count = await pool.query('SELECT COUNT(id) FROM questions WHERE quiz_id = $1', [id]);

        if(count < question) {
            return res.status(400).json({ success: false, message: 'Invalid question number' });
        }

        const questions = await pool.query('SELECT * FROM questions WHERE quiz_id = $1 LIMIT $2 OFFSET $3', [id, limit, offset]);

        if (questions.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Questions not found' });
        }

        return res.status(200).json({ success: true, questions: questions.rows });
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}