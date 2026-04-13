import './loadEnv.js';
import express from "express";
import cors from 'cors'
import { signInController } from "./controllers/authControllers/signInController.js";
import { loginController } from "./controllers/authControllers/logInController.js";
import cookieParser from "cookie-parser";
import {authMiddleware} from "./middlewares/authMiddleware.js";
import {quizzesController} from "./controllers/quizzesControllers/quizzesController.js";
import {startQuizController} from "./controllers/quizzesControllers/startQuizController.js";
import {createQuizController} from "./controllers/quizzesControllers/createQuizController.js";
import {accountInfoController} from "./controllers/authControllers/accountInfoController.js";
import {getQuizzesController} from "./controllers/authControllers/getQuizzesController.js";
import isOwnerMiddleware from "./middlewares/isOwnerMiddleware.js";
import {deleteQuizController} from "./controllers/quizzesControllers/deleteQuizController.js";
import {getUserEmailController} from "./controllers/authControllers/getUserEmailController.js";
import {searchQuizController} from "./controllers/quizzesControllers/searchQuizController.js";
import {likeQuizController} from "./controllers/quizzesControllers/likeQuizController.js";
import {checkLikeController} from "./controllers/quizzesControllers/checkLikeController.js";
import 'dotenv/config';

const app = express();

// Логирование всех входящих запросов
app.use((req, res, next) => {
    console.log('\n=== Входящий запрос ===');
    console.log('Время:', new Date().toISOString());
    console.log('Метод:', req.method);
    console.log('URL:', req.url);
    console.log('Origin:', req.headers.origin);
    console.log('Cookies:', req.headers.cookie ? 'Есть' : 'Нет');
    next();
});

app.use(cors({
    origin: "https://quiz-master-pi-three.vercel.app",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Логирование после парсинга cookies
app.use((req, res, next) => {
    console.log('Распарсенные cookies:', req.cookies);
    next();
});

//POST
app.post("/auth/signin", signInController);
app.post('/auth/login', loginController);
app.post('/quizzes/create', authMiddleware, createQuizController);

//GET
app.get('/quizzes', quizzesController);
app.get('/quizzes/start', authMiddleware, startQuizController);
app.get('/checkAuth', authMiddleware, accountInfoController);
app.get('/getQuizzes', authMiddleware, getQuizzesController);
app.get('/checkAuth', authMiddleware, (req, res) => {
    return res.status(200).json({ success: true });
})
app.get('/user', authMiddleware, getUserEmailController);
app.get('/searchQuiz', searchQuizController);
app.get('/quizzes/like', authMiddleware, likeQuizController);
app.get('/quizzes/checkLike', authMiddleware, checkLikeController);

//DELETE
app.delete('/deleteQuiz', authMiddleware, isOwnerMiddleware, deleteQuizController);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
