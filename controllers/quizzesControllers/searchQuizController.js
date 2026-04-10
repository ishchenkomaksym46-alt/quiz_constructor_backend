import {pool} from "../../db/db.js";

export const searchQuizController = async (req, res) => {
    const { search, page = 1 } = req.query;

    if(page <= 0) {
        return res.status(404).json({ success: false, message: 'page not found' });
    }

    const limit = 1;
    const offset = ( page - 1) * limit;

    try {

        const quizzes = await pool.query('SELECT * FROM quizzes WHERE title ILIKE $1 LIMIT $2 OFFSET $3', [`%${search}%`, limit, offset]);

        return res.status(200).json({ success: true, quizzes: quizzes.rows });
    } catch (error) {
        return res.status(400).send({ success: false, message: 'Search failed' });
    }
}