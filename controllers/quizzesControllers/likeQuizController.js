import {pool} from "../../db/db.js";

export const likeQuizController = async (req, res) => {
    const { quiz_id } = req.query;
    const user_id = req.user.id;

    try {
        // Проверяем, лайкнул ли пользователь уже этот квиз
        const checkLike = await pool.query(
            'SELECT id FROM quiz_likes WHERE user_id = $1 AND quiz_id = $2',
            [user_id, quiz_id]
        );

        if (checkLike.rows.length > 0) {
            // Если уже лайкнул - удаляем лайк (анлайк)
            await pool.query(
                'DELETE FROM quiz_likes WHERE user_id = $1 AND quiz_id = $2',
                [user_id, quiz_id]
            );

            // Уменьшаем счетчик
            await pool.query(
                `INSERT INTO likes (quiz_id, count) VALUES ($1, 0)
                 ON CONFLICT (quiz_id) DO UPDATE SET count = GREATEST(likes.count - 1, 0)`,
                [quiz_id]
            );

            return res.status(200).json({ success: true, action: 'unliked' });
        } else {
            // Если не лайкнул - добавляем лайк
            await pool.query(
                'INSERT INTO quiz_likes (user_id, quiz_id) VALUES ($1, $2)',
                [user_id, quiz_id]
            );

            // Увеличиваем счетчик
            await pool.query(
                `INSERT INTO likes (quiz_id, count) VALUES ($1, 1)
                 ON CONFLICT (quiz_id) DO UPDATE SET count = likes.count + 1`,
                [quiz_id]
            );

            return res.status(200).json({ success: true, action: 'liked' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: 'Unknown error occurred' });
    }
}