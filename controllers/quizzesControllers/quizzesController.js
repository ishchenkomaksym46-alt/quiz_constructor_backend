import {pool} from "../../db/db.js";

export const quizzesController = async (req, res) => {
    console.log('\n=== Quizzes Controller ===');
    const { filter = 'newest', page = 1 } = req.query;
    const pageNum = parseInt(page, 10);
    console.log('Filter:', filter, 'Page:', pageNum);

    if(pageNum <= 0 || isNaN(pageNum)) {
        console.log('❌ Неверная страница');
        return res.status(400).send({ success: false, message: 'page not found' });
    }

    const limit = 10;
    const offset = (pageNum - 1) * limit;

    const sortMap = {
        newest: 'quizzes.created_at DESC',
        oldest: 'quizzes.created_at ASC',
        most_liked: 'like_count DESC',
    }

    const orderBy = sortMap[filter] || sortMap['newest']

    try {
        const quizzes = await pool.query(
            `SELECT quizzes.*, COALESCE(likes.count, 0) AS like_count FROM quizzes
            LEFT JOIN likes ON quizzes.id = likes.quiz_id
            ORDER BY ${orderBy}
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        console.log('✅ Квизов получено:', quizzes.rows.length);
        if (quizzes.rows.length > 0) {
            console.log('Первый квиз:', quizzes.rows[0].title);
        }

        return res.status(200).json({ success: true, quizzes: quizzes.rows });
    } catch (error) {
        console.error('❌ Database error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}