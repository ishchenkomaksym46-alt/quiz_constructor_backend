import {pool} from "../db/db.js";

export default async function isOwnerMiddleware(req, res, next) {
    const { id } = req.query;

    try {
        const user = await pool.query('SELECT creator_id FROM quizzes WHERE id = $1', [id]);
        const userId = user.rows[0].creator_id;

        if (userId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Forbidden: You are not the owner of this quiz' });
        }

        res.status(200).send({ success: true });
        next();
    } catch (error) {
        console.error('Error in isOwnerMiddleware:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}