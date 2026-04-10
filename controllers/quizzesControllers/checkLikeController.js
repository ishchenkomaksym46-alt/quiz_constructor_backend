import {pool} from "../../db/db.js";

export const checkLikeController = async (req, res) => {
    const { quiz_id } = req.query;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'SELECT id FROM quiz_likes WHERE user_id = $1 AND quiz_id = $2',
            [user_id, quiz_id]
        );

        const isLiked = result.rows.length > 0;

        // Получаем количество лайков
        const likesCount = await pool.query(
            'SELECT count FROM likes WHERE quiz_id = $1',
            [quiz_id]
        );

        return res.status(200).json({
            success: true,
            isLiked,
            count: likesCount.rows[0]?.count || 0
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Unknown error occurred' });
    }
}
