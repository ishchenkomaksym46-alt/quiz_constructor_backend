import {pool} from "../../db/db.js";

export const leaderboardController = async (req, res) => {
    const limit = req.query.limit || 10;

    try {
        const topQuizzes = await pool.query(`
            SELECT
                q.id,
                q.title,
                q.creator_id,
                u.email as creator_email,
                l.count as likes_count
            FROM quizzes q
            JOIN likes l ON q.id = l.quiz_id
            JOIN users u ON q.creator_id = u.id
            ORDER BY l.count DESC
            LIMIT $1
        `, [limit]);

        return res.status(200).json({
            success: true,
            leaderboard: topQuizzes.rows
        });
    } catch (error) {
        console.error('Leaderboard error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard'
        });
    }
}
